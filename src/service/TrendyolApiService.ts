/**
 * Trendyol API Service
 * Following Single Responsibility Principle
 * Handles all interactions with Trendyol data (mock or real API)
 */

import * as fs from 'fs';
import * as path from 'path';
import { TrendyolProductModel } from "../model/trendyol/TrendyolProductModel";
import Logger from "../logger/Logger";

export interface ITrendyolApiService {
  getProducts(): Promise<TrendyolProductModel[]>;
  getProductById(id: string): Promise<TrendyolProductModel | null>;
}

export class TrendyolApiService implements ITrendyolApiService {
  private readonly logger = Logger;
  private readonly mockDataPath: string;

  constructor() {
    this.mockDataPath = path.join(process.cwd(), 'src/data/trendyol-mockup.json');
  }

  /**
   * Gets all products from Trendyol (currently from mock data)
   */
  async getProducts(): Promise<TrendyolProductModel[]> {
    try {
      this.logger.info('Fetching Trendyol products from mock data');
      
      // Read mock data
      const mockData = await this.readMockData();
      
      this.logger.info(`Fetched ${mockData.length} products from Trendyol`);
      return mockData;
      
    } catch (error) {
      this.logger.error(`Error fetching Trendyol products: ${error}`);
      throw new Error(`Failed to fetch Trendyol products: ${error}`);
    }
  }

  /**
   * Gets a specific product by ID
   */
  async getProductById(id: string): Promise<TrendyolProductModel | null> {
    try {
      const products = await this.getProducts();
      const product = products.find(p => p.id === id);
      
      if (product) {
        this.logger.info(`Found Trendyol product with ID: ${id}`);
      } else {
        this.logger.warn(`Trendyol product not found with ID: ${id}`);
      }
      
      return product || null;
      
    } catch (error) {
      this.logger.error(`Error fetching Trendyol product by ID ${id}: ${error}`);
      throw new Error(`Failed to fetch Trendyol product: ${error}`);
    }
  }

  /**
   * Reads mock data from JSON file
   */
  private async readMockData(): Promise<TrendyolProductModel[]> {
    try {
      const fileContent = fs.readFileSync(this.mockDataPath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      
      // Validate that we have an array
      if (!Array.isArray(jsonData)) {
        throw new Error('Mock data is not an array');
      }
      
      return jsonData as TrendyolProductModel[];
      
    } catch (error) {
      this.logger.error(`Error reading mock data: ${error}`);
      throw new Error(`Failed to read mock data: ${error}`);
    }
  }
}
