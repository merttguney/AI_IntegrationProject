import { generateOpenAICompletion } from "./openaiService";
import { generateGeminiCompletion } from "./geminiService";

export async function generateAICompletion(provider: string, prompt: string, language: string) {
  console.log(`[AI] Provider: ${provider}, Language: ${language}`);
  if (provider === "gemini") {
    return generateGeminiCompletion(prompt, language);
  }
  // Varsayılan olarak OpenAI
  return generateOpenAICompletion(prompt, language);
}

export async function registerToGemini(username: string, password: string) {
  // Gerçek API'ye istek atılabilir
  // await axios.post("https://gemini.api/register", { username, password });
  return true;
}

export async function registerToOpenAI(username: string, password: string) {
  // await axios.post("https://openai.api/register", { username, password });
  return true;
} 