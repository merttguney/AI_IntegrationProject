import express from "express";
import dotenv from "dotenv";
import aiRouter from "./api/ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/ai", aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
