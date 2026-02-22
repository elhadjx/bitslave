import { Router, Request, Response } from 'express';
import { AgentConfig } from '../models/AgentConfig';
import { Log } from '../models/Log';
import { DockerOrchestrator } from '../bot/docker-orchestrator';
import { BillingService } from '../billing/polar';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const apiRouter = Router();

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

    const { telegramToken, llmProvider, llmApiKey } = req.body;
    
    let config = await AgentConfig.findOne({ userId });
    
    if (config) {
      config.telegramToken = telegramToken;
      config.llmProvider = llmProvider;
      config.llmApiKey = llmApiKey;
      config.isDeployed = true;
      await config.save();
    } else {
      config = await AgentConfig.create({
        userId,
        telegramToken,
        llmProvider,
        llmApiKey,
        isDeployed: true,
      });
    }

    // Trigger Docker Deployment here
    const deploySuccess = await DockerOrchestrator.deployAgent(config);
    
    if (deploySuccess) {
      await Log.create({ userId, message: 'Agent deployed via Docker Orchestrator', level: 'info' });
      res.json({ message: 'Deployment triggered successfully', config });
    } else {
      config.isDeployed = false;
      await config.save();
      await Log.create({ userId, message: 'Failed to deploy agent via Docker', level: 'error' });
      res.status(500).json({ error: 'Failed to deploy docker container' });
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
      
      // Trigger Docker Stop here
      const stopSuccess = await DockerOrchestrator.stopAgent(userId);
      
      if (stopSuccess) {
        await Log.create({ userId, message: 'Agent stopped via Docker Orchestrator', level: 'info' });
        res.json({ message: 'Agent stopped successfully' });
      } else {
        await Log.create({ userId, message: 'Failed to stop agent via Docker', level: 'error' });
        res.status(500).json({ error: 'Failed to stop docker container' });
      }
    } else {
      res.status(400).json({ error: 'Agent is not deployed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop agent' });
  }
});

// GET /skills
apiRouter.get('/skills', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const config = await AgentConfig.findOne({ userId });
    
    if (!config) {
      return res.json({ skills: {} });
    }

    res.json({ skills: config.skills });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// POST /skills
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
    
    // Default dummy ID for demonstration
    const pId = productId || 'dummy-product-id';
    const sUrl = successUrl || 'http://localhost:3000/dashboard';
    
    const checkoutUrl = await BillingService.createCheckoutSession(userId, pId, sUrl);
    
    res.json({ checkoutUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});
