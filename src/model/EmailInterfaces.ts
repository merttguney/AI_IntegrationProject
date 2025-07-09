/**
 * Email service interfaces and types following SOLID principles
 * Single Responsibility: Each interface has one clear purpose
 */

export interface EmailData {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  cid?: string; // Content ID for inline attachments
}

export interface TemplateData {
  [key: string]: any;
}

export interface EmailServiceConfig {
  provider: "sendgrid" | "smtp";
  apiKey?: string; // For SendGrid
  smtpConfig?: SMTPConfig; // For SMTP
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}

export interface TemplateVariables {
  [key: string]: string | number | boolean | Date;
}

export interface ProcessedTemplate {
  subject: string;
  htmlContent: string;
  textContent?: string;
}

/**
 * Base interface for email providers following Dependency Inversion Principle
 */
export interface IEmailProvider {
  sendEmail(emailData: EmailData): Promise<EmailResult>;
  validateConfig(): boolean;
  getProviderName(): string;
}

/**
 * Interface for template processing following Single Responsibility Principle
 */
export interface ITemplateProcessor {
  processTemplate(template: string, variables: TemplateVariables): string;
  extractVariables(template: string): string[];
  validateTemplate(template: string): boolean;
}

/**
 * Interface for template repository following Interface Segregation Principle
 */
export interface ITemplateRepository {
  findByWebsiteIdAndOperation(
    websiteId: string,
    operationType: string
  ): Promise<any>;
  create(template: any): Promise<any>;
  update(templateId: string, updates: any): Promise<any>;
  delete(templateId: string): Promise<boolean>;
  findById(templateId: string): Promise<any>;
  findAll(filters?: any): Promise<any[]>;
}

/**
 * Main email service interface following Open/Closed Principle
 */
export interface IEmailService {
  sendTemplatedEmail(
    websiteId: string,
    operationType: string,
    recipient: string | string[],
    templateVariables: TemplateVariables,
    options?: {
      cc?: string | string[];
      bcc?: string | string[];
      attachments?: EmailAttachment[];
    }
  ): Promise<EmailResult>;

  sendDirectEmail(emailData: EmailData): Promise<EmailResult>;

  testConnection(): Promise<boolean>;
}
