import { consumeQueue } from "./rabbitmqService";
import nodemailer from "nodemailer";
import { config } from "../config/config";

const NOTIFICATION_QUEUE = "notificationQueue";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function startNotificationWorker() {
  await consumeQueue(NOTIFICATION_QUEUE, async (msg, channel) => {
    if (msg) {
      const notification = JSON.parse(msg.content.toString());
      if (notification.type === "email") {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: notification.to,
            subject: notification.subject,
            text: notification.body,
          });
          console.log("E-posta gönderildi:", notification);
        } catch (err) {
          console.error("E-posta gönderilemedi:", err);
        }
      } else {
        console.log("Bildirim alındı:", notification);
      }
      channel.ack(msg);
    }
  });
}

if (require.main === module) {
  startNotificationWorker().then(() => {
    console.log("Notification worker başlatıldı.");
  });
} 