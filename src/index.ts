import express from "express";
import dotenv from "dotenv";
import aiRouter from "./api/ai";
import authRouter from "./api/auth";
import notificationRouter from './api/notification';
import { config } from "./config/config";

dotenv.config();

const app = express();
const PORT = config.port;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);
app.use('/notification', notificationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
