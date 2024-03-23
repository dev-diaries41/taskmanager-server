"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchedule = exports.validateNotifications = void 0;
const logger_1 = require("../logger");
const express_validator_1 = require("express-validator");
const validateNotifications = async (req) => {
    try {
        await (0, express_validator_1.check)('message').notEmpty().withMessage('Message is required').run(req);
        // Check for validation errors
        const validationCheck = (0, express_validator_1.validationResult)(req);
        if (!validationCheck.isEmpty()) {
            return { success: false, error: validationCheck.array() };
        }
        return { success: true, message: 'VALIDATION SUCCESSFUL' };
    }
    catch (error) {
        logger_1.logger.error(`Error in validateNotifications: ${error}`);
        return { success: false, message: 'VALIDATION FAILED' };
    }
};
exports.validateNotifications = validateNotifications;
const validateSchedule = async (req) => {
    try {
        await (0, express_validator_1.check)('taskName').notEmpty().withMessage('Task name is required').run(req);
        await (0, express_validator_1.check)('interval').optional().isInt().withMessage("When must be valid number in milliseconds").run(req);
        await (0, express_validator_1.check)('taskParams').optional().isObject().withMessage('Task Params must me a valid object containing params for the task').run(req);
        // Check for validation errors
        const validationCheck = (0, express_validator_1.validationResult)(req);
        if (!validationCheck.isEmpty()) {
            return { success: false, error: validationCheck.array() };
        }
        return { success: true, message: 'VALIDATION SUCCESSFUL' };
    }
    catch (error) {
        logger_1.logger.error(`Error in validateSchedule: ${error}`);
        return { success: false, message: 'VALIDATION FAILED' };
    }
};
exports.validateSchedule = validateSchedule;
