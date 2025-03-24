import redisConfigCache from "./RedisConfigCache";

export interface Config {
    website : {
        [parameter: string] : string
    }
}

// TTL for cached configuration in seconds
const CONFIG_TTL = 60 * 5; // 5 minutes

export class ConfigProvider {
    private initialized = false;
    private cachedConfig: Config | null = null;
    
    constructor(private readonly cache = redisConfigCache) {}
    
    async initialize(initialConfig: Config): Promise<void> {
        if (!this.initialized) {
            try {
                await this.cache.connect();
                
                // Load config from cache
                const cachedConfig = await this.cache.getConfig<Config>('app-config');
                
                if (!cachedConfig) {
                    console.log('No config found in cache, using provided initial config');
                    await this.cache.setConfig('app-config', initialConfig, CONFIG_TTL);
                    this.cachedConfig = { ...initialConfig };
                } else {
                    console.log('Loaded config from cache');
                    this.cachedConfig = cachedConfig;
                }
                
                this.initialized = true;
            } catch (error) {
                console.error('Failed to initialize config provider:', error);
                
                if (initialConfig) {
                    // Fall back to initial config if provided and cache fails
                    this.cachedConfig = { ...initialConfig };
                    this.initialized = true;
                } else {
                    // Re-throw the error if we have no fallback
                    throw error;
                }
            }
        }
    }

    async getConfig(): Promise<Config> {
        if (!this.initialized) {
            throw new Error('Config provider not initialized. Call initialize() first');
        }
        
        // Always try to get the latest from cache
        try {
            const cachedConfig = await this.cache.getConfig<Config>('app-config');
            
            if (cachedConfig) {
                this.cachedConfig = cachedConfig;
            }
        } catch (error) {
            console.error('Error retrieving config from cache:', error);
            // Use existing cached config if available
            if (!this.cachedConfig) {
                throw new Error('No configuration available');
            }
        }
        return this.cachedConfig!;
    }
    
    async updateConfig(newConfig: Partial<Config>): Promise<Config> {
        if (!this.initialized) {
            throw new Error('Config provider not initialized. Call initialize() first');
        }
        const currentConfig = await this.getConfig();
        const updatedConfig = this.mergeConfigs(currentConfig, newConfig);
        try {
            await this.cache.setConfig('app-config', updatedConfig, CONFIG_TTL);
            this.cachedConfig = updatedConfig;
        } catch (error) {
            console.error('Error updating config in cache:', error);
        }
        return updatedConfig;
    }
    
    private mergeConfigs(current: Config, updates: Partial<Config>): Config {
        return {
            website: {
                ...current.website,
                ...updates.website
            }
        };
    }
    
    async refreshConfig(): Promise<Config> {
        if (!this.initialized) {
            throw new Error('Config provider not initialized. Call initialize() first');
        }
        try {
            //TODO axios call to fetch config from server
            const config = await this.getConfig();
            await this.cache.setConfig('app-config', config, CONFIG_TTL);
            return config;
        } catch (error) {
            console.error('Error refreshing config:', error);
            if (!this.cachedConfig) {
                throw new Error('No configuration available to refresh');
            }
            return this.cachedConfig;
        }
    }
}

// Create a singleton instance
const configProvider = new ConfigProvider();

export default configProvider;
