import { Router } from 'express';
import { createTask, getMyTasks, getFeedTasks } from '../controllers/taskController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All task routes are protected
router.post('/', authMiddleware, createTask);
router.get('/my', authMiddleware, getMyTasks);
router.get('/', authMiddleware, getFeedTasks);

export default router;
