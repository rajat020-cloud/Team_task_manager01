import { Router } from 'express';
import { getUsers } from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', getUsers);

export default router;
