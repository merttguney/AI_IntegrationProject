# Email Service Documentation

This is a comprehensive email service implementation for the ecom-async project, built following SOLID, DRY, and KISS principles. The service supports both SendGrid and SMTP email sending with MongoDB template storage and Handlebars template processing.

## Features

- ✅ **Multiple Email Providers**: SendGrid and SMTP support
- ✅ **Template Management**: MongoDB storage with CRUD operations
- ✅ **Template Processing**: Handlebars with custom helpers
- ✅ **Queue Integration**: Automatic email sending from queue messages
- ✅ **Production Ready**: Error handling, logging, health checks
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **SOLID Principles**: Clean architecture with dependency injection

## Architecture Overview

```
EmailService
├── Models & Interfaces
│   ├── EmailTemplate.ts       # MongoDB model for templates
│   ├── EmailInterfaces.ts     # Service interfaces
│   └── QueueModel.ts          # Queue message structure
├── Services
│   ├── EmailService.ts        # Main orchestrator service
│   ├── EmailServiceFactory.ts # Factory for service creation
│   ├── MongoTemplateRepository.ts # Template data access
│   ├── HandlebarsTemplateProcessor.ts # Template processing
│   ├── SendGridEmailProvider.ts # SendGrid implementation
│   ├── SMTPEmailProvider.ts  # SMTP implementation
│   ├── MongoDBService.ts      # Database connection
│   └── EmailQueueConsumer.ts  # Queue message processing
├── Utils
│   ├── TemplateSeeder.ts      # Sample template creation
│   └── EmailServiceDemo.ts    # Demo and testing
└── API
    └── emailRoutes.ts          # REST API endpoints
```

## Installation & Setup

### 1. Dependencies

The required packages are already added to package.json:

```bash
npm install mongoose @sendgrid/mail handlebars nodemailer
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
# MongoDB (required)
MONGODB_URI=mongodb://admin:mongopassword@localhost:27017/ecom_templates?authSource=admin

# SendGrid (optional - configure one provider)
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# SMTP (optional - alternative to SendGrid)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com

# Email Service Configuration
EMAIL_PROVIDER=sendgrid  # or 'smtp'
```

### 3. Database Setup

Start MongoDB using Docker Compose:

```bash
docker-compose up -d mongodb
```

## Usage Examples

### 1. Basic Email Sending

```typescript
import { EmailServiceFactory } from './src/service/EmailServiceFactory';

// Initialize service
const emailService = await EmailServiceFactory.getInstance();

// Send direct email
const result = await emailService.sendDirectEmail({
  to: 'customer@example.com',
  subject: 'Welcome!',
  htmlContent: '<h1>Welcome to our service!</h1>',
  textContent: 'Welcome to our service!'
});

console.log('Email result:', result);
```

### 2. Template-based Email Sending

```typescript
// Send templated email
const result = await emailService.sendTemplatedEmail(
  'website1',           // websiteId
  'create',            // operationType
  'customer@example.com', // recipient
  {                    // template variables
    customerName: 'John Doe',
    orderNumber: 'ORD-12345',
    totalAmount: 99.99,
    orderDate: new Date()
  }
);
```

### 3. Queue Integration

The service automatically processes queue messages:

```typescript
import { EmailQueueConsumer } from './src/service/EmailQueueConsumer';

const consumer = EmailQueueConsumer.getInstance();

// Process queue message
const queueMessage = {
  data: {
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    orderNumber: 'ORD-67890'
  },
  websiteId: 'website1',
  operationType: 'create'
};

const result = await consumer.processQueueMessage(queueMessage);
```

## Template Management

### Template Structure

Templates are stored in MongoDB with the following structure:

```typescript
{
  templateId: 'website1_order_create_001',
  websiteId: 'website1',
  operationType: 'create',
  templateName: 'Order Confirmation',
  subject: 'Order Confirmation - {{orderNumber}}',
  htmlContent: '<h2>Thank you {{customerName}}!</h2>...',
  textContent: 'Thank you {{customerName}}!...',
  variables: ['customerName', 'orderNumber'],
  isActive: true
}
```

### Handlebars Helpers

The service includes custom Handlebars helpers:

```handlebars
<!-- Date formatting -->
{{formatDate orderDate 'long'}}
{{formatDate orderDate 'short'}}
{{formatDate orderDate 'time'}}

<!-- Currency formatting -->
{{formatCurrency totalAmount}}
{{formatCurrency totalAmount 'EUR'}}

<!-- Text formatting -->
{{uppercase status}}
{{lowercase email}}

<!-- Conditionals -->
{{#if trackingNumber}}
  <p>Tracking: {{trackingNumber}}</p>
{{/if}}

{{#eq status 'shipped'}}
  <p>Your order has been shipped!</p>
{{/eq}}

<!-- Array operations -->
{{#each items}}
  <div>{{name}} - {{formatCurrency price}}</div>
{{/each}}

Items count: {{length items}}
```

### Sample Templates

Seed sample templates for testing:

```bash
# Via API
curl -X POST http://localhost:3000/email/seed-templates

# Via code
import { TemplateSeeder } from './src/utils/TemplateSeeder';
await TemplateSeeder.seedSampleTemplates();
```

## API Endpoints

### Health Check
```
GET /email/health
```

### Template Management
```
GET    /email/templates                    # List all templates
GET    /email/templates/:templateId        # Get specific template
POST   /email/templates                    # Create template
PUT    /email/templates/:templateId        # Update template
DELETE /email/templates/:templateId        # Delete template
```

### Email Sending
```
POST   /email/send-direct                  # Send direct email
POST   /email/send-templated               # Send templated email
```

### Development
```
POST   /email/seed-templates               # Seed sample templates
```

## Configuration Examples

### SendGrid Configuration

```bash
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
EMAIL_PROVIDER=sendgrid
```

### Gmail SMTP Configuration

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password  # Use App Password, not regular password
SMTP_FROM_EMAIL=your_email@gmail.com
EMAIL_PROVIDER=smtp
```

### Custom SMTP Server

```bash
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your_smtp_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
EMAIL_PROVIDER=smtp
```

## Testing

### Running the Demo

```typescript
import { EmailServiceDemo } from './src/utils/EmailServiceDemo';

// Run complete demo
await EmailServiceDemo.runDemo();
```

### Health Check

```bash
curl http://localhost:3000/email/health
```

### Send Test Email

```bash
curl -X POST http://localhost:3000/email/send-direct \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "htmlContent": "<h1>Test</h1><p>This is a test email.</p>"
  }'
```

## Production Considerations

### Security
- Store sensitive credentials in environment variables
- Use API key authentication for routes
- Validate all input data
- Implement rate limiting

### Performance
- Connection pooling for databases
- Queue processing for bulk emails
- Email provider failover
- Template caching

### Monitoring
- Health check endpoints
- Comprehensive logging
- Error tracking with Sentry
- Email delivery tracking

### Deployment
- Use environment-specific configurations
- Disable template seeding in production
- Set up proper backup strategies
- Monitor email bounces and complaints

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MONGODB_URI environment variable
   - Ensure MongoDB is running
   - Verify network connectivity

2. **SendGrid Authentication Failed**
   - Verify API key is correct and has send permissions
   - Check sender email is verified in SendGrid

3. **SMTP Connection Failed**
   - Verify SMTP credentials and server settings
   - Check firewall and network settings
   - For Gmail, use App Passwords instead of regular passwords

4. **Template Not Found**
   - Ensure template exists with correct websiteId and operationType
   - Check template is active (isActive: true)
   - Verify MongoDB connection

### Debug Mode

Enable detailed logging by setting appropriate log levels in your environment.

## Architecture Principles Applied

### SOLID Principles

1. **Single Responsibility**: Each class has one clear purpose
   - `EmailService` orchestrates email sending
   - `TemplateProcessor` handles template compilation
   - `EmailProvider` handles specific provider communication

2. **Open/Closed**: Easy to extend with new providers or processors
   - Add new email providers by implementing `IEmailProvider`
   - Add new template processors by implementing `ITemplateProcessor`

3. **Liskov Substitution**: Providers are interchangeable
   - SendGrid and SMTP providers implement same interface
   - Can switch providers without changing business logic

4. **Interface Segregation**: Focused, specific interfaces
   - Separate interfaces for different responsibilities
   - No forced implementation of unused methods

5. **Dependency Inversion**: Depends on abstractions, not concretions
   - Main service depends on interfaces, not specific implementations
   - Dependency injection enables easy testing and configuration

### DRY (Don't Repeat Yourself)

- Template variables extraction logic centralized
- Common email validation in base interfaces
- Shared error handling patterns
- Reusable Handlebars helpers

### KISS (Keep It Simple, Stupid)

- Clear, readable code with descriptive names
- Simple configuration via environment variables
- Straightforward API design
- Minimal dependencies with well-maintained libraries

## TODO Items

Some areas marked as TODO for production enhancement:

1. **Email Provider Configuration**: Add from-email configuration per provider
2. **Production Environment Checks**: Disable certain endpoints in production
3. **Enhanced Validation**: Add more sophisticated template validation
4. **Batch Processing**: Optimize bulk email sending
5. **Provider Failover**: Automatic fallback between providers
6. **Template Versioning**: Support for multiple template versions
7. **Email Analytics**: Track open rates, click rates, etc.
8. **Webhook Handling**: Process delivery status callbacks

This email service provides a solid foundation for production email handling while maintaining clean architecture and extensibility.
