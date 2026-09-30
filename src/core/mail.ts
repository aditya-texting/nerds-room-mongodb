import nodemailer from 'nodemailer';
import { getOrganizerPendingTemplate, getForgotPasswordTemplate } from './emails';
import { ENV } from './env';

const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: parseInt(ENV.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

export const sendOrganizerPendingEmail = async (toEmail: string, name: string) => {
  const logoUrl = `${ENV.API_URL.replace('/api', '')}/logo.jpg`; // Points to public/logo.jpg
  const htmlContent = getOrganizerPendingTemplate(name, logoUrl);

  try {
    await transporter.sendMail({
      from: `NerdsRoom <${ENV.SMTP_USER}>`,
      to: toEmail,
      subject: 'Organizer Registration Pending - NerdsRoom',
      html: htmlContent,
    });
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
  }
};

export const sendForgotPasswordEmail = async (toEmail: string, name: string, otp: string) => {
  const logoUrl = `${ENV.API_URL.replace('/api', '')}/logo.jpg`;
  const htmlContent = getForgotPasswordTemplate(name, otp, logoUrl);

  try {
    await transporter.sendMail({
      from: `NerdsRoom <${ENV.SMTP_USER}>`,
      to: toEmail,
      subject: 'Password Reset OTP - NerdsRoom',
      html: htmlContent,
    });
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
    throw error; // re-throw so API returns 500 with actual error
  }
};

