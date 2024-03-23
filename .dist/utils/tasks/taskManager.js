"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const logger_1 = require("../../logger");
const ioredis_1 = require("ioredis");
const bullmq_1 = require("bullmq");
// Handle errors in scheduled tasks
function handleErrors(error) {
    logger_1.logger.error(`Error in scheduleService: ${error}`);
    return { success: false, error: error.message };
}
class TaskManager {
    constructor(taskName, task, redisConfig) {
        this.redis = new ioredis_1.Redis(redisConfig);
        this.queue = new bullmq_1.Queue(taskName, { connection: this.redis });
        this.worker = new bullmq_1.Worker(taskName, async (job) => {
            task(job.data);
        }, { connection: this.redis });
        this._startWorkers();
    }
    async _addNewTask(taskName, taskParams, when) {
        const startTime = when - Date.now();
        const delay = startTime > 0 ? startTime : 0; // if when is not greater than start time execute straight away
        const job = await this.queue.add(`${taskName}`, taskParams, {
            delay: delay,
            attempts: 2,
            removeOnComplete: true,
            removeOnFail: {
                age: 1 * 3600,
            }
        });
    }
    async scheduleTask(scheduleOptions) {
        const { taskName, when, taskParams } = scheduleOptions || {};
        try {
            await this._addNewTask(taskName, taskParams, when);
            logger_1.taskLogger.info(`'${taskName}' task scheduled successfully`);
            return { success: true, message: `'${taskName}' task scheduled successfully` };
        }
        catch (error) {
            return handleErrors(error);
        }
    }
    _startWorkers() {
        this.worker.on('completed', (job) => {
            logger_1.taskLogger.info(`Completed job ${job.id}`);
        });
        this.worker.on('failed', (job, err) => {
            logger_1.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
        });
    }
    async closeRedisConnection() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
}
exports.TaskManager = TaskManager;
