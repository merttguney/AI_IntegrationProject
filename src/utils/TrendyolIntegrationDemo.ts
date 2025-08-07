/**
 * Trendyol Integration Demo
 * Test script to demonstrate the complete flow
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface DemoConfig {
  websiteId: string;
  authToken?: string;
}

class TrendyolIntegrationDemo {
  private config: DemoConfig;

  constructor(config: DemoConfig) {
    this.config = config;
  }

  /**
   * Test the complete Trendyol integration flow
   */
  async runDemo(): Promise<void> {
    console.log('🚀 Starting Trendyol Integration Demo...\n');

    try {
      // Test 1: Fetch and process Trendyol products
      await this.testTrendyolIntegration();

      // Test 2: Check queue processing (manually verify in logs)
      console.log('✅ Demo completed successfully!');
      console.log('📝 Check the consumer logs to see product processing in action.');

    } catch (error) {
      console.error('❌ Demo failed:', error);
    }
  }

  /**
   * Test Trendyol integration endpoint
   */
  private async testTrendyolIntegration(): Promise<void> {
    console.log('📦 Testing Trendyol product integration...');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/fromtrendyol`,
        {
          websiteId: this.config.websiteId,
          operationType: 'create'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.authToken && { 'Authorization': `Bearer ${this.config.authToken}` })
          }
        }
      );

      console.log('✅ Trendyol integration response:');
      console.log(JSON.stringify(response.data, null, 2));

      if (response.data.stats) {
        console.log(`\n📊 Statistics:`);
        console.log(`   - Total fetched: ${response.data.stats.totalFetched}`);
        console.log(`   - Total mapped: ${response.data.stats.totalMapped}`);
        console.log(`   - Total published: ${response.data.stats.totalPublished}`);
        
        if (response.data.stats.warnings && response.data.stats.warnings.length > 0) {
          console.log(`   - Warnings: ${response.data.stats.warnings.length}`);
        }
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API Error:', error.response?.data || error.message);
      } else {
        console.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  }

  /**
   * Test individual product processing
   */
  async testIndividualProduct(productData: any): Promise<void> {
    console.log('\n🔧 Testing individual product processing...');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/process`,
        {
          data: productData,
          operationType: 'create',
          queueName: 'product',
          websiteId: this.config.websiteId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.authToken && { 'Authorization': `Bearer ${this.config.authToken}` })
          }
        }
      );

      console.log('✅ Individual product processing response:');
      console.log(JSON.stringify(response.data, null, 2));

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API Error:', error.response?.data || error.message);
      } else {
        console.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  }
}

// Demo configuration
const demoConfig: DemoConfig = {
  websiteId: 'demo-website-123',
  // authToken: 'your-auth-token-here' // Add if authentication is required
};

// Sample product data for individual testing
const sampleProduct = {
  name: 'Test Product',
  documentId: 'test-product-123',
  product_status: true,
  visibility: 'catalogsearch',
  type: 'simple',
  variants: [
    {
      sku: 'TEST-SKU-001',
      price: 99.99,
      currency: 'TRY',
      variant_status: true
    }
  ]
};

// Main demo execution
async function main() {
  const demo = new TrendyolIntegrationDemo(demoConfig);
  
  console.log('🎯 Select demo mode:');
  console.log('1. Full Trendyol Integration');
  console.log('2. Individual Product Test');
  console.log('3. Both\n');

  // For this demo, we'll run the full integration
  // In a real scenario, you might want to add command line argument parsing
  
  try {
    // Run full demo
    await demo.runDemo();
    
    // Uncomment to test individual product
    // console.log('\n' + '='.repeat(50));
    // await demo.testIndividualProduct(sampleProduct);
    
  } catch (error) {
    console.error('Demo execution failed:', error);
    process.exit(1);
  }
}

// Execute demo if this file is run directly
if (require.main === module) {
  main();
}

export { TrendyolIntegrationDemo, DemoConfig };
