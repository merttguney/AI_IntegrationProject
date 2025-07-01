import { generateOpenAICompletion } from "./openaiService";
import { generateGeminiCompletion } from "./geminiService";

export async function generateAICompletion(provider: string, prompt: string, language: string) {
  if (provider === "gemini") {
    return generateGeminiCompletion(prompt, language);
  }
  // Varsayılan olarak OpenAI
  return generateOpenAICompletion(prompt, language);
} 