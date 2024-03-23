"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notify = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const notifications_1 = require("../../constants/notifications");
const logger_1 = require("../../logger");
const schemas_1 = require("../../constants/schemas");
class Notify extends node_telegram_bot_api_1.default {
    constructor(config) {
        const validConfig = schemas_1.NOTIFY_SCHEMA.safeParse(config);
        if (!validConfig.success) {
            throw new Error(notifications_1.NOTIFY_ERROR_MESSAGES.INVALID_CONFIGURATION + JSON.stringify(validConfig.error.errors));
        }
        const { telegramConfig, discordConfig } = config || {};
        super(telegramConfig.token, telegramConfig.options);
        this.telegramChannelId = telegramConfig?.telegramChannelId || null;
        this.discordWebhookUrl = discordConfig?.webhookUrl || '';
    }
    async telegram({ message }) {
        try {
            const result = await super.sendMessage(this.telegramChannelId, `${notifications_1.NOTEE_ALERT_TAG}\n${message}`);
            return { success: true, message: 'TELEGRAM NOTIFICATION SENT' };
        }
        catch (error) {
            logger_1.logger.error('Error sending Telegram message:', error.message);
            return { success: false, error: error.message };
        }
    }
    validateTelegramNotification({ message }) {
        if (!message) {
            return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
        }
        if (!this.telegramChannelId) {
            return { success: false, error: Notify.ERROR_MESSAGES.CHANNEL_ID_MISSING };
        }
        return { success: true, message: 'Telegram notification parameters are valid' };
    }
    validateDiscordNotifications(webhookUrl, message) {
        if (!webhookUrl) {
            return { success: false, error: Notify.ERROR_MESSAGES.INVALID_DISCORD_WEBHOOK };
        }
        if (!message) {
            return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
        }
        return { success: true, message: 'Discord notification parameters are valid' };
    }
    async discord({ message }) {
        const result = this.validateDiscordNotifications(this.discordWebhookUrl, message);
        if (!result.success) {
            console.error(result.error);
            return result;
        }
        const formatDiscordMsg = (message) => ({
            content: `${notifications_1.NOTEE_ALERT_TAG}`,
            embeds: [{ title: 'New Message', description: message }],
        });
        try {
            const { status } = await fetch(this.discordWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formatDiscordMsg(message)),
            });
            return { success: status === 204, message: status === 204 ? 'DISCORD NOTIFICATION SENT' : 'DISCORD NOTIFICATION FAILED' };
        }
        catch (error) {
            logger_1.logger.error(`Error in discord: ${error}`);
            return { success: false, error: error.message };
        }
    }
    async all({ message }) {
        try {
            const notifyPromises = [this.discord({ message }), this.telegram({ message })];
            const results = await Promise.all(notifyPromises);
            const messageSent = results.some(result => result?.success);
            return { success: messageSent, message: messageSent ? 'MESSAGE SENT' : 'MESSAGE FAILED', results: results };
        }
        catch (error) {
            logger_1.logger.error(`Error sending all messages: ${error}`);
            return { success: false, error: error.message };
        }
    }
    updateTelegramChannelId(channelId) {
        this.telegramChannelId = channelId;
    }
    updateDiscordWebhookUrl(webhookUrl) {
        this.discordWebhookUrl = webhookUrl;
    }
}
exports.Notify = Notify;
Notify.ERROR_MESSAGES = notifications_1.NOTIFY_ERROR_MESSAGES;
