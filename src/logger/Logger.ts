import * as Sentry from '@sentry/node';

// Initialize Sentry only if DSN is provided
if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    console.log('✅ Sentry initialized successfully');
} else {
    console.log('⚠️  SENTRY_DSN is not set - using console logging only');
}

const log = (message: string) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${message}`;
    
    // Always log to console
    console.log(formattedMessage);
    
    // Send to Sentry if initialized
    if (Sentry.isInitialized()) {
        Sentry.captureMessage(message);
    }
}

const error = (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ERROR: ${message}`;
    
    // Always log to console
    console.error(formattedMessage);
    if (error) {
        console.error(error);
    }
    
    // Send to Sentry if initialized
    if (Sentry.isInitialized()) {
        if (error instanceof Error) {
            Sentry.captureException(error);
        } else {
            Sentry.captureMessage(message, 'error');
        }
    }
}

const info = (message: string) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] INFO: ${message}`;
    
    console.log(formattedMessage);
    
    if (Sentry.isInitialized()) {
        Sentry.captureMessage(message, 'info');
    }
}

const warn = (message: string) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] WARN: ${message}`;
    
    console.warn(formattedMessage);
    
    if (Sentry.isInitialized()) {
        Sentry.captureMessage(message, 'warning');
    }
}

export default {
    log,
    error,
    info,
    warn
}