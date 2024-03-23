"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedis = exports.articlesManager = exports.notifyManager = exports.notify = void 0;
const notifications_1 = require("../../constants/notifications");
const taskManager_1 = require("./taskManager");
const articles_1 = require("./articles");
const notify_1 = require("./notify");
const redis_1 = require("../../constants/redis");
exports.notify = new notify_1.Notify(notifications_1.NOTIFICATIONS_CONFIG);
// Create a new instance of Task Manager for each tasks for modularity and scalability
exports.notifyManager = new taskManager_1.TaskManager('notify', async ({ message }) => await exports.notify.all({ message }), redis_1.redisConfig);
exports.articlesManager = new taskManager_1.TaskManager('articles', async ({ q }) => await (0, articles_1.findArticlesTask)({ q }), redis_1.redisConfig);
// Both instances using the same connection so only necessary to call the closeRedisConnection
// on one of the instances
async function closeRedis() {
    try {
        await exports.articlesManager.closeRedisConnection();
        console.log('Redis connections closed successfully');
    }
    catch (error) {
        console.error('Error closing Redis connections:', error);
    }
}
exports.closeRedis = closeRedis;
