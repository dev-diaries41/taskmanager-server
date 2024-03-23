import express from 'express';
import { articlesController } from '../controllers/taskController';

const router = express.Router();

router.post('/', articlesController);

export default router;
