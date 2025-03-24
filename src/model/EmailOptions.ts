export interface EmailOptions {
    to: string | string[];
    subject: string;
    templateName: string;
    data: Record<string, any>;
    attachments?: Array<{
        filename: string;
        path: string;
    }>;
}