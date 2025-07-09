import mongoose from 'mongoose';
import Logger from '../logger/Logger';

/**
 * MongoDB connection service following Single Responsibility Principle
 * Responsible only for managing database connections
 */
export class MongoDBService {
  private static instance: MongoDBService;
  private isConnected: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance
   * @returns MongoDBService instance
   */
  static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  /**
   * Connect to MongoDB
   * @param uri - MongoDB connection URI
   * @returns Promise resolving to connection status
   */
  async connect(uri?: string): Promise<boolean> {
    try {
      if (this.isConnected) {
        Logger.log('MongoDB already connected');
        return true;
      }

      const connectionUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom_templates';
      
      await mongoose.connect(connectionUri, {
        // Connection options for production use
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false // Disable mongoose buffering
      });

      this.isConnected = true;
      
      // Set up connection event listeners
      this.setupEventListeners();
      
      Logger.log(`MongoDB connected successfully to: ${connectionUri.replace(/\/\/.*@/, '//***:***@')}`);
      return true;
    } catch (error) {
      this.isConnected = false;
      Logger.log(`MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Disconnect from MongoDB
   * @returns Promise resolving when disconnected
   */
  async disconnect(): Promise<void> {
    try {
      if (!this.isConnected) {
        Logger.log('MongoDB not connected, skipping disconnect');
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;
      Logger.log('MongoDB disconnected successfully');
    } catch (error) {
      Logger.log(`MongoDB disconnect error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Check connection status
   * @returns Current connection status
   */
  isConnectionActive(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Get connection state string
   * @returns Human-readable connection state
   */
  getConnectionState(): string {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
  }

  /**
   * Setup MongoDB connection event listeners
   */
  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      Logger.log('MongoDB connection established');
    });

    mongoose.connection.on('error', (error) => {
      this.isConnected = false;
      Logger.log(`MongoDB connection error: ${error.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      Logger.log('MongoDB connection lost');
    });

    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      Logger.log('MongoDB reconnected');
    });

    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      try {
        await this.disconnect();
        Logger.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        Logger.log(`Error during graceful shutdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
      }
    });
  }

  /**
   * Health check for MongoDB connection
   * @returns Promise resolving to health status
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: {
      connected: boolean;
      readyState: string;
      host?: string;
      name?: string;
    };
  }> {
    try {
      const isHealthy = this.isConnectionActive();
      
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        details: {
          connected: this.isConnected,
          readyState: this.getConnectionState(),
          host: mongoose.connection.host,
          name: mongoose.connection.name
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          connected: false,
          readyState: 'error'
        }
      };
    }
  }
}
