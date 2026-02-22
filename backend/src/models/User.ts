import mongoose from 'mongoose';

export interface IUser {
  email: string;
  passwordHash: string;
  paymentStatus: 'pending' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
