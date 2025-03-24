import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
} else {
    console.warn('Error: SENTRY_DSN is not set');
}

const log = (message: string) => {
    if (Sentry.isInitialized()) {
        Sentry.captureMessage(message)
    } else {
        console.warn('Unable to init sentry message is ', message)
    }
}

export default {
    log
}