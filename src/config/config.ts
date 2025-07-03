import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "defaultsecret",
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    apiUrl: process.env.GEMINI_API_URL || "",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    apiUrl: process.env.OPENAI_API_URL || "",
  },
  mailServiceApiKey: process.env.MAIL_SERVICE_API_KEY || "",
  rabbitmqUrl: process.env.RABBITMQ_URL || "",
}; 