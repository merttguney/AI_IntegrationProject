import axios from "axios";
import { OPENAI_API_KEY, OPENAI_API_URL } from "../config/openai";

export async function generateOpenAICompletion(prompt: string, language: string) {
  const messages = [
    { role: "system", content: `You are a helpful assistant that writes SEO-friendly product details in ${language}.` },
    { role: "user", content: prompt }
  ];

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7
    },
    {
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content;
} 