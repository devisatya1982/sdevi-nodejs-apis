import { Router } from 'express';
const router = Router();
import { handleLogin } from '../controllers/authController.js';
import {handleActivate} from '../controllers/activateController.js'

router.post('/', handleLogin);
router.post('/activate', handleActivate);

export default router;