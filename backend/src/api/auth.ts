import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { registerToGemini, registerToOpenAI } from "../services/aiProvider";

const router = Router();
const users: User[] = [];

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password, provider, language } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  // Dış servise register
  if (provider === "gemini") {
    await registerToGemini(username, password);
  } else if (provider === "openai") {
    await registerToOpenAI(username, password);
  } else {
    res.status(400).json({ error: "Geçersiz provider" });
    return;
  }
  const user: User = { id: Date.now().toString(), username, passwordHash, provider, allowedLanguages: [language] };
  users.push(user);
  res.json({ message: "Kayıt başarılı" });
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password, provider, language } = req.body;
  const user = users.find(u => u.username === username && u.provider === provider && u.allowedLanguages.includes(language));
  if (!user) {
    res.status(401).json({ error: "Kullanıcı bulunamadı" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Şifre yanlış" });
    return;
  }
  const token = jwt.sign({ id: user.id, username: user.username, provider, language }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  res.json({ token });
});

export default router; 