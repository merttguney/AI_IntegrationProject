import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { EmailOptions } from '../model/EmailOptions';
const PARAMETER_NAME = 'EMAIL_CONFIG';

export class EmailService {
    private transporter: nodemailer.Transporter;
    private data: any;

    constructor(
        private parameters: {
            data: any
            action: string;
        }
    ) {
        const { config } = parameters.data
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth
        });
        this.data = parameters.data
    }

    async sendEmailWithTemplate(options: EmailOptions): Promise<void> {
        try {
            // Load template file

            // Compile template with Handlebars
            const template = Handlebars.compile(this.data.config.template);
            const html = template(options.data);

            // Send email
            await this.transporter.sendMail({
                from: this.data.config.from,
                to: options.to,
                subject: options.subject,
                html,
                attachments: options.attachments
            });

            console.log(`Email sent successfully to: ${options.to}`);
        } catch (error: any) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}


