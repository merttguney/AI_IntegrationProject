
require('dotenv').config();
import app from './app';
import Logger from './logger/Logger';

const PORT = process.env.PORT || 3000;

// Log configuration status
Logger.info('🚀 Initializing server configuration...');
Logger.info(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
Logger.info(`🐰 RabbitMQ URL: ${process.env.RABBITMQ_URL || 'Not configured'}`);
Logger.info(`🍃 MongoDB URI: ${process.env.MONGODB_URI || 'Not configured'}`);
Logger.info(`🔴 Redis URL: ${process.env.REDIS_URL || 'Not configured'}`);

app.listen(PORT, () => {
  Logger.info(`✅ Server is running on http://localhost:${PORT}`);
  Logger.info('🎯 Available endpoints:');
  Logger.info('   - POST /api/process');
  Logger.info('   - POST /api/fromtrendyol');
  Logger.info('');
  Logger.info('📝 To test Trendyol integration:');
  Logger.info('   - Start consumer: npm run consume');
  Logger.info('   - Run demo: npm run trendyol:demo');
});