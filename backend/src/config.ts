import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/bitslave",
  polarAccessToken: process.env.POLAR_ACCESS_TOKEN || "",
};
