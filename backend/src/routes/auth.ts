import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AgentConfig } from '../models/AgentConfig';
import { BillingService } from '../billing/polar';

import { config as appConfig } from '../config';

export const authRouter = Router();
const JWT_SECRET = appConfig.jwtSecret;

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, telegramToken, llmProvider, llmApiKey } = req.body;

    if (!name || !email || !password || !telegramToken || !llmProvider || !llmApiKey) {
      return res.status(400).json({ error: 'Missing required registration fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email, passwordHash, paymentStatus: 'pending' });
    await user.save();

    const config = new AgentConfig({
      userId: user._id,
      telegramToken,
      llmProvider,
      llmApiKey,
      isDeployed: false,
      skills: {
        emailProcessing: true,
        scheduleManagement: true,
        dataAnalysis: false,
        reportGeneration: true,
        taskAutomation: true,
        customerSupport: false,
      }
    });
    await config.save();

    let checkoutUrl = null;

    if (appConfig.inTest) {
      user.paymentStatus = 'paid';
      await user.save();
    } else {
      // Create Polar checkout session to finalize registration
      const productId = appConfig.polarSubscriptionProductId;
      const successUrl = `${appConfig.frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`;
      checkoutUrl = await BillingService.createCheckoutSession(user._id.toString(), productId, successUrl);
    }

    // Sign a token so the user is virtually "logged in" on the frontend before redirect.
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // After success on polar.sh, the frontend completes the registration flow.
    res.json({ 
      checkoutUrl, 
      token, 
      user: { name: user.name, email: user.email, paymentStatus: user.paymentStatus }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    /*
    // Optional: Protect access for unpaid users at login
    if (user.paymentStatus !== 'paid') {
       return res.status(403).json({ error: 'Payment required to access dashboard' });
    }
    */

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { name: user.name, email: user.email, paymentStatus: user.paymentStatus } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});
