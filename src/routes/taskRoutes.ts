import { Router } from 'express';
import { getTasks, addTask, updateTask, getTaskById, deleteTask } from '../controllers/taskController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken, addTask);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);
router.get('/:id', authenticateToken, getTaskById);

export default router;
