import { EmailServiceFactory } from '../service/EmailServiceFactory';
import { TemplateSeeder } from '../utils/TemplateSeeder';
import { EmailQueueConsumer } from '../service/EmailQueueConsumer';
import { QueueModel } from '../model/QueueModel';
import Logger from '../logger/Logger';

/**
 * Email service demo script
 * Demonstrates all email service capabilities following KISS principle
 */
export class EmailServiceDemo {
  
  /**
   * Run complete email service demonstration
   */
  static async runDemo(): Promise<void> {
    try {
      Logger.log('=== Email Service Demo Started ===');
      
      // Step 1: Initialize email service
      Logger.log('Step 1: Initializing email service...');
      const emailService = await EmailServiceFactory.getInstance();
      Logger.log('Email service initialized successfully');
      
      // Step 2: Health check
      Logger.log('Step 2: Running health check...');
      const healthStatus = await EmailServiceFactory.healthCheck();
      Logger.log(`Health check results: ${JSON.stringify(healthStatus, null, 2)}`);
      
      // Step 3: Seed sample templates
      Logger.log('Step 3: Seeding sample templates...');
      await TemplateSeeder.seedSampleTemplates();
      Logger.log('Sample templates seeded successfully');
      
      // Step 4: Test direct email sending
      Logger.log('Step 4: Testing direct email sending...');
      await EmailServiceDemo.testDirectEmail(emailService);
      
      // Step 5: Test templated email sending
      Logger.log('Step 5: Testing templated email sending...');
      await EmailServiceDemo.testTemplatedEmail(emailService);
      
      // Step 6: Test queue consumer
      Logger.log('Step 6: Testing queue consumer...');
      await EmailServiceDemo.testQueueConsumer();
      
      Logger.log('=== Email Service Demo Completed Successfully ===');
      
    } catch (error) {
      Logger.log(`Demo failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * Test direct email sending
   */
  private static async testDirectEmail(emailService: any): Promise<void> {
    try {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Direct Email',
        htmlContent: `
          <h2>Test Email</h2>
          <p>This is a test email sent directly without templates.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        `,
        textContent: `
          Test Email
          
          This is a test email sent directly without templates.
          Sent at: ${new Date().toISOString()}
        `
      };
      
      const result = await emailService.sendDirectEmail(emailData);
      Logger.log(`Direct email result: ${JSON.stringify(result, null, 2)}`);
      
    } catch (error) {
      Logger.log(`Direct email test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Test templated email sending
   */
  private static async testTemplatedEmail(emailService: any): Promise<void> {
    try {
      const templateVariables = {
        customerName: 'John Doe',
        orderNumber: 'ORD-12345',
        totalAmount: 99.99,
        orderDate: new Date(),
        items: [
          { name: 'Product A', quantity: 2, price: 29.99 },
          { name: 'Product B', quantity: 1, price: 39.99 }
        ]
      };
      
      const result = await emailService.sendTemplatedEmail(
        'website1',
        'create',
        'customer@example.com',
        templateVariables
      );
      
      Logger.log(`Templated email result: ${JSON.stringify(result, null, 2)}`);
      
    } catch (error) {
      Logger.log(`Templated email test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Test queue consumer
   */
  private static async testQueueConsumer(): Promise<void> {
    try {
      const consumer = EmailQueueConsumer.getInstance();
      
      // Sample queue messages
      const queueMessages: QueueModel[] = [
        {
          data: {
            customerName: 'Jane Smith',
            email: 'jane@example.com',
            orderNumber: 'ORD-67890',
            totalAmount: 149.99,
            orderDate: new Date(),
            items: [
              { name: 'Premium Product', quantity: 1, price: 149.99 }
            ]
          },
          websiteId: 'website1',
          operationType: 'create'
        },
        {
          data: {
            customerName: 'Bob Johnson',
            email: 'bob@example.com',
            orderNumber: 'ORD-11111',
            status: 'shipped',
            trackingNumber: 'TRK123456789',
            timestamp: new Date()
          },
          websiteId: 'website1',
          operationType: 'update'
        },
        {
          data: {
            firstName: 'Alice',
            lastName: 'Wilson',
            email: 'alice@example.com',
            websiteName: 'Amazing Store',
            timestamp: new Date()
          },
          websiteId: 'website1',
          operationType: 'create'
        }
      ];
      
      // Process individual messages
      for (let i = 0; i < queueMessages.length; i++) {
        Logger.log(`Processing queue message ${i + 1}...`);
        const result = await consumer.processQueueMessage(queueMessages[i]);
        Logger.log(`Queue message ${i + 1} result: ${JSON.stringify(result, null, 2)}`);
      }
      
      // Test batch processing
      Logger.log('Testing batch processing...');
      const batchResult = await consumer.processBatch(queueMessages);
      Logger.log(`Batch processing result: ${JSON.stringify(batchResult, null, 2)}`);
      
    } catch (error) {
      Logger.log(`Queue consumer test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Run demo if this file is executed directly
if (require.main === module) {
  EmailServiceDemo.runDemo()
    .then(() => {
      Logger.log('Demo completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      Logger.log(`Demo failed: ${error.message}`);
      process.exit(1);
    });
}
