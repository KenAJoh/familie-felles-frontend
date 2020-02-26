'use strict';

import { Request } from 'express';
import fs from 'fs';
import momenttz from 'moment-timezone';
import winston from 'winston';

const auditLogPath = () =>
    fs.existsSync('/secure-logs/') ? '/secure-logs/secure.log' : './secure.log';

const stdoutLogger = winston.createLogger({
    format: winston.format.simple(),
    level: 'info',
    transports: [new winston.transports.Console()],
});

const auditLogger = winston.createLogger({
    format: winston.format.simple(),
    level: 'info',
    transports: [new winston.transports.File({ filename: auditLogPath(), maxsize: 5242880 })],
});

export const info = (message: string) => {
    stdoutLogger.info(`[${getLogTimestamp()}] ${message}`);
};

export const warning = (message: string) => {
    stdoutLogger.warn(`[${getLogTimestamp()}] ${message}`);
};

export const error = (message: string, err?: Error) => {
    stdoutLogger.error(message, err && { message: `: ${err?.message || err}` });
};

export const audit = (message: string) => {
    auditLogger.info(`[${getLogTimestamp()}] ${message}`);
};

export const getLogTimestamp = () => {
    return `${momenttz()
        .tz('Europe/Oslo')
        .format('YYYY-MM-DD HH:mm:ss')}`;
};

const prefix = (req: Request) => {
    return `${req.session ? `${req.session.displayName} -` : 'ugyldig sesjon -'} ${req.method} - ${
        req.originalUrl
    }`;
};

export const logRequest = (req: Request, message: string, level: LOG_LEVEL) => {
    const melding = `${prefix(req)}: ${message}`;
    switch (level) {
        case LOG_LEVEL.INFO:
            info(melding);
            break;
        case LOG_LEVEL.WARNING:
            warning(melding);
            break;
        case LOG_LEVEL.ERROR:
            error(melding);
            break;
        default:
            info(melding);
    }
};

export enum LOG_LEVEL {
    INFO,
    WARNING,
    ERROR,
}