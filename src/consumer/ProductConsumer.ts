import { QueueModel } from "../model/QueueModel";
import { startConsumer } from "./startConsumer";
import { ProductProcessingService } from "../service/ProductProcessingService";
import { ProductModel } from "../model/product/ProductModel";
import Logger from "../logger/Logger";

// Initialize services following Dependency Injection principles
const productProcessingService = new ProductProcessingService();
const logger = Logger;

const process = async (queueItem: QueueModel) => {
  try {
    logger.info(`Processing product queue item: ${queueItem.operationType}`);

    if (queueItem.operationType === "create") {
      // Process product creation
      logger.info(`Creating product: ${JSON.stringify(queueItem.data)}`);
      
      // Validate that we have product data
      if (!queueItem.data || typeof queueItem.data !== 'object') {
        throw new Error("Invalid product data received");
      }

      // Cast data to ProductModel (in real scenario, add proper validation)
      const productData = queueItem.data as ProductModel;
      
      // Process the product creation
      await productProcessingService.createProduct(productData, queueItem.websiteId);
      
      logger.info(`Successfully created product: ${productData.name}`);

    } else if (queueItem.operationType === "update") {
      // Process product update
      logger.info(`Updating product: ${JSON.stringify(queueItem.data)}`);
      
      // Validate that we have product data
      if (!queueItem.data || typeof queueItem.data !== 'object') {
        throw new Error("Invalid product data received");
      }

      // Cast data to ProductModel
      const productData = queueItem.data as ProductModel;
      
      // Process the product update
      await productProcessingService.updateProduct(productData, queueItem.websiteId);
      
      logger.info(`Successfully updated product: ${productData.name}`);

    } else if (queueItem.operationType === "delete") {
      // Process product deletion
      logger.info(`Deleting product: ${JSON.stringify(queueItem.data)}`);
      
      // For delete operation, we expect either product ID or full product data
      let productId: string;
      
      if (typeof queueItem.data === 'string') {
        productId = queueItem.data;
      } else if (queueItem.data && typeof queueItem.data === 'object') {
        const productData = queueItem.data as ProductModel;
        productId = productData.documentId || productData.id?.toString() || '';
      } else {
        throw new Error("Invalid product data for deletion");
      }
      
      if (!productId) {
        throw new Error("Product ID is required for deletion");
      }
      
      // Process the product deletion
      await productProcessingService.deleteProduct(productId, queueItem.websiteId);
      
      logger.info(`Successfully deleted product: ${productId}`);

    } else {
      throw new Error("Invalid operation type: " + JSON.stringify(queueItem));
    }

    logger.info(`Successfully processed ${queueItem.operationType} operation for website: ${queueItem.websiteId}`);

  } catch (error) {
    logger.error(`Error processing product queue item: ${error}`);
    
    // In a production environment, you might want to:
    // 1. Send the message to a dead letter queue
    // 2. Retry with exponential backoff
    // 3. Send notifications to monitoring systems
    
    throw error; // Re-throw to let the consumer handle retry logic
  }
};

const start = async () => {
  logger.info("🛍️  Starting Product Consumer...");
  startConsumer("product", process);
};

export default { start };
