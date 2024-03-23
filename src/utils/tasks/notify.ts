import TelegramBot from 'node-telegram-bot-api';
import { NOTIFY_ERROR_MESSAGES, NOTEE_ALERT_TAG } from '../../constants/notifications';
import { logger} from '../../logger';
import { NOTIFY_SCHEMA } from '../../constants/schemas';
import { NotifyConfig } from '../../constants/types';

class Notify extends TelegramBot {
  static ERROR_MESSAGES = NOTIFY_ERROR_MESSAGES;

  private telegramChannelId: string | null;
  private discordWebhookUrl: string;

  constructor(config: NotifyConfig) {
    const validConfig = NOTIFY_SCHEMA.safeParse(config);
    if (!validConfig.success) {
      throw new Error(NOTIFY_ERROR_MESSAGES.INVALID_CONFIGURATION + JSON.stringify(validConfig.error.errors));
    }
    const { telegramConfig, discordConfig } = config || {};
    super(telegramConfig.token, telegramConfig.options);
    this.telegramChannelId = telegramConfig?.telegramChannelId || null;
    this.discordWebhookUrl = discordConfig?.webhookUrl || '';
  }

  async telegram({message}: {message: string}) {
    try {
      const result = await super.sendMessage(this.telegramChannelId!, `${NOTEE_ALERT_TAG}\n${message}`);
      return { success: true, message: 'TELEGRAM NOTIFICATION SENT' };
    } catch (error:any) {
      logger.error('Error sending Telegram message:', error.message);
      return { success: false, error: error.message };
    }
  }

  validateTelegramNotification({message}: {message: string}) {
    if (!message) {
      return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
    }
    if (!this.telegramChannelId) {
      return { success: false, error: Notify.ERROR_MESSAGES.CHANNEL_ID_MISSING };
    }
    return { success: true, message: 'Telegram notification parameters are valid' };
  }

  validateDiscordNotifications(webhookUrl: string, message: string) {
    if (!webhookUrl) {
      return { success: false, error: Notify.ERROR_MESSAGES.INVALID_DISCORD_WEBHOOK };
    }
    if (!message) {
      return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
    }
    return { success: true, message: 'Discord notification parameters are valid' };
  }

  async discord({message}: {message: string}) {
    const result = this.validateDiscordNotifications(this.discordWebhookUrl, message);

    if (!result.success) {
      console.error(result.error);
      return result;
    }

    const formatDiscordMsg = (message: string) => ({
      content: `${NOTEE_ALERT_TAG}`,
      embeds: [{ title: 'New Message', description: message }],
    });

    try {
      const { status } = await fetch(this.discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatDiscordMsg(message)),
      });

      return { success: status === 204, message: status === 204 ? 'DISCORD NOTIFICATION SENT' : 'DISCORD NOTIFICATION FAILED' };
    } catch (error:any) {
      logger.error(`Error in discord: ${error}`);
      return { success: false, error: error.message };
    }
  }

  async all({message}: {message: string}) {
    try {
      const notifyPromises = [this.discord({message}), this.telegram({message})];
      const results = await Promise.all(notifyPromises);
      const messageSent = results.some(result => result?.success);
      return { success: messageSent, message: messageSent ? 'MESSAGE SENT' : 'MESSAGE FAILED', results: results };
    } catch (error:any) {
      logger.error(`Error sending all messages: ${error}`);
      return { success: false, error: error.message };
    }
  }

  updateTelegramChannelId(channelId: string) {
    this.telegramChannelId = channelId;
  }

  updateDiscordWebhookUrl(webhookUrl: string) {
    this.discordWebhookUrl = webhookUrl;
  }
}

export { Notify };
