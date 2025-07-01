export async function generateGeminiCompletion(prompt: string, language: string) {
  // Burada gerçek Gemini API entegrasyonu yapılabilir.
  // Şimdilik mock cevap dönüyoruz.
  return `Gemini mock response for [${language}]: ${prompt.substring(0, 40)}...`;
} 