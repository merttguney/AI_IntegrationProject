import { EmailService } from './EmailService';
import { MongoDBService } from './MongoDBService';
import Logger from '../logger/Logger';

/**
 * Email service factory implementing Factory Pattern and Singleton
 * Responsible for creating and managing email service instances
 */
export class EmailServiceFactory {
  private static instance: EmailService | null = null;
  private static isInitialized: boolean = false;

  /**
   * Get or create email service instance
   * @param forceNew - Force creation of new instance
   * @returns EmailService instance
   */
  static async getInstance(forceNew: boolean = false): Promise<EmailService> {
    if (!EmailServiceFactory.instance || forceNew) {
      await EmailServiceFactory.initializeService();
    }
    
    return EmailServiceFactory.instance!;
  }

  /**
   * Initialize email service with dependencies
   */
  private static async initializeService(): Promise<void> {
    try {
      // Initialize MongoDB connection
      const mongoService = MongoDBService.getInstance();
      const mongoConnected = await mongoService.connect();
      
      if (!mongoConnected) {
        Logger.log('Warning: MongoDB connection failed, email templates may not work');
      }

      // Create email service instance
      EmailServiceFactory.instance = new EmailService();
      
      // Test email service connection
      const connectionTest = await EmailServiceFactory.instance.testConnection();
      
      if (!connectionTest) {
        Logger.log('Warning: Email service connection test failed, check provider configuration');
      }

      EmailServiceFactory.isInitialized = true;
      Logger.log('Email service initialized successfully');
    } catch (error) {
      Logger.log(`Failed to initialize email service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Check if email service is initialized
   * @returns Initialization status
   */
  static isServiceInitialized(): boolean {
    return EmailServiceFactory.isInitialized;
  }

  /**
   * Reset factory (useful for testing)
   */
  static reset(): void {
    EmailServiceFactory.instance = null;
    EmailServiceFactory.isInitialized = false;
  }

  /**
   * Health check for entire email system
   * @returns Promise resolving to health status
   */
  static async healthCheck(): Promise<{
    emailService: boolean;
    database: any;
    providers: string[];
  }> {
    try {
      const service = await EmailServiceFactory.getInstance();
      const mongoService = MongoDBService.getInstance();
      
      return {
        emailService: await service.testConnection(),
        database: await mongoService.healthCheck(),
        providers: service.getAvailableProviders()
      };
    } catch (error) {
      Logger.log(`Email service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        emailService: false,
        database: { status: 'unhealthy', details: { connected: false, readyState: 'error' } },
        providers: []
      };
    }
  }
}
