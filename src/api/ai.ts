import { Router } from "express";
import { generateAICompletion } from "../services/aiProvider";

const router = Router();

// POST /api/ai/translate-and-seo
// Body: { baseFields: { name, description }, targetLanguages: ["en", "fr", "tr"], provider: "openai" | "gemini" }
router.post("/translate-and-seo", async (req: any, res: any) => {
  const { baseFields, targetLanguages, provider } = req.body || {};
  if (
    !baseFields ||
    !targetLanguages ||
    typeof baseFields !== "object" ||
    !Array.isArray(targetLanguages)
  ) {
    return res.status(400).json({ error: "baseFields ve targetLanguages zorunludur" });
  }

  const aiProvider = provider || "openai";
  const results: Record<string, { title: string; description: string; keywords: string[] }> = {};

  for (const lang of targetLanguages) {
    // Title
    const titlePrompt = `Generate a short, catchy, SEO-friendly product title for a product with the following details: Name: ${baseFields.name}, Description: ${baseFields.description}. Return only the title in ${lang}.`;
    // Description
    const descPrompt = `Generate a detailed, SEO-friendly product description for a product with the following details: Name: ${baseFields.name}, Description: ${baseFields.description}. Return only the description in ${lang}.`;
    // Keywords
    const keywordsPrompt = `Generate 5 SEO keywords (as a JSON array of strings) for a product with the following details: Name: ${baseFields.name}, Description: ${baseFields.description}. Return only the array in ${lang}.`;

    let title = "AI service error";
    let description = "AI service error";
    let keywords: string[] = ["AI service error"];

    try {
      title = await generateAICompletion(aiProvider, titlePrompt, lang);
    } catch {}
    try {
      description = await generateAICompletion(aiProvider, descPrompt, lang);
    } catch {}
    try {
      const keywordsRaw = await generateAICompletion(aiProvider, keywordsPrompt, lang);
      // Try to parse as JSON array
      const parsed = JSON.parse(keywordsRaw);
      if (Array.isArray(parsed)) {
        keywords = parsed;
      } else {
        keywords = [keywordsRaw];
      }
    } catch {}

    results[lang] = { title, description, keywords };
  }

  res.json({ results });
});

export default router; 