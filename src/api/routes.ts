import express, { Request, Response } from "express";
import { publishToQueue } from "../queue/producer";
import { authenticate } from "../utils/auth";
import { TrendyolApiService } from "../service/TrendyolApiService";
import { TrendyolProductMapperService } from "../service/TrendyolProductMapperService";

const router = express.Router();

// Initialize services
const trendyolApiService = new TrendyolApiService();
const trendyolMapperService = new TrendyolProductMapperService();

router.post(
  "/process", // // Process endpointi ne yapıyor 
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const { data, operationType, queueName, websiteId } = req.body;

    if (!data || !operationType || !queueName || !websiteId) {
      console.log(
        "Missing required parameters",
        data,
        operationType,
        queueName,
        websiteId
      );
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    try {
      await publishToQueue(queueName, { data, operationType, websiteId });
      res.status(200).json({ message: "Request processed successfully" });
    } catch (error) {
      console.error("Error publishing to queue:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * Trendyol Integration Route
 * Fetches products from Trendyol, maps them to internal structure,
 * and publishes to product queue
 */
router.post(
  "/fromtrendyol",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const { websiteId, operationType = "create" } = req.body;

    if (!websiteId) {
      res.status(400).json({ error: "websiteId is required" });
      return;
    }

    try {
      console.log("Fetching products from Trendyol...");

      // trendyol mu local mi?? => queue'ya öncesinde gitmesi lazım mappingden. 
      
      // 1. Fetch products from Trendyol (mock data)
      const trendyolProducts = await trendyolApiService.getProducts();
      console.log(`Fetched ${trendyolProducts.length} products from Trendyol`);

      // 2. Map Trendyol products to internal format
      const mappingResult = await trendyolMapperService.mapBatch(
        // Await ile beklememesi lazım paralelde işlesin. promise ile gitsin. Queue'ya da aynı şekilde publish edilsin.
        trendyolProducts, 
        websiteId
      );


      if (!mappingResult.success) {
        res.status(400).json({ 
          error: "Product mapping failed", 
          details: mappingResult.errors 
        });
        return;
      }

      console.log(`Successfully mapped ${mappingResult.data?.length || 0} products`);

      // 3. Publish each mapped product to queue
      const publishPromises = mappingResult.data?.map(async (product) => {
        return publishToQueue("product", {
          data: product,
          operationType,
          websiteId
        });
      }) || [];

      await Promise.all(publishPromises);

      // 4. Return success response
      res.status(200).json({
        message: "Trendyol products processed successfully",
        stats: {
          totalFetched: trendyolProducts.length,
          totalMapped: mappingResult.data?.length || 0,
          totalPublished: publishPromises.length,
          warnings: mappingResult.warnings
        }
      });

    } catch (error) {
      console.error("Error processing Trendyol products:", error);
      res.status(500).json({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
);

export default router;
