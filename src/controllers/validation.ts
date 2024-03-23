import {logger} from "../logger";
import { check, validationResult } from "express-validator";
import {Request} from 'express'



export const validateNotifications = async (req: Request) => {
    try {
      await check('message').notEmpty().withMessage('Message is required').run(req);

      // Check for validation errors
      const validationCheck = validationResult(req);
      if (!validationCheck.isEmpty()) {
        return { success: false, error: validationCheck.array() };
    }
  
      return { success: true, message: 'VALIDATION SUCCESSFUL' };
  } catch (error) {
      logger.error(`Error in validateNotifications: ${error}`);
      return { success: false, message: 'VALIDATION FAILED' };
    }
  };

 export const validateSchedule = async (req: Request) => {
    try {

        await check('taskName').notEmpty().withMessage('Task name is required').run(req);
        await check('interval').optional().isInt().withMessage("When must be valid number in milliseconds").run(req);
        await check('taskParams').optional().isObject().withMessage('Task Params must me a valid object containing params for the task').run(req);
      
      // Check for validation errors
      const validationCheck = validationResult(req);
      if (!validationCheck.isEmpty()) {
        return { success: false, error: validationCheck.array() };
    }
  
      return { success: true, message: 'VALIDATION SUCCESSFUL' };
    } catch (error) {
      logger.error(`Error in validateSchedule: ${error}`);
      return { success: false, message: 'VALIDATION FAILED' };

    }
  };

  
