import axios from "axios";
import { GEMINI_API_KEY, GEMINI_API_URL } from "../config/gemini";

export async function generateGeminiCompletion(prompt: string, language: string) {
  const requestBody = {
    contents: [
      { parts: [ { text: prompt } ] }
    ]
  };

  const start = Date.now(); // Yanıt süresi ölçümü başlat
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const durationMs = Date.now() - start;
    console.log("Gemini yanıt süresi:", durationMs, "ms");
    // Gemini API response formatına göre cevabı döndür
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini response error";
  } catch (err: any) {
    const durationMs = Date.now() - start;
    console.log("Gemini yanıt süresi:", durationMs, "ms (HATA)");
    console.error("Gemini API error:", err?.response?.data || err?.message || err);
    return "AI service error";
  }
} 