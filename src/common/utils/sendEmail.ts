/**
 * @file sendEmail.ts
 * @description Provides a function for sending emails.
 */

import nodemailer from "nodemailer";
import { ENVIRONMENT } from "../config/environment";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the configured transporter.
 *
 * @param options - The email options including recipient, subject, and HTML content
 * @throws An error if the email sending fails
 */
const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: ENVIRONMENT.EMAIL.USER,
      pass: ENVIRONMENT.EMAIL.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `House Finder <${ENVIRONMENT.EMAIL.USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
