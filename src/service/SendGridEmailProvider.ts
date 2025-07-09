import sgMail from '@sendgrid/mail';
import { IEmailProvider, EmailData, EmailResult } from '../model/EmailInterfaces';
import Logger from '../logger/Logger';

/**
 * SendGrid email provider implementation following Single Responsibility Principle
 * Responsible only for sending emails via SendGrid API
 */
export class SendGridEmailProvider implements IEmailProvider {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('SendGrid API key is required');
    }
    
    this.apiKey = apiKey;
    sgMail.setApiKey(this.apiKey);
  }

  /**
   * Send email via SendGrid
   * @param emailData - Email data containing recipient, subject, and content
   * @returns Promise resolving to email result
   */
  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      const msg = this.prepareMessage(emailData);
      
      const [response] = await sgMail.send(msg);
      
      Logger.log(`Email sent successfully via SendGrid to: ${emailData.to}, messageId: ${response.headers['x-message-id']}`);
      
      return {
        success: true,
        messageId: response.headers['x-message-id'] as string,
        provider: 'sendgrid'
      };
    } catch (error) {
      const errorMessage = this.extractErrorMessage(error);
      Logger.log(`Failed to send email via SendGrid: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
        provider: 'sendgrid'
      };
    }
  }

  /**
   * Validate SendGrid configuration
   * @returns True if configuration is valid
   */
  validateConfig(): boolean {
    return !!this.apiKey && this.apiKey.startsWith('SG.');
  }

  /**
   * Get provider name
   * @returns Provider name
   */
  getProviderName(): string {
    return 'SendGrid';
  }

  /**
   * Prepare SendGrid message format
   * @param emailData - Email data to convert
   * @returns SendGrid message object
   */
  private prepareMessage(emailData: EmailData): any {
    const message: any = {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.htmlContent,
    };

    // Add text content if provided
    if (emailData.textContent) {
      message.text = emailData.textContent;
    }

    // Add CC recipients if provided
    if (emailData.cc) {
      message.cc = emailData.cc;
    }

    // Add BCC recipients if provided
    if (emailData.bcc) {
      message.bcc = emailData.bcc;
    }

    // Add attachments if provided
    if (emailData.attachments && emailData.attachments.length > 0) {
      message.attachments = emailData.attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content.toString('base64'),
        type: attachment.contentType || 'application/octet-stream',
        disposition: attachment.cid ? 'inline' : 'attachment',
        content_id: attachment.cid
      }));
    }

    // TODO: Add from email address from environment variable
    // For production, this should be configured via environment variables
    // message.from = process.env.SENDGRID_FROM_EMAIL;
    message.from = 'noreply@yourdomain.com'; // Placeholder

    return message;
  }

  /**
   * Extract meaningful error message from SendGrid error
   * @param error - Error object from SendGrid
   * @returns Formatted error message
   */
  private extractErrorMessage(error: any): string {
    if (error.response && error.response.body && error.response.body.errors) {
      const errors = error.response.body.errors;
      return errors.map((err: any) => err.message || err.field).join(', ');
    }

    if (error.message) {
      return error.message;
    }

    return 'Unknown SendGrid error occurred';
  }

  /**
   * Test SendGrid connection by attempting to validate API key
   * @returns Promise resolving to connection status
   */
  async testConnection(): Promise<boolean> {
    try {
      // SendGrid doesn't have a dedicated health check endpoint
      // We validate by checking API key format and configuration
      if (!this.validateConfig()) {
        return false;
      }

      // TODO: In production, you might want to send a test email
      // to a verified sender to fully test the connection
      Logger.log('SendGrid configuration validated successfully');
      return true;
    } catch (error) {
      Logger.log(`SendGrid connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }
}
