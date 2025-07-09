import * as Handlebars from 'handlebars';
import { ITemplateProcessor, TemplateVariables } from '../model/EmailInterfaces';

/**
 * Handlebars template processor implementing Single Responsibility Principle
 * Responsible only for template compilation and variable replacement
 */
export class HandlebarsTemplateProcessor implements ITemplateProcessor {
  private readonly handlebars: typeof Handlebars;

  constructor() {
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  /**
   * Process template with variables using Handlebars
   * @param template - The template string with Handlebars syntax
   * @param variables - Variables to replace in the template
   * @returns Processed template string
   */
  processTemplate(template: string, variables: TemplateVariables): string {
    try {
      const compiledTemplate = this.handlebars.compile(template);
      return compiledTemplate(variables);
    } catch (error) {
      throw new Error(`Template processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract variable names from template
   * @param template - The template string
   * @returns Array of variable names found in template
   */
  extractVariables(template: string): string[] {
    const variablePattern = /\{\{\s*([^}]+)\s*\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = variablePattern.exec(template)) !== null) {
      // Clean up the variable name (remove spaces, helpers, etc.)
      const variableName = match[1].trim().split(' ')[0];
      if (!this.isHelper(variableName)) {
        variables.add(variableName);
      }
    }

    return Array.from(variables);
  }

  /**
   * Validate template syntax
   * @param template - The template string to validate
   * @returns True if template is valid, false otherwise
   */
  validateTemplate(template: string): boolean {
    try {
      this.handlebars.compile(template);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Register custom Handlebars helpers for email templates
   */
  private registerHelpers(): void {
    // Date formatting helper
    this.handlebars.registerHelper('formatDate', function(date: Date | string, format?: string) {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      switch (format) {
        case 'short':
          return dateObj.toLocaleDateString();
        case 'long':
          return dateObj.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        case 'time':
          return dateObj.toLocaleTimeString();
        default:
          return dateObj.toLocaleDateString();
      }
    });

    // Currency formatting helper
    this.handlebars.registerHelper('formatCurrency', function(amount: number, currency = 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    });

    // Uppercase helper
    this.handlebars.registerHelper('uppercase', function(str: string) {
      return str ? str.toUpperCase() : '';
    });

    // Lowercase helper
    this.handlebars.registerHelper('lowercase', function(str: string) {
      return str ? str.toLowerCase() : '';
    });

    // Conditional equality helper
    this.handlebars.registerHelper('eq', function(a: any, b: any) {
      return a === b;
    });

    // Array length helper
    this.handlebars.registerHelper('length', function(array: any[]) {
      return Array.isArray(array) ? array.length : 0;
    });
  }

  /**
   * Check if a name is a Handlebars helper
   * @param name - The name to check
   * @returns True if it's a helper, false otherwise
   */
  private isHelper(name: string): boolean {
    const builtInHelpers = ['if', 'unless', 'each', 'with', 'lookup', 'log'];
    const customHelpers = ['formatDate', 'formatCurrency', 'uppercase', 'lowercase', 'eq', 'length'];
    
    return builtInHelpers.includes(name) || customHelpers.includes(name);
  }
}
