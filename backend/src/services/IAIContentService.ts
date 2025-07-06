export interface IAIContentService<TInput, TOutput> {
  buildPrompt(input: TInput, type: "title" | "description" | "keywords"): string;
  parseAIResponse(response: string, type: "keywords" | "title" | "description"): TOutput;
} 