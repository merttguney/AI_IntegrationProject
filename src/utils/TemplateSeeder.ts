import { EmailTemplate } from '../model/EmailTemplate';
import { MongoDBService } from '../service/MongoDBService';
import Logger from '../logger/Logger';

/**
 * Template seeder utility for creating sample email templates
 * Follows Single Responsibility Principle - only creates sample templates
 */
export class TemplateSeeder {
  /**
   * Seed sample email templates for different operations and websites
   */
  static async seedSampleTemplates(): Promise<void> {
    try {
      // Ensure MongoDB is connected
      const mongoService = MongoDBService.getInstance();
      if (!mongoService.isConnectionActive()) {
        Logger.log('MongoDB not connected, attempting to connect for template seeding');
        await mongoService.connect();
      }

      const sampleTemplates = [
        // Order creation templates
        {
          templateId: 'website1_order_create_001',
          websiteId: 'website1',
          operationType: 'create',
          templateName: 'Order Confirmation',
          subject: 'Order Confirmation - {{orderNumber}}',
          htmlContent: `
            <h2>Thank you for your order!</h2>
            <p>Dear {{customerName}},</p>
            <p>We have received your order and are processing it now.</p>
            
            <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0;">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> {{orderNumber}}</p>
              <p><strong>Total Amount:</strong> {{formatCurrency totalAmount}}</p>
              <p><strong>Order Date:</strong> {{formatDate orderDate 'long'}}</p>
            </div>
            
            <h3>Items Ordered:</h3>
            {{#each items}}
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <p><strong>{{name}}</strong></p>
              <p>Quantity: {{quantity}} | Price: {{formatCurrency price}}</p>
            </div>
            {{/each}}
            
            <p>We will send you a shipping confirmation when your order is on its way.</p>
            <p>Thank you for choosing us!</p>
          `,
          textContent: `
            Thank you for your order!
            
            Dear {{customerName}},
            
            We have received your order and are processing it now.
            
            Order Details:
            Order Number: {{orderNumber}}
            Total Amount: {{formatCurrency totalAmount}}
            Order Date: {{formatDate orderDate}}
            
            We will send you a shipping confirmation when your order is on its way.
            
            Thank you for choosing us!
          `,
          variables: ['customerName', 'orderNumber', 'totalAmount', 'orderDate', 'items'],
          isActive: true
        },
        
        // Order update templates
        {
          templateId: 'website1_order_update_001',
          websiteId: 'website1',
          operationType: 'update',
          templateName: 'Order Status Update',
          subject: 'Order Update - {{orderNumber}}',
          htmlContent: `
            <h2>Your order has been updated</h2>
            <p>Dear {{customerName}},</p>
            <p>There has been an update to your order <strong>{{orderNumber}}</strong>.</p>
            
            <div style="background-color: #e8f4f8; padding: 20px; margin: 20px 0;">
              <h3>Current Status: {{uppercase status}}</h3>
              {{#if trackingNumber}}
              <p><strong>Tracking Number:</strong> {{trackingNumber}}</p>
              {{/if}}
              <p><strong>Last Updated:</strong> {{formatDate timestamp 'long'}}</p>
            </div>
            
            {{#if changes.status}}
            <p>Your order status has changed to: <strong>{{changes.status}}</strong></p>
            {{/if}}
            
            <p>You can track your order status anytime on our website.</p>
          `,
          textContent: `
            Your order has been updated
            
            Dear {{customerName}},
            
            There has been an update to your order {{orderNumber}}.
            
            Current Status: {{uppercase status}}
            Last Updated: {{formatDate timestamp}}
            
            You can track your order status anytime on our website.
          `,
          variables: ['customerName', 'orderNumber', 'status', 'trackingNumber', 'timestamp', 'changes'],
          isActive: true
        },
        
        // User registration template
        {
          templateId: 'website1_user_create_001',
          websiteId: 'website1',
          operationType: 'create',
          templateName: 'Welcome Email',
          subject: 'Welcome to {{websiteName}}!',
          htmlContent: `
            <h1>Welcome to {{websiteName}}!</h1>
            <p>Dear {{firstName}} {{lastName}},</p>
            <p>Thank you for joining our community! We're excited to have you on board.</p>
            
            <div style="background-color: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Account Details:</h3>
              <p><strong>Email:</strong> {{email}}</p>
              <p><strong>Member Since:</strong> {{formatDate timestamp 'long'}}</p>
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>Complete your profile</li>
              <li>Browse our latest products</li>
              <li>Join our newsletter for exclusive offers</li>
            </ul>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Welcome aboard!</p>
          `,
          textContent: `
            Welcome to {{websiteName}}!
            
            Dear {{firstName}} {{lastName}},
            
            Thank you for joining our community! We're excited to have you on board.
            
            Account Details:
            Email: {{email}}
            Member Since: {{formatDate timestamp}}
            
            If you have any questions, feel free to contact our support team.
            
            Welcome aboard!
          `,
          variables: ['firstName', 'lastName', 'email', 'websiteName', 'timestamp'],
          isActive: true
        },
        
        // Product deletion notification
        {
          templateId: 'website1_product_delete_001',
          websiteId: 'website1',
          operationType: 'delete',
          templateName: 'Product Discontinued Notification',
          subject: 'Product No Longer Available - {{productName}}',
          htmlContent: `
            <h2>Product Discontinued</h2>
            <p>Dear Valued Customer,</p>
            <p>We regret to inform you that the following product is no longer available:</p>
            
            <div style="background-color: #fff3cd; padding: 20px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3>{{productName}}</h3>
              <p><strong>Product ID:</strong> {{recordId}}</p>
              {{#if productCategory}}
              <p><strong>Category:</strong> {{productCategory}}</p>
              {{/if}}
            </div>
            
            <p>We apologize for any inconvenience this may cause. Please browse our website for similar products that might interest you.</p>
            
            <p>Thank you for your understanding.</p>
          `,
          textContent: `
            Product Discontinued
            
            Dear Valued Customer,
            
            We regret to inform you that the following product is no longer available:
            
            Product: {{productName}}
            Product ID: {{recordId}}
            
            We apologize for any inconvenience this may cause.
            
            Thank you for your understanding.
          `,
          variables: ['productName', 'recordId', 'productCategory'],
          isActive: true
        }
      ];

      // Insert sample templates
      for (const templateData of sampleTemplates) {
        try {
          // Check if template already exists
          const existing = await EmailTemplate.findOne({ templateId: templateData.templateId });
          
          if (!existing) {
            const template = new EmailTemplate(templateData);
            await template.save();
            Logger.log(`Sample template created: ${templateData.templateId}`);
          } else {
            Logger.log(`Sample template already exists: ${templateData.templateId}`);
          }
        } catch (error) {
          Logger.log(`Error creating template ${templateData.templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      Logger.log('Sample templates seeding completed');
    } catch (error) {
      Logger.log(`Template seeding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Remove all sample templates (useful for testing)
   */
  static async removeSampleTemplates(): Promise<void> {
    try {
      const result = await EmailTemplate.deleteMany({
        templateId: { $regex: /^website1_/ }
      });
      
      Logger.log(`Removed ${result.deletedCount} sample templates`);
    } catch (error) {
      Logger.log(`Error removing sample templates: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }
}
