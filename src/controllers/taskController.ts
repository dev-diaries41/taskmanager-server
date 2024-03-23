import { Request, Response } from "express";
import { logger} from "../logger";
import { notifyManager, articlesManager } from "../utils/tasks/";
import { validateSchedule } from "./validation";

const notifyController = async (req: Request, res: Response) => {
  try {
    const validationResult = await validateSchedule(req);

    if (!validationResult.success) {
      return res.status(400).json(validationResult);
    }

    const { when, taskName, taskParams } = req.body;
    const result = await notifyManager.scheduleTask({taskName,when,taskParams});

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
        
  } catch (error) {
    logger.error(`Error in notifyController: ${error}`);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const articlesController = async (req: Request, res: Response) => {
  try {
    const validationResult = await validateSchedule(req);

    if (!validationResult.success) {
      return res.status(400).json(validationResult);
    }

    const { when, taskName, taskParams } = req.body;
    const result = await articlesManager.scheduleTask({taskName,when,taskParams});

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
        
  } catch (error) {
    logger.error(`Error in articlesController: ${error}`);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



export {notifyController, articlesController};
