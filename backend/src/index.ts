import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import aiRouter from "./api/ai";
import authRouter from "./api/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS ayarı: Frontend'in adresini buraya yaz
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});