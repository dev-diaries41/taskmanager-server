"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlesController = exports.notifyController = void 0;
const logger_1 = require("../logger");
const tasks_1 = require("../utils/tasks/");
const validation_1 = require("./validation");
const notifyController = async (req, res) => {
    try {
        const validationResult = await (0, validation_1.validateSchedule)(req);
        if (!validationResult.success) {
            return res.status(400).json(validationResult);
        }
        const { when, taskName, taskParams } = req.body;
        const result = await tasks_1.notifyManager.scheduleTask({ taskName, when, taskParams });
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        logger_1.logger.error(`Error in notifyController: ${error}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.notifyController = notifyController;
const articlesController = async (req, res) => {
    try {
        const validationResult = await (0, validation_1.validateSchedule)(req);
        if (!validationResult.success) {
            return res.status(400).json(validationResult);
        }
        const { when, taskName, taskParams } = req.body;
        const result = await tasks_1.articlesManager.scheduleTask({ taskName, when, taskParams });
        if (result.success) {
            res.status(200).json(result);
        }
        else {
            res.status(400).json(result);
        }
    }
    catch (error) {
        logger_1.logger.error(`Error in articlesController: ${error}`);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.articlesController = articlesController;
