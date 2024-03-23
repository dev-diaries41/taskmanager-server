"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEDULE_PARAMS_SCHEMA = exports.NOTIFY_PARAMS_SCHEMA = exports.ARTICLES_PARAMS_SCHEMA = exports.NOTIFY_SCHEMA = void 0;
const zod_1 = require("zod");
// Define the NotifyConfig schema with all objects optional
exports.NOTIFY_SCHEMA = zod_1.z.object({
    telegramConfig: zod_1.z.object({
        telegramChannelId: zod_1.z.string(),
        token: zod_1.z.string(),
        options: zod_1.z.object({
            polling: zod_1.z.boolean().optional(),
        }).optional(),
    }).refine((data) => (data.token && data.telegramChannelId), {
        message: 'Invalid telegramConfig.  Token and telegramChannelId required.',
        path: ['telegramConfig'],
    }),
    discordConfig: zod_1.z.object({
        webhookUrl: zod_1.z.string(),
    }).optional(),
}).refine((data) => !!data.telegramConfig || !!data.discordConfig, {
    message: 'At least one of emailConfig, telegramConfig, or discordConfig must be provided.',
});
// Schema for articles task params
exports.ARTICLES_PARAMS_SCHEMA = zod_1.z.object({
    q: zod_1.z.string({ invalid_type_error: 'Please enter a valid query' }),
});
// Schema for articles task params
exports.NOTIFY_PARAMS_SCHEMA = zod_1.z.object({
    message: zod_1.z.string({ invalid_type_error: 'Please enter a valid message' }),
    platfrom: zod_1.z.string({ invalid_type_error: 'Please enter a valid message' }),
});
// Schema for scheduleTask params
exports.SCHEDULE_PARAMS_SCHEMA = zod_1.z.object({
    taskName: zod_1.z.string({ invalid_type_error: 'Please enter a valid task name' }),
    when: zod_1.z.string({ invalid_type_error: 'Please enter a valid time to start the task' }).optional(),
});
