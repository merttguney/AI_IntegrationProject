import dotenv from "dotenv";
dotenv.config();

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"; 