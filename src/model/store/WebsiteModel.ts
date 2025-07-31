/**
 * Website Model
 * Represents website configuration including analytics tracking IDs
 *
 * Single Responsibility: Define website structure with analytics integrations
 * Open/Closed: Extended to support multiple analytics providers
 */

export interface WebsiteModel {
  documentId: string;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedA: string;
}
