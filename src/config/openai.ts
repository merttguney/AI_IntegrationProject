import dotenv from "dotenv";
import { config } from "./config";
dotenv.config();

export const OPENAI_API_KEY = config.openai.apiKey;
export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"; 