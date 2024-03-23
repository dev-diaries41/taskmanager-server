import {z} from 'zod';

// Define the NotifyConfig schema with all objects optional
export const NOTIFY_SCHEMA = z.object({
  telegramConfig: z.object({
    telegramChannelId: z.string(),
    token: z.string(),
    options: z.object({
      polling: z.boolean().optional(),
    }).optional(),
  }).refine((data: any) => (data.token && data.telegramChannelId), {
    message: 'Invalid telegramConfig.  Token and telegramChannelId required.',
    path: ['telegramConfig'],
  }),
  discordConfig: z.object({
    webhookUrl: z.string(),
  }).optional(),
}).refine((data: any) =>  !!data.telegramConfig || !!data.discordConfig, {
  message: 'At least one of emailConfig, telegramConfig, or discordConfig must be provided.',
});


  // Schema for articles task params
  export const ARTICLES_PARAMS_SCHEMA = z.object({
    q: z.string({ invalid_type_error: 'Please enter a valid query' }),
  });
  
  // Schema for articles task params
  export const NOTIFY_PARAMS_SCHEMA = z.object({
    message: z.string({ invalid_type_error: 'Please enter a valid message' }),
    platfrom: z.string({ invalid_type_error: 'Please enter a valid message' }),
  });

  // Schema for scheduleTask params
  export const SCHEDULE_PARAMS_SCHEMA = z.object({
    taskName: z.string({ invalid_type_error: 'Please enter a valid task name' }),
    when: z.string({ invalid_type_error: 'Please enter a valid time to start the task' }).optional(),
  });



