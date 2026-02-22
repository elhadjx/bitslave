import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  userId: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  createdAt: Date;
}

const LogSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
  },
  { timestamps: { updatedAt: false } }
);

export const Log = mongoose.model<ILog>('Log', LogSchema);
