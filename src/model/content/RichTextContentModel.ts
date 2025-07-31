export interface RichTextContent {
  type: string; // Type of the block (e.g., "paragraph", "heading", "list", "image", etc.)
  text?: string; // Optional text content
  children?: RichTextContent[]; // Content or sub-nodes within the block
  attrs?: Record<string, any>; // Optional attributes for the block
  marks?: Array<{
    type: string; // Type of the mark (e.g., "bold", "italic", etc.)
    attrs?: Record<string, any>; // Optional attributes for the mark
  }>; 
}