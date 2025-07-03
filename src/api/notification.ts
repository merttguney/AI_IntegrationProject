import { Router, Request, Response } from "express";
import { sendToQueue } from "../services/rabbitmqService";

const router = Router();
const NOTIFICATION_QUEUE = "notificationQueue";

// Bildirim kuyruğuna iş ekleyen endpoint
router.post("/send", async (req: Request, res: Response): Promise<void> => {
  const { type, to, subject, body } = req.body;
  if (!type || !to || !subject || !body) {
    res.status(400).json({ error: "Eksik bildirim verisi" });
    return;
  }
  await sendToQueue(NOTIFICATION_QUEUE, { type, to, subject, body });
  res.json({ message: "Bildirim kuyruğa eklendi" });
});

export default router; 