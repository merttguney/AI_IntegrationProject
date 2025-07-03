export interface User {
  id: string;
  username: string;
  passwordHash: string;
  provider: "openai" | "gemini";
  allowedLanguages: string[];
} 