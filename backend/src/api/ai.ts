import { Router } from "express";
import { generateOpenAICompletion } from "../services/openaiService";
import { CategoryAIService } from "../services/categoryAIService";

const router = Router();

// Category için AI servis örneği
const categoryAI = new CategoryAIService();

// POST /api/ai/translate-and-seo
// Body: { baseFields: { name, description }, targetLanguages: ["en", "fr", "tr"] }
router.post("/translate-and-seo", (req, res) => {
  (async () => {
    const { baseFields, targetLanguages } = req.body || {};
    if (!baseFields || !targetLanguages || typeof baseFields !== "object" || !Array.isArray(targetLanguages)) {
      return res.status(400).json({ error: "baseFields ve targetLanguages zorunludur" });
    }

    // Her dil için başlık, açıklama, meta title, meta description ve anahtar kelimeleri AI ile üret
    const results: Record<string, {
      title: string;
      description: string;
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    }> = {};

    for (const lang of targetLanguages) {
      // Promptları generic servis ile oluştur
      const titlePrompt = categoryAI.buildPrompt(baseFields, "title");
      const descPrompt = categoryAI.buildPrompt(baseFields, "description");
      const metaTitlePrompt = categoryAI.buildPrompt(baseFields, "metaTitle", lang);
      const metaDescPrompt = categoryAI.buildPrompt(baseFields, "metaDescription", lang);
      const keywordsPrompt = categoryAI.buildPrompt(baseFields, "keywords", lang);

      let title = "AI service error";
      let description = "AI service error";
      let metaTitle = "AI service error";
      let metaDescription = "AI service error";
      let keywords: string[] = ["AI service error"];

      try {
        title = await generateOpenAICompletion(titlePrompt, lang);
      } catch {}
      try {
        description = await generateOpenAICompletion(descPrompt, lang);
      } catch {}
      try {
        metaTitle = await generateOpenAICompletion(metaTitlePrompt, lang);
      } catch {}
      try {
        metaDescription = await generateOpenAICompletion(metaDescPrompt, lang);
      } catch {}
      try {
        const keywordsRaw = await generateOpenAICompletion(keywordsPrompt, lang);
        keywords = categoryAI.parseAIResponse(keywordsRaw, "keywords") as string[];
      } catch {
        keywords = ["AI service error"];
      }

      // Sonuçları ilgili dile ekle
      results[lang] = { title, description, metaTitle, metaDescription, keywords };
    }

    // Sonuçları frontend'e döndür
    res.json({ results });
  })();
});

export default router; 