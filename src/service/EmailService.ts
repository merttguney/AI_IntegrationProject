import { 
  IEmailService, 
  IEmailProvider, 
  ITemplateProcessor, 
  ITemplateRepository,
  EmailData, 
  EmailResult, 
  TemplateVariables,
  ProcessedTemplate 
} from '../model/EmailInterfaces';
import { HandlebarsTemplateProcessor } from './HandlebarsTemplateProcessor';
import { MongoTemplateRepository } from './MongoTemplateRepository';
import { SendGridEmailProvider } from './SendGridEmailProvider';
import { SMTPEmailProvider } from './SMTPEmailProvider';
import Logger from '../logger/Logger';

/**
 * Main email service implementing Dependency Inversion and Single Responsibility Principles
 * Orchestrates template processing and email sending without knowing implementation details
 */
export class EmailService implements IEmailService {
  private readonly templateProcessor: ITemplateProcessor;
  private readonly templateRepository: ITemplateRepository;
  private readonly emailProviders: Map<string, IEmailProvider>;
  private readonly defaultProvider: string;

  constructor(
    templateProcessor?: ITemplateProcessor,
    templateRepository?: ITemplateRepository,
    defaultProvider: string = 'sendgrid'
  ) {
    // Use dependency injection with defaults (following Dependency Inversion Principle)
    this.templateProcessor = templateProcessor || new HandlebarsTemplateProcessor();
    this.templateRepository = templateRepository || new MongoTemplateRepository();
    this.emailProviders = new Map();
    this.defaultProvider = defaultProvider;
    
    this.initializeProviders();
  }

  /**
   * Send templated email based on websiteId and operation type
   * @param websiteId - The website identifier
   * @param operationType - The operation type (create, update, delete)
   * @param recipient - Email recipient(s)
   * @param templateVariables - Variables to replace in template
   * @param options - Additional email options
   * @returns Promise resolving to email result
   */
  async sendTemplatedEmail(
    websiteId: string,
    operationType: string,
    recipient: string | string[],
    templateVariables: TemplateVariables,
    options?: {
      cc?: string | string[];
      bcc?: string | string[];
      attachments?: any[];
    }
  ): Promise<EmailResult> {
    try {
      // Step 1: Fetch template from repository
      const template = await this.templateRepository.findByWebsiteIdAndOperation(
        websiteId, 
        operationType
      );

      if (!template) {
        const errorMessage = `No template found for websiteId: ${websiteId}, operationType: ${operationType}`;
        Logger.log(errorMessage);
        return {
          success: false,
          error: errorMessage,
          provider: this.defaultProvider
        };
      }

      // Step 2: Process template with variables
      const processedTemplate = this.processTemplate(template, templateVariables);

      // Step 3: Prepare email data
      const emailData: EmailData = {
        to: recipient,
        subject: processedTemplate.subject,
        htmlContent: processedTemplate.htmlContent,
        textContent: processedTemplate.textContent,
        cc: options?.cc,
        bcc: options?.bcc,
        attachments: options?.attachments
      };

      // Step 4: Send email using configured provider
      const result = await this.sendDirectEmail(emailData);

      Logger.log(`Templated email sent for websiteId: ${websiteId}, operationType: ${operationType}, success: ${result.success}`);
      
      return result;
    } catch (error) {
      const errorMessage = `Failed to send templated email: ${error instanceof Error ? error.message : 'Unknown error'}`;
      Logger.log(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        provider: this.defaultProvider
      };
    }
  }

  /**
   * Send email directly without template processing
   * @param emailData - Complete email data
   * @returns Promise resolving to email result
   */
  async sendDirectEmail(emailData: EmailData): Promise<EmailResult> {
    try {
      const provider = this.getEmailProvider(this.defaultProvider);
      
      if (!provider) {
        throw new Error(`Email provider '${this.defaultProvider}' not available`);
      }

      const result = await provider.sendEmail(emailData);
      
      Logger.log(`Direct email sent to: ${emailData.to}, success: ${result.success}, provider: ${result.provider}`);
      
      return result;
    } catch (error) {
      const errorMessage = `Failed to send direct email: ${error instanceof Error ? error.message : 'Unknown error'}`;
      Logger.log(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        provider: this.defaultProvider
      };
    }
  }

  /**
   * Test email service connection
   * @returns Promise resolving to connection status
   */
  async testConnection(): Promise<boolean> {
    try {
      const provider = this.getEmailProvider(this.defaultProvider);
      
      if (!provider) {
        Logger.log(`Email provider '${this.defaultProvider}' not available for testing`);
        return false;
      }

      // Test provider connection if method exists
      if ('testConnection' in provider && typeof provider.testConnection === 'function') {
        return await (provider as any).testConnection();
      }

      // Fallback: validate configuration
      return provider.validateConfig();
    } catch (error) {
      Logger.log(`Email service connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  /**
   * Process template with variables
   * @param template - Template object from database
   * @param variables - Variables to replace
   * @returns Processed template
   */
  private processTemplate(template: any, variables: TemplateVariables): ProcessedTemplate {
    const processedSubject = this.templateProcessor.processTemplate(template.subject, variables);
    const processedHtmlContent = this.templateProcessor.processTemplate(template.htmlContent, variables);
    
    let processedTextContent: string | undefined;
    if (template.textContent) {
      processedTextContent = this.templateProcessor.processTemplate(template.textContent, variables);
    }

    return {
      subject: processedSubject,
      htmlContent: processedHtmlContent,
      textContent: processedTextContent
    };
  }

  /**
   * Initialize email providers based on environment configuration
   */
  private initializeProviders(): void {
    try {
      // Initialize SendGrid provider if API key is available
      const sendGridApiKey = process.env.SENDGRID_API_KEY;
      if (sendGridApiKey) {
        const sendGridProvider = new SendGridEmailProvider(sendGridApiKey);
        this.emailProviders.set('sendgrid', sendGridProvider);
        Logger.log('SendGrid email provider initialized');
      }

      // Initialize SMTP provider if configuration is available
      const smtpConfig = this.getSMTPConfig();
      if (smtpConfig) {
        const smtpProvider = new SMTPEmailProvider(smtpConfig);
        this.emailProviders.set('smtp', smtpProvider);
        Logger.log('SMTP email provider initialized');
      }

      // Validate default provider exists
      if (!this.emailProviders.has(this.defaultProvider)) {
        Logger.log(`Warning: Default provider '${this.defaultProvider}' not available. Available providers: ${Array.from(this.emailProviders.keys()).join(', ')}`);
      }
    } catch (error) {
      Logger.log(`Error initializing email providers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get SMTP configuration from environment variables
   * @returns SMTP config object or null if not configured
   */
  private getSMTPConfig(): any | null {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      return null;
    }

    return {
      host,
      port: parseInt(port, 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false'
      }
    };
  }

  /**
   * Get email provider by name
   * @param providerName - Name of the provider
   * @returns Email provider or null
   */
  private getEmailProvider(providerName: string): IEmailProvider | null {
    return this.emailProviders.get(providerName) || null;
  }

  /**
   * Get list of available email providers
   * @returns Array of provider names
   */
  getAvailableProviders(): string[] {
    return Array.from(this.emailProviders.keys());
  }

  /**
   * Switch default email provider
   * @param providerName - Name of the provider to set as default
   * @returns True if switch was successful
   */
  switchProvider(providerName: string): boolean {
    if (this.emailProviders.has(providerName)) {
      (this as any).defaultProvider = providerName;
      Logger.log(`Switched default email provider to: ${providerName}`);
      return true;
    }
    
    Logger.log(`Failed to switch provider: '${providerName}' not available`);
    return false;
  }
}
