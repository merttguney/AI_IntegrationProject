import { Router } from "express";
import { generateOpenAICompletion } from "../services/openaiService";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

// POST /api/ai/translate-and-seo
// Body: { baseFields: { name }, targetLanguages: ["en", "fr", "tr"] }
router.post("/translate-and-seo", (req, res) => {
  (async () => {
    const { baseFields, targetLanguages } = req.body || {};
    if (!baseFields || !targetLanguages || typeof baseFields !== "object" || !Array.isArray(targetLanguages)) {
      return res.status(400).json({ error: "baseFields ve targetLanguages zorunludur" });
    }

    // Her dil için başlık, açıklama ve anahtar kelimeleri OpenAI'dan alıp döneceğimiz sonuç nesnesi
    const results: Record<string, { title: string; description: string; keywords: string[] }> = {};

    for (const lang of targetLanguages) {
      // Ürün başlığı için prompt
      const titlePrompt = `Generate a short, catchy, SEO-friendly product title for a product with the following details: Name: ${baseFields.name}. Return only the title in ${lang}.`;
      // Ürün açıklaması için prompt
      const descPrompt = `Generate a detailed, SEO-friendly product description for a product with the following details: Name: ${baseFields.name}. Return only the description in ${lang}.`;
      // Değişiklik: Anahtar kelime promptunu daha kesin ve net hale getirdik, OpenAI'dan mutlaka JSON array dönmesini istiyoruz.
      const keywordsPrompt = `Generate 5 SEO keywords for a product with the following details: Name: ${baseFields.name}. Return only a valid JSON array of strings, nothing else. In ${lang}.`;

      let title = "AI service error";
      let description = "AI service error";
      let keywords: string[] = ["AI service error"];

      try {
        // OpenAI'dan başlık al
        title = await generateOpenAICompletion(titlePrompt, lang);
      } catch {}
      try {
        // OpenAI'dan açıklama al
        description = await generateOpenAICompletion(descPrompt, lang);
      } catch {}
      try {
        // Değişiklik: OpenAI'dan dönen anahtar kelime cevabını önce JSON.parse ile diziye çevirmeye çalışıyoruz.
        const keywordsRaw = await generateOpenAICompletion(keywordsPrompt, lang);
        try {
          const parsed = JSON.parse(keywordsRaw);
          if (Array.isArray(parsed)) {
            keywords = parsed;
          } else {
            keywords = [keywordsRaw];
          }
        } catch {
          // Değişiklik: Eğer JSON parse edilemezse, cevabı virgülle ayırıp anahtar kelime dizisi olarak kullanıyoruz.
          keywords = keywordsRaw.split(",").map((k: string) => k.trim());
        }
      } catch {
        // Değişiklik: OpenAI'dan anahtar kelime alınamazsa hata mesajı döndür.
        keywords = ["AI service error"];
      }

      // Sonuçları ilgili dile ekle
      results[lang] = { title, description, keywords };
    }

    // Sonuçları frontend'e döndür
    res.json({ results });
  })();
});

export default router; 