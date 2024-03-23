import { logger, taskLogger } from "../../logger";
import { TaskManagerOptions, TaskName } from "../../constants/types";
import { Redis, RedisOptions } from "ioredis";
import { Queue, Worker } from "bullmq";

// Handle errors in scheduled tasks
function handleErrors(error: any) {
    logger.error(`Error in scheduleService: ${error}`);
    return { success: false, error: error.message };
}

class TaskManager {
    private redis: Redis;
    private queue: Queue;
    private worker: Worker;

    constructor(taskName: TaskName, task: Function, redisConfig: RedisOptions ) {
        this.redis = new Redis(redisConfig);
        this.queue = new Queue(taskName, {connection: this.redis})
        this.worker = new Worker(taskName, async (job) => {
        task(job.data);
        }, {connection: this.redis});
        this._startWorkers();

    }

    private async _addNewTask(taskName: TaskName, taskParams: Record<string, any>, when: number) {
        const startTime = when - Date.now();
        const delay = startTime > 0? startTime : 0; // if when is not greater than start time execute straight away
        const job = await this.queue.add(`${taskName}`, taskParams, {
            delay: delay,
            attempts:2, 
            removeOnComplete:true, 
            removeOnFail: {
            age: 1 * 3600,
            }});
    }

    async scheduleTask(scheduleOptions: TaskManagerOptions) {
        const { taskName, when, taskParams } = scheduleOptions || {};
        try {
            await this._addNewTask(taskName, taskParams, when);
            taskLogger.info(`'${taskName}' task scheduled successfully`);
            return { success: true, message: `'${taskName}' task scheduled successfully`};
        }catch (error) {
            return handleErrors(error);
        }
    }

    private _startWorkers(){
        this.worker.on('completed', (job) => {
            taskLogger.info(`Completed job ${job.id}`);
         });
        this.worker.on('failed', (job, err) => {
            logger.error(`Job ${job?.id} failed with error: ${err.message}`);
        });
    }

    async closeRedisConnection() {
        if (this.redis) {
            await this.redis.quit();
        }
    }
}

export { TaskManager };
