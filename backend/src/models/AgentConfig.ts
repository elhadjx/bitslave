import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillConfig {
  emailProcessing: boolean;
  scheduleManagement: boolean;
  dataAnalysis: boolean;
  reportGeneration: boolean;
  taskAutomation: boolean;
  customerSupport: boolean;
}

export interface IAgentConfig extends Document {
  userId: mongoose.Types.ObjectId;
  telegramToken: string;
  llmProvider: string;
  llmApiKey: string;
  isDeployed: boolean;
  skills: ISkillConfig;
  createdAt: Date;
  updatedAt: Date;
}

const AgentConfigSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    telegramToken: { type: String, required: true },
    llmProvider: { type: String, required: true, enum: ['openai', 'anthropic', 'deepseek'] },
    llmApiKey: { type: String, required: true },
    isDeployed: { type: Boolean, default: false },
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
