import dotenv from "dotenv";
dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent";