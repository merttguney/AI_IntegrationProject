import mongoose from 'mongoose';
import { EmailTemplate, IEmailTemplate } from '../model/EmailTemplate';
import { ITemplateRepository } from '../model/EmailInterfaces';
import Logger from '../logger/Logger';

/**
 * MongoDB template repository implementing Single Responsibility Principle
 * Responsible only for database operations related to email templates
 */
export class MongoTemplateRepository implements ITemplateRepository {
  constructor() {
    // Logger is statically imported
  }

  /**
   * Find template by websiteId and operation type
   * @param websiteId - The website identifier
   * @param operationType - The operation type (create, update, delete)
   * @returns Promise resolving to template or null
   */
  async findByWebsiteIdAndOperation(
    websiteId: string, 
    operationType: string
  ): Promise<IEmailTemplate | null> {
    try {
      const template = await EmailTemplate.findOne({
        websiteId,
        operationType,
        isActive: true
      }).exec();

      Logger.log(`Template query completed for websiteId: ${websiteId}, operationType: ${operationType}, found: ${!!template}`);

      return template;
    } catch (error) {
      Logger.log(`Failed to find template by websiteId and operation: ${websiteId}, ${operationType}, error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new email template
   * @param templateData - The template data to create
   * @returns Promise resolving to created template
   */
  async create(templateData: Partial<IEmailTemplate>): Promise<IEmailTemplate> {
    try {
      // Generate unique template ID if not provided
      if (!templateData.templateId) {
        templateData.templateId = this.generateTemplateId(
          templateData.websiteId!,
          templateData.operationType!
        );
      }

      const template = new EmailTemplate(templateData);
      const savedTemplate = await template.save();

      Logger.log(`Template created successfully: ${savedTemplate.templateId} for website: ${savedTemplate.websiteId}`);

      return savedTemplate;
    } catch (error) {
      Logger.log(`Failed to create template: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Template creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing template
   * @param templateId - The template ID to update
   * @param updates - The updates to apply
   * @returns Promise resolving to updated template or null
   */
  async update(templateId: string, updates: Partial<IEmailTemplate>): Promise<IEmailTemplate | null> {
    try {
      // Remove fields that shouldn't be updated
      const { _id, templateId: _, createdAt, ...validUpdates } = updates as any;

      const updatedTemplate = await EmailTemplate.findOneAndUpdate(
        { templateId },
        { 
          ...validUpdates,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      ).exec();

      Logger.log(`Template updated successfully: ${templateId}, updated: ${!!updatedTemplate}`);

      return updatedTemplate;
    } catch (error) {
      Logger.log(`Failed to update template: ${templateId}, error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Template update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Soft delete a template (mark as inactive)
   * @param templateId - The template ID to delete
   * @returns Promise resolving to deletion success
   */
  async delete(templateId: string): Promise<boolean> {
    try {
      const result = await EmailTemplate.findOneAndUpdate(
        { templateId },
        { 
          isActive: false,
          updatedAt: new Date()
        },
        { new: true }
      ).exec();

      const success = !!result;
      Logger.log(`Template deletion completed: ${templateId}, success: ${success}`);

      return success;
    } catch (error) {
      Logger.log(`Failed to delete template: ${templateId}, error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Template deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find template by ID
   * @param templateId - The template ID
   * @returns Promise resolving to template or null
   */
  async findById(templateId: string): Promise<IEmailTemplate | null> {
    try {
      const template = await EmailTemplate.findOne({ 
        templateId,
        isActive: true 
      }).exec();

      Logger.log(`Template findById completed: ${templateId}, found: ${!!template}`);

      return template;
    } catch (error) {
      Logger.log(`Failed to find template by ID: ${templateId}, error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Template query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find all templates with optional filters
   * @param filters - Optional filters to apply
   * @returns Promise resolving to array of templates
   */
  async findAll(filters: any = {}): Promise<IEmailTemplate[]> {
    try {
      const query = {
        isActive: true,
        ...filters
      };

      const templates = await EmailTemplate.find(query)
        .sort({ createdAt: -1 })
        .exec();

      Logger.log(`Templates findAll completed, count: ${templates.length}`);

      return templates;
    } catch (error) {
      Logger.log(`Failed to find all templates, error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error(`Templates query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a unique template ID
   * @param websiteId - The website ID
   * @param operationType - The operation type
   * @returns Generated template ID
   */
  private generateTemplateId(websiteId: string, operationType: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${websiteId}_${operationType}_${timestamp}_${random}`;
  }

  /**
   * Check database connection health
   * @returns Promise resolving to connection status
   */
  async healthCheck(): Promise<boolean> {
    try {
      const state = mongoose.connection.readyState;
      return state === 1; // 1 = connected
    } catch (error) {
      Logger.log(`Database health check failed, error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }
}
