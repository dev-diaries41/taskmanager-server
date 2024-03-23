import express from 'express';
import { notifyController } from '../controllers/taskController';

const router = express.Router();

router.post('/', notifyController);

export default router;
