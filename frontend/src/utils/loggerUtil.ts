type Env = 'local' | 'prod';

const env = (import.meta.env.VITE_ENV as Env) ?? 'prod';
const isDev = env === 'local';
const padding = (level: string) => level.padEnd(8, ' ');

const getTimestamp = (): string => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-CA', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        second: '2-digit',
    });

    const ms = String(now.getMilliseconds()).padStart(3, '0');

    return `${time}.${ms}`;
};

const logger = {
    error: (message: string, ...optional: unknown[]): void => {
        if (isDev) {
            console.error(`${getTimestamp()} ${padding('[ERROR]')} ${message}`, ...optional);
        } else {
            console.error(`${message}`);
        }
    },

    info: (message: string, ...optional: unknown[]): void => {
        if (isDev) {
            console.info(`${getTimestamp()} ${padding('[INFO]')} ${message}`, ...optional);
        } else {
            console.info(`${message}`);
        }
    },

    warn: (message: string, ...optional: unknown[]): void => {
        if (isDev) {
            console.warn(`${getTimestamp()} ${padding('[WARN]')} ${message}`, ...optional);
        } else {
            console.warn(`${message}`);
        }
    },
};

export default logger;
