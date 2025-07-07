import { IAIContentService } from "./IAIContentService";

type CategoryInput = {
  name: string;
  description?: string;
  [key: string]: any;
};

type CategoryOutput = string | string[];

export class CategoryAIService implements IAIContentService<CategoryInput, CategoryOutput> {
  buildPrompt(input: CategoryInput, type: "title" | "description" | "keywords" | "metaTitle" | "metaDescription", lang?: string): string {
    const systemContext = `You are an AI assistant for an e-commerce provider platform. Your job is to generate professional, SEO-friendly, and meaningful content for product categories. Always provide results that make sense for e-commerce, even if the user input is incomplete or unclear. You are responsible for translation, SEO, and meta fields.`;
    switch (type) {
      case "title":
        return `${systemContext}\nTranslate the following category name for an e-commerce website. Only return the translated name in ${lang || "the target language"}. Do not include any label, explanation, or original text.\n${input.name}`;
      case "description":
        return `${systemContext}\nTranslate and improve the following category description for an e-commerce website. Only return the translated description in ${lang || "the target language"}. Do not include any label, explanation, or original text.\n${input.description || ""}`;
      case "metaTitle":
        return `${systemContext}\nGenerate an SEO-optimized meta title for a product category. The title must be in ${lang || "the target language"} and should not contain any words from the original language. Only return the translated and optimized title, with no label or explanation.\nCategory name: ${input.name}\nCategory description: ${input.description || ""}`;
      case "metaDescription":
        return `${systemContext}\nGenerate an SEO-optimized meta description for the following category in ${lang || "the target language"}. Only return the description itself, with no label or explanation. Name: ${input.name}. Description: ${input.description || ""}`;
      case "keywords":
        return `${systemContext}\nGenerate 5 SEO keywords for a category named "${input.name}". Return only a comma-separated list of keywords in ${lang || "the target language"}. No explanation, no code block, no JSON.`;
      default:
        return "";
    }
  }

  private cleanLabel(text: string): string {
    return text.replace(/^(Meta Title|Meta Description|Title|Description|Açıklama|Başlık)(\s*\(.*?\))?:?\s*/i, '').trim();
  }

  parseAIResponse(response: string, type: "keywords" | "title" | "description" | "metaTitle" | "metaDescription"): CategoryOutput {
    if (type === "keywords") {
      let cleaned = response
        .replace(/```[a-zA-Z]*[\s\S]*?```/g, "")
        .replace(/```[a-zA-Z]*|```/g, "")
        .replace(/\n/g, " ")
        .replace(/^[^\[]*\[/, "[")
        .replace(/\s+/g, " ")
        .trim();
      try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return cleaned
        .replace(/\[|\]|"/g, "")
        .split(",")
        .map((k: string) => k.trim())
        .filter(Boolean);
    }
    if (["title", "description", "metaTitle", "metaDescription"].includes(type)) {
      return this.cleanLabel(response);
    }
    return response;
  }
} 