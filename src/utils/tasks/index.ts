import { NOTIFICATIONS_CONFIG } from "../../constants/notifications";
import { TaskManager } from "./taskManager";
import { findArticlesTask } from "./articles";
import { Notify } from "./notify";
import { redisConfig } from "../../constants/redis";

export const notify = new Notify(NOTIFICATIONS_CONFIG)

// Create a new instance of Task Manager for each tasks for modularity and scalability
export const notifyManager = new TaskManager('notify', async({message}: {message:string}) => await notify.all({message}), redisConfig);
export const articlesManager = new TaskManager('articles', async({q}: {q:string}) => await findArticlesTask({q}), redisConfig);

// Both instances using the same connection so only necessary to call the closeRedisConnection
// on one of the instances
export async function closeRedis() {
    try {
        await articlesManager.closeRedisConnection();
        console.log('Redis connections closed successfully');
    } catch (error) {
        console.error('Error closing Redis connections:', error);
    }
}
