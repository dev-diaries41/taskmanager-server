import { createLogger, format, transports } from 'winston';

const commonTransports = [
  new transports.Console(),
  new transports.File({
    filename: 'error.log',
    level: 'error',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    ),
  }),
];

const combinedTransport = new transports.File({
  filename: 'combined.log',
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
});

const tasksTransporter = new transports.File({
  filename: 'tasks.log',
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.metadata(),
    format.json()
  ),
});

const logger = createLogger({
  transports: [...commonTransports, combinedTransport],
});

const taskLogger = createLogger({
  transports: [...commonTransports, tasksTransporter],
});

export { logger, taskLogger };