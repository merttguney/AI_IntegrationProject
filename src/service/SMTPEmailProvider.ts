import nodemailer from 'nodemailer';
import { IEmailProvider, EmailData, EmailResult, SMTPConfig } from '../model/EmailInterfaces';
import Logger from '../logger/Logger';

/**
 * SMTP email provider implementation following Single Responsibility Principle
 * Responsible only for sending emails via SMTP servers
 */
export class SMTPEmailProvider implements IEmailProvider {
  private readonly transporter: nodemailer.Transporter;
  private readonly config: SMTPConfig;

  constructor(config: SMTPConfig) {
    if (!config || !config.host || !config.auth) {
      throw new Error('SMTP configuration is required with host and auth credentials');
    }

    this.config = config;
    this.transporter = this.createTransporter();
  }

  /**
   * Send email via SMTP
   * @param emailData - Email data containing recipient, subject, and content
   * @returns Promise resolving to email result
   */
  async sendEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      const mailOptions = this.prepareMailOptions(emailData);
      
      const info = await this.transporter.sendMail(mailOptions);
      
      Logger.log(`Email sent successfully via SMTP to: ${emailData.to}, messageId: ${info.messageId}`);
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'smtp'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown SMTP error';
      Logger.log(`Failed to send email via SMTP: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage,
        provider: 'smtp'
      };
    }
  }

  /**
   * Validate SMTP configuration
   * @returns True if configuration is valid
   */
  validateConfig(): boolean {
    return !!(
      this.config.host &&
      this.config.port &&
      this.config.auth &&
      this.config.auth.user &&
      this.config.auth.pass
    );
  }

  /**
   * Get provider name
   * @returns Provider name
   */
  getProviderName(): string {
    return 'SMTP';
  }

  /**
   * Create nodemailer transporter with SMTP configuration
   * @returns Configured transporter
   */
  private createTransporter(): nodemailer.Transporter {
    const transporterConfig: any = {
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure, // true for 465, false for other ports
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
    };

    // Add TLS configuration if provided
    if (this.config.tls) {
      transporterConfig.tls = this.config.tls;
    }

    return nodemailer.createTransport(transporterConfig);
  }

  /**
   * Prepare mail options for nodemailer
   * @param emailData - Email data to convert
   * @returns Mail options object
   */
  private prepareMailOptions(emailData: EmailData): nodemailer.SendMailOptions {
    const mailOptions: nodemailer.SendMailOptions = {
      to: Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to,
      subject: emailData.subject,
      html: emailData.htmlContent,
    };

    // Add text content if provided
    if (emailData.textContent) {
      mailOptions.text = emailData.textContent;
    }

    // Add CC recipients if provided
    if (emailData.cc) {
      mailOptions.cc = Array.isArray(emailData.cc) ? emailData.cc.join(', ') : emailData.cc;
    }

    // Add BCC recipients if provided
    if (emailData.bcc) {
      mailOptions.bcc = Array.isArray(emailData.bcc) ? emailData.bcc.join(', ') : emailData.bcc;
    }

    // Add attachments if provided
    if (emailData.attachments && emailData.attachments.length > 0) {
      mailOptions.attachments = emailData.attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
        cid: attachment.cid
      }));
    }

    // TODO: Add from email address from environment variable
    // For production, this should be configured via environment variables
    // mailOptions.from = process.env.SMTP_FROM_EMAIL;
    mailOptions.from = this.config.auth.user; // Use auth user as sender by default

    return mailOptions;
  }

  /**
   * Test SMTP connection
   * @returns Promise resolving to connection status
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      Logger.log('SMTP connection test successful');
      return true;
    } catch (error) {
      Logger.log(`SMTP connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Close SMTP connection
   * @returns Promise that resolves when connection is closed
   */
  async close(): Promise<void> {
    try {
      this.transporter.close();
      Logger.log('SMTP connection closed successfully');
    } catch (error) {
      Logger.log(`Error closing SMTP connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
