import { Router } from 'express';
const router = Router();
import { handleRefreshToken } from '../controllers/refreshTokenController.js';

router.get('/', handleRefreshToken);

export default router;