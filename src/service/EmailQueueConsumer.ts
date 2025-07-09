import { QueueModel } from '../model/QueueModel';
import { EmailServiceFactory } from '../service/EmailServiceFactory';
import Logger from '../logger/Logger';

/**
 * Email queue consumer utility following Single Responsibility Principle
 * Responsible only for processing queue messages and triggering email sending
 */
export class EmailQueueConsumer {
  private static instance: EmailQueueConsumer;

  private constructor() {}

  /**
   * Get singleton instance
   * @returns EmailQueueConsumer instance
   */
  static getInstance(): EmailQueueConsumer {
    if (!EmailQueueConsumer.instance) {
      EmailQueueConsumer.instance = new EmailQueueConsumer();
    }
    return EmailQueueConsumer.instance;
  }

  /**
   * Process queue message and send email if applicable
   * @param queueMessage - Queue message containing operation data
   * @returns Promise resolving to processing result
   */
  async processQueueMessage(queueMessage: QueueModel): Promise<{
    success: boolean;
    emailSent: boolean;
    error?: string;
  }> {
    try {
      Logger.log(`Processing queue message for websiteId: ${queueMessage.websiteId}, operationType: ${queueMessage.operationType}`);

      // Extract email-related data from queue message
      const emailData = this.extractEmailData(queueMessage);
      
      if (!emailData) {
        Logger.log('No email data found in queue message, skipping email sending');
        return {
          success: true,
          emailSent: false
        };
      }

      // Get email service instance
      const emailService = await EmailServiceFactory.getInstance();

      // Send templated email
      const emailResult = await emailService.sendTemplatedEmail(
        queueMessage.websiteId,
        queueMessage.operationType,
        emailData.recipient,
        emailData.templateVariables,
        {
          cc: emailData.cc,
          bcc: emailData.bcc,
          attachments: emailData.attachments
        }
      );

      if (emailResult.success) {
        Logger.log(`Email sent successfully for queue message, messageId: ${emailResult.messageId}`);
        return {
          success: true,
          emailSent: true
        };
      } else {
        Logger.log(`Email sending failed for queue message: ${emailResult.error}`);
        return {
          success: false,
          emailSent: false,
          error: emailResult.error
        };
      }
    } catch (error) {
      const errorMessage = `Failed to process queue message: ${error instanceof Error ? error.message : 'Unknown error'}`;
      Logger.log(errorMessage);
      
      return {
        success: false,
        emailSent: false,
        error: errorMessage
      };
    }
  }

  /**
   * Extract email-related data from queue message
   * @param queueMessage - Queue message to process
   * @returns Email data or null if not applicable
   */
  private extractEmailData(queueMessage: QueueModel): {
    recipient: string | string[];
    templateVariables: any;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: any[];
  } | null {
    try {
      const data = queueMessage.data;

      // Check if this is an email-triggering operation
      if (!this.shouldSendEmail(queueMessage)) {
        return null;
      }

      // Extract recipient email
      const recipient = this.extractRecipient(data);
      if (!recipient) {
        Logger.log('No recipient email found in queue message data');
        return null;
      }

      // Extract template variables based on operation type
      const templateVariables = this.extractTemplateVariables(queueMessage);

      return {
        recipient,
        templateVariables,
        cc: data.emailOptions?.cc,
        bcc: data.emailOptions?.bcc,
        attachments: data.emailOptions?.attachments
      };
    } catch (error) {
      Logger.log(`Error extracting email data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Determine if email should be sent for this queue message
   * @param queueMessage - Queue message to check
   * @returns True if email should be sent
   */
  private shouldSendEmail(queueMessage: QueueModel): boolean {
    const data = queueMessage.data;

    // Check if email is explicitly disabled
    if (data.emailOptions?.disabled === true) {
      return false;
    }

    // Check if email field exists
    if (!this.extractRecipient(data)) {
      return false;
    }

    // Add business logic to determine when emails should be sent
    // TODO: Add more sophisticated rules based on your business requirements
    return true;
  }

  /**
   * Extract recipient email from queue data
   * @param data - Queue message data
   * @returns Recipient email(s) or null
   */
  private extractRecipient(data: any): string | string[] | null {
    // Try various common email field names
    const emailFields = [
      'email',
      'userEmail',
      'customerEmail',
      'recipient',
      'to',
      'emailAddress'
    ];

    for (const field of emailFields) {
      if (data[field]) {
        return data[field];
      }
    }

    // Check nested objects
    if (data.user?.email) {
      return data.user.email;
    }

    if (data.customer?.email) {
      return data.customer.email;
    }

    // Check email options
    if (data.emailOptions?.recipient) {
      return data.emailOptions.recipient;
    }

    return null;
  }

  /**
   * Extract template variables from queue message
   * @param queueMessage - Queue message containing data
   * @returns Template variables object
   */
  private extractTemplateVariables(queueMessage: QueueModel): any {
    const data = queueMessage.data;
    const baseVariables = {
      websiteId: queueMessage.websiteId,
      operationType: queueMessage.operationType,
      timestamp: new Date().toISOString(),
      ...data
    };

    // Add operation-specific variables
    switch (queueMessage.operationType) {
      case 'create':
        return {
          ...baseVariables,
          isNewRecord: true,
          actionText: 'created',
          recordId: data.id || data._id || 'unknown'
        };
      
      case 'update':
        return {
          ...baseVariables,
          isUpdate: true,
          actionText: 'updated',
          recordId: data.id || data._id || 'unknown',
          changes: data.changes || {}
        };
      
      case 'delete':
        return {
          ...baseVariables,
          isDeleted: true,
          actionText: 'deleted',
          recordId: data.id || data._id || 'unknown'
        };
      
      default:
        return baseVariables;
    }
  }

  /**
   * Process multiple queue messages in batch
   * @param queueMessages - Array of queue messages
   * @returns Promise resolving to batch processing results
   */
  async processBatch(queueMessages: QueueModel[]): Promise<{
    processed: number;
    successful: number;
    failed: number;
    emailsSent: number;
    errors: string[];
  }> {
    const results = {
      processed: 0,
      successful: 0,
      failed: 0,
      emailsSent: 0,
      errors: [] as string[]
    };

    for (const message of queueMessages) {
      try {
        results.processed++;
        
        const result = await this.processQueueMessage(message);
        
        if (result.success) {
          results.successful++;
          if (result.emailSent) {
            results.emailsSent++;
          }
        } else {
          results.failed++;
          if (result.error) {
            results.errors.push(result.error);
          }
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Batch processing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    Logger.log(`Batch processing completed: ${results.processed} processed, ${results.successful} successful, ${results.failed} failed, ${results.emailsSent} emails sent`);
    
    return results;
  }
}
