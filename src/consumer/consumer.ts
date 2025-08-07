require('dotenv').config();
import OrderConsumerService from "./OrderConsumerService";
import ProductConsumer from "./ProductConsumer";
import Logger from "../logger/Logger";

// Start all consumers
async function startConsumers() {
  try {
    Logger.info('🚀 Starting consumers...');
    
    // Start Order Consumer
    Logger.info('📦 Starting Order Consumer...');
    OrderConsumerService.start();
    
    // Start Product Consumer (for Trendyol integration)
    Logger.info('🛍️  Starting Product Consumer...');
    ProductConsumer.start();
    
    Logger.info('✅ All consumers started successfully');
    
  } catch (error) {
    Logger.error('❌ Failed to start consumers:', error);
    process.exit(1);
  }
}

startConsumers();