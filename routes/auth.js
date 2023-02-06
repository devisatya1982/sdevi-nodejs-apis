import { Router } from 'express';
const router = Router();
import { handleLogin } from '../controllers/authController.js';

router.post('/', handleLogin);

export default router;