import { z } from "zod";
import { NOTIFY_PARAMS_SCHEMA } from "./schemas";

export interface FetchedArticle {
    url:  string;
    title: string;
    pubDate: string;
    source: string;
    summary: string;
};

export interface NotifyConfig {
    telegramConfig: {
      token: string;
      options: { polling?: boolean };
      telegramChannelId: string;
    };
    discordConfig?: {
      webhookUrl: string;
    };
  }

export interface ScheduleTaskErrors {
  readonly CONFIG_ERROR: 'CONFIG_ERROR: check your configuration is correct';
  readonly INVALID_TASK_NAME_ERROR: 'INVALID_TASK_NAME_ERROR';
  readonly ALREADY_IN_PROGRESS_ERROR: 'ALREADY_IN_PROGRESS_ERROR';
  readonly CONSECUTIVE_TASK_FAILURES_ERROR:
    'CONSECUTIVE_TASK_FAILURES_ERROR: Task stopped due to two consecutive errors';
}

export type NotifyConfigType = z.TypeOf<typeof NOTIFY_PARAMS_SCHEMA>;

export type TaskName = "notify" | "articles";

export interface TaskManagerOptions { 
  taskName: TaskName;
  when: number; 
  taskParams: Record<string, any>;
}