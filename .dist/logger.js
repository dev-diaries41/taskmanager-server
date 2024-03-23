"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskLogger = exports.logger = void 0;
const winston_1 = require("winston");
const commonTransports = [
    new winston_1.transports.Console(),
    new winston_1.transports.File({
        filename: 'error.log',
        level: 'error',
        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json()),
    }),
];
const combinedTransport = new winston_1.transports.File({
    filename: 'combined.log',
    level: 'debug',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
});
const tasksTransporter = new winston_1.transports.File({
    filename: 'tasks.log',
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.metadata(), winston_1.format.json()),
});
const logger = (0, winston_1.createLogger)({
    transports: [...commonTransports, combinedTransport],
});
exports.logger = logger;
const taskLogger = (0, winston_1.createLogger)({
    transports: [...commonTransports, tasksTransporter],
});
exports.taskLogger = taskLogger;
