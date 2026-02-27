import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/bitslave",
  polarAccessToken: process.env.POLAR_ACCESS_TOKEN || "",
  polarSubscriptionProductId: process.env.POLAR_SUBSCRIPTION_PRODUCT_ID || "dummy-product-id",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  telegramToken: process.env.TELEGRAM_TOKEN || "",
  llmProvider: process.env.LLM_PROVIDER || "openai",
  llmApiKey: process.env.LLM_API_KEY || "",
  skills: JSON.parse(process.env.SKILLS || "{}"),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  backendUrl: process.env.BACKEND_URL || "",
  railwayProjectToken: process.env.RAILWAY_PROJECT_TOKEN || "",
  railwayProjectId: process.env.RAILWAY_PROJECT_ID || "",
  inTest: process.env.INTEST === 'true',
};
