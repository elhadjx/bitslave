import express from 'express';
import cors from 'cors';
import { config } from './config';
import { connectDB } from './db';
import { apiRouter } from './routes/api';
import { authRouter } from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', apiRouter);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(config.port, async () => {
  await connectDB();
  console.log(`Server listening on port ${config.port}`);
});
