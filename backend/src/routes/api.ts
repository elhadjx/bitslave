import { Router, Request, Response } from 'express';
import { AgentConfig } from '../models/AgentConfig';
import { Log } from '../models/Log';
import { RailwayOrchestrator } from '../bot/railway-orchestrator';
import { BillingService } from '../billing/polar';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const apiRouter = Router();

// ===== Public endpoints (no auth — called by deployed instances) =====

// POST /api/instance-callback — receives status updates from deployed instances
apiRouter.post('/instance-callback', async (req: Request, res: Response) => {
  try {
    const { instanceId, status, configured, gatewayRunning, timestamp, error, provider } = req.body;
    if (!instanceId) return res.status(400).json({ error: 'Missing instanceId' });

    const config = await AgentConfig.findOne({ railwayServiceId: instanceId });
    if (!config) return res.status(404).json({ error: 'Instance not found' });

    if (status === 'configured') {
      config.configuredAt = new Date(timestamp || Date.now());
      await config.save();
      await Log.create({ userId: config.userId, message: `Instance auto-configured (provider: ${provider || 'unknown'})`, level: 'info' });
    } else if (status === 'running') {
      await Log.create({ userId: config.userId, message: 'Instance gateway started', level: 'info' });
    } else if (status === 'error') {
      await Log.create({ userId: config.userId, message: `Instance error: ${error || 'unknown'}`, level: 'error' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('[instance-callback]', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// POST /api/instance-health — receives periodic health metrics from instances
apiRouter.post('/instance-health', async (req: Request, res: Response) => {
  try {
    const { instanceId, uptimeMs, configured, gatewayRunning, gatewayReachable, lastError, timestamp } = req.body;
    if (!instanceId) return res.status(400).json({ error: 'Missing instanceId' });

    const config = await AgentConfig.findOne({ railwayServiceId: instanceId });
    if (!config) return res.status(404).json({ error: 'Instance not found' });

    config.instanceHealth = {
      uptimeMs: uptimeMs || 0,
      configured: Boolean(configured),
      gatewayRunning: Boolean(gatewayRunning),
      gatewayReachable: Boolean(gatewayReachable),
      lastError: lastError || null,
      timestamp: new Date(timestamp || Date.now()),
    };
    await config.save();

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
});


// ===== Authenticated endpoints =====

apiRouter.use(requireAuth);

// GET /status
apiRouter.get('/status', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const config = await AgentConfig.findOne({ userId });
    
    if (!config) {
      return res.json({ isDeployed: false, config: null });
    }

    res.json({ isDeployed: config.isDeployed, config });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// POST /deploy
apiRouter.post('/deploy', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { telegramToken, llmProvider, llmApiKey, discordToken, slackBotToken, slackAppToken, systemPrompt } = req.body;
    
    let config = await AgentConfig.findOne({ userId });
    
    if (config) {
      config.telegramToken = telegramToken;
      config.llmProvider = llmProvider;
      config.llmApiKey = llmApiKey;
      config.discordToken = discordToken || undefined;
      config.slackBotToken = slackBotToken || undefined;
      config.slackAppToken = slackAppToken || undefined;
      config.systemPrompt = systemPrompt || undefined;
      config.isDeployed = true;
      (config as any).configuredAt = undefined;
      await config.save();
    } else {
      config = await AgentConfig.create({
        userId,
        telegramToken,
        llmProvider,
        llmApiKey,
        discordToken: discordToken || undefined,
        slackBotToken: slackBotToken || undefined,
        slackAppToken: slackAppToken || undefined,
        systemPrompt: systemPrompt || undefined,
        isDeployed: true,
      });
    }

    // Trigger Railway Deployment
    const result = await RailwayOrchestrator.deployAgent(config);
    
    if (result) {
      config.railwayServiceId = result.serviceId;
      config.railwayDomain = result.domain;
      config.setupPassword = result.setupPassword;
      await config.save();
      await Log.create({ userId, message: `Agent deployed via Railway with service ID: ${result.serviceId}`, level: 'info' });
      res.json({ message: 'Deployment triggered successfully', config });
    } else {
      config.isDeployed = false;
      await config.save();
      await Log.create({ userId, message: 'Failed to deploy agent via Railway', level: 'error' });
      res.status(500).json({ error: 'Failed to deploy service' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to deploy agent' });
  }
});

// POST /stop
apiRouter.post('/stop', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const config = await AgentConfig.findOne({ userId });
    
    if (config && config.isDeployed) {
      config.isDeployed = false;
      await config.save();
      
      const stopSuccess = await RailwayOrchestrator.stopAgent(config.railwayServiceId);
      
      if (stopSuccess) {
        config.railwayServiceId = "";
        (config as any).configuredAt = undefined;
        (config as any).instanceHealth = undefined;
        await config.save();
        await Log.create({ userId, message: 'Agent stopped via Railway Orchestrator', level: 'info' });
        res.json({ message: 'Agent stopped successfully' });
      } else {
        await Log.create({ userId, message: 'Failed to stop agent via Railway', level: 'error' });
        res.status(500).json({ error: 'Failed to stop service' });
      }
    } else {
      res.status(400).json({ error: 'Agent is not deployed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop agent' });
  }
});

// GET /setup-status — returns deployment progress from webhook callbacks
apiRouter.get('/setup-status', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const config = await AgentConfig.findOne({ userId });
    if (!config || !config.railwayDomain) {
      return res.json({ status: 'not_deployed' });
    }

    res.json({
      status: config.configuredAt ? 'configured' : (config.isDeployed ? 'provisioning' : 'offline'),
      configuredAt: config.configuredAt,
      instanceHealth: config.instanceHealth,
      domain: config.railwayDomain,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setup status' });
  }
});

// POST /instance/config — proxy config update to running instance
apiRouter.post('/instance/config', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const config = await AgentConfig.findOne({ userId });
    if (!config || !config.railwayDomain || !config.setupPassword) {
      return res.status(400).json({ error: 'No deployed instance' });
    }

    const instanceUrl = `https://${config.railwayDomain}/api/config/update`;
    const authHeader = 'Basic ' + Buffer.from(`admin:${config.setupPassword}`).toString('base64');

    const response = await fetch(instanceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    // Sync changes to local DB
    if (req.body.telegramToken) config.telegramToken = req.body.telegramToken;
    if (req.body.discordToken) config.discordToken = req.body.discordToken;
    if (req.body.slackBotToken) config.slackBotToken = req.body.slackBotToken;
    if (req.body.slackAppToken) config.slackAppToken = req.body.slackAppToken;
    if (req.body.llmProvider) config.llmProvider = req.body.llmProvider;
    if (req.body.llmApiKey) config.llmApiKey = req.body.llmApiKey;
    if (req.body.systemPrompt !== undefined) config.systemPrompt = req.body.systemPrompt;
    if (req.body.skills) config.skills = { ...config.skills, ...req.body.skills };
    await config.save();

    await Log.create({ userId, message: `Config updated: ${Object.keys(req.body).join(', ')}`, level: 'info' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update instance config' });
  }
});

// POST /instance/channels/:channel/add — proxy channel add to instance
apiRouter.post('/instance/channels/:channel/add', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const config = await AgentConfig.findOne({ userId });
    if (!config || !config.railwayDomain || !config.setupPassword) {
      return res.status(400).json({ error: 'No deployed instance' });
    }

    const channel = req.params.channel;
    const instanceUrl = `https://${config.railwayDomain}/api/channels/${channel}/add`;
    const authHeader = 'Basic ' + Buffer.from(`admin:${config.setupPassword}`).toString('base64');

    const response = await fetch(instanceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    await Log.create({ userId, message: `Channel ${channel} added`, level: 'info' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add channel' });
  }
});

// POST /instance/channels/:channel/remove
apiRouter.post('/instance/channels/:channel/remove', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const config = await AgentConfig.findOne({ userId });
    if (!config || !config.railwayDomain || !config.setupPassword) {
      return res.status(400).json({ error: 'No deployed instance' });
    }

    const channel = req.params.channel;
    const instanceUrl = `https://${config.railwayDomain}/api/channels/${channel}/remove`;
    const authHeader = 'Basic ' + Buffer.from(`admin:${config.setupPassword}`).toString('base64');

    const response = await fetch(instanceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    await Log.create({ userId, message: `Channel ${channel} removed`, level: 'info' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove channel' });
  }
});

// GET /skills
apiRouter.get('/skills', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const config = await AgentConfig.findOne({ userId });
    if (!config) return res.json({ skills: {} });

    res.json({ skills: config.skills });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// POST /skills — update skills and push to running instance
apiRouter.post('/skills', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { skills } = req.body;
    
    let config = await AgentConfig.findOne({ userId });
    if (!config) {
      config = await AgentConfig.create({ userId, telegramToken: 'temp', llmProvider: 'openai', llmApiKey: 'temp', skills });
    } else {
      config.skills = { ...config.skills, ...skills };
      await config.save();
    }

    // Push to running instance if deployed
    if (config.isDeployed && config.railwayDomain && config.setupPassword) {
      try {
        const instanceUrl = `https://${config.railwayDomain}/api/config/update`;
        const authHeader = 'Basic ' + Buffer.from(`admin:${config.setupPassword}`).toString('base64');
        await fetch(instanceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
          body: JSON.stringify({ skills }),
        });
      } catch {
        // Best effort
      }
    }

    await Log.create({ userId, message: 'Skills updated', level: 'info' });
    res.json({ message: 'Skills updated successfully', skills: config.skills });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skills' });
  }
});

// GET /logs
apiRouter.get('/logs', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const logs = await Log.find({ userId }).sort({ createdAt: 1 }).limit(100);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// POST /billing/checkout
apiRouter.post('/billing/checkout', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, successUrl } = req.body;
    const pId = productId || 'dummy-product-id';
    const sUrl = successUrl || 'http://localhost:3000/dashboard';
    
    const checkoutUrl = await BillingService.createCheckoutSession(userId, pId, sUrl);
    res.json({ checkoutUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});
