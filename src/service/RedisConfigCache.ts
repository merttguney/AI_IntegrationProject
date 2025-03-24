// src/services/config-cache.ts
import { createClient, RedisClientType } from 'redis';

export interface ConfigCacheService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConfig<T>(key: string, defaultValue?: T): Promise<T | null>;
  setConfig<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  deleteConfig(key: string): Promise<void>;
  isConnected(): boolean;
}

export class RedisConfigCache implements ConfigCacheService {
  private client: RedisClientType | null = null;
  private readonly connectionOptions: {
    url: string;
    password: string;
  };
  private readonly keyPrefix: string;
  private connectionPromise: Promise<void> | null = null;

  constructor(
    host = 'localhost',
    port = 6379,
    password = process.env.REDIS_PASSWORD || '',
    keyPrefix = 'app:config:'
  ) {
    this.connectionOptions = {
      url: `redis://${host}:${port}`,
      password: password
    };
    this.keyPrefix = keyPrefix;
  }

  isConnected(): boolean {
    return this.client !== null && this.client.isReady;
  }

  async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise<void>(async (resolve, reject) => {
      try {
        console.log('Connecting to Redis...');
        
        this.client = createClient(this.connectionOptions);
        
        // Set up event listeners
        this.client.on('error', (err) => {
          console.error('Redis client error:', err);
        });
        
        this.client.on('connect', () => {
          console.log('Connected to Redis');
        });
        
        this.client.on('reconnecting', () => {
          console.log('Reconnecting to Redis...');
        });
        
        this.client.on('end', () => {
          console.log('Redis connection closed');
        });
        
        await this.client.connect();
        console.log('Redis client ready');
        resolve();
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        this.client = null;
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    try {
      await this.client.quit();
      this.client = null;
      this.connectionPromise = null;
      console.log('Disconnected from Redis');
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
      throw error;
    }
  }

  async getConfig<T>(key: string, defaultValue?: T): Promise<T | null> {
    if (!this.client) {
      throw new Error('Redis client not connected. Call connect() first.');
    }

    const fullKey = this.keyPrefix + key;
    
    try {
      const value = await this.client.get(fullKey);
      
      if (value === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error retrieving config for key ${key}:`, error);
      return defaultValue !== undefined ? defaultValue : null;
    }
  }

  async setConfig<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not connected. Call connect() first.');
    }

    const fullKey = this.keyPrefix + key;
    const serializedValue = JSON.stringify(value);
    
    try {
      if (ttlSeconds !== undefined && ttlSeconds > 0) {
        await this.client.setEx(fullKey, ttlSeconds, serializedValue);
      } else {
        await this.client.set(fullKey, serializedValue);
      }
    } catch (error) {
      console.error(`Error setting config for key ${key}:`, error);
      throw error;
    }
  }

  async deleteConfig(key: string): Promise<void> {
    if (!this.client) {
      throw new Error('Redis client not connected. Call connect() first.');
    }

    const fullKey = this.keyPrefix + key;
    
    try {
      await this.client.del(fullKey);
    } catch (error) {
      console.error(`Error deleting config for key ${key}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance
const redisConfigCache = new RedisConfigCache(
  process.env.REDIS_HOST || 'localhost',
  parseInt(process.env.REDIS_PORT || '6379', 10),
  process.env.REDIS_PASSWORD || '',
  process.env.REDIS_KEY_PREFIX || 'app:config:'
);

export default redisConfigCache;