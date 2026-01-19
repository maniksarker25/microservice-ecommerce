import nodemailer from "nodemailer";
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http/:localhost:4004";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT as string) || 1025,
});

export const defaultSender = process.env.DEFAULT_SENDER_EMAIL || "manik@gmail.com";
