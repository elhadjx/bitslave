import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillConfig {
  emailProcessing: boolean;
  scheduleManagement: boolean;
  dataAnalysis: boolean;
  reportGeneration: boolean;
  taskAutomation: boolean;
  customerSupport: boolean;
}

export interface IInstanceHealth {
  uptimeMs: number;
  configured: boolean;
  gatewayRunning: boolean;
  gatewayReachable: boolean;
  lastError: string | null;
  timestamp: Date;
}

export interface IAgentConfig extends Document {
  userId: mongoose.Types.ObjectId;
  telegramToken: string;
  discordToken?: string;
  slackBotToken?: string;
  slackAppToken?: string;
  llmProvider: string;
  llmApiKey: string;
  systemPrompt?: string;
  isDeployed: boolean;
  railwayServiceId?: string;
  setupPassword?: string;
  railwayDomain?: string;
  configuredAt?: Date;
  instanceHealth?: IInstanceHealth;
  skills: ISkillConfig;
  createdAt: Date;
  updatedAt: Date;
}

const AgentConfigSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    telegramToken: { type: String, required: true },
    discordToken: { type: String },
    slackBotToken: { type: String },
    slackAppToken: { type: String },
    llmProvider: { type: String, required: true, enum: ['openai', 'anthropic', 'deepseek', 'gemini', 'openrouter'] },
    llmApiKey: { type: String, required: true },
    systemPrompt: { type: String },
    isDeployed: { type: Boolean, default: false },
    railwayServiceId: { type: String },
    setupPassword: { type: String },
    railwayDomain: { type: String },
    configuredAt: { type: Date },
    instanceHealth: {
      uptimeMs: { type: Number },
      configured: { type: Boolean },
      gatewayRunning: { type: Boolean },
      gatewayReachable: { type: Boolean },
      lastError: { type: String },
      timestamp: { type: Date },
    },
    skills: {
      emailProcessing: { type: Boolean, default: false },
      scheduleManagement: { type: Boolean, default: false },
      dataAnalysis: { type: Boolean, default: false },
      reportGeneration: { type: Boolean, default: false },
      taskAutomation: { type: Boolean, default: false },
      customerSupport: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const AgentConfig = mongoose.model<IAgentConfig>('AgentConfig', AgentConfigSchema);

