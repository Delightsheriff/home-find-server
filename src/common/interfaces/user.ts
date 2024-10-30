import { Schema } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  profilePictureUrl: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpiresAt: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  passwordResetAttempts: number;
  passwordChangedAt: Date;
  refreshToken: string | null;
  propertiesToReview?: Schema.Types.ObjectId[] | null; // New field for admin reviews
}
