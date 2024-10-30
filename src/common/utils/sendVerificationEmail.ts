/**
 * @file emailService.ts
 * @description Provides a service for sending verification emails.
 */

import sendEmail from "./sendEmail";
import { IUserDocument } from "../../models/userModel";
import { generateEmailVerificationToken } from "./helpers";

/**
 * Sends a verification email to the user.
 *
 * @param user - The user object
 * @param req - The Express request object
 */
export const sendVerificationEmail = async (
  user: IUserDocument,
  origin: string,
): Promise<void> => {
  const { token, expiresAt } = generateEmailVerificationToken(
    user._id.toString(),
  );

  // Update user with new token and expiration
  await user.updateOne({
    emailVerificationToken: token,
    emailVerificationExpiresAt: expiresAt,
  });
  await user.save();

  const verificationLink = `${origin}/api/v1/auth/verify-email?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Email Verification</h1>
          <p>Hi ${user.firstName},</p>
          <p>Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #4CAF50; color: white; padding: 14px 20px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
        </div>
    `,
  });
};
