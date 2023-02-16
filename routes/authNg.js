import { Router } from 'express';
const router = Router();
import { handleNgLogin } from '../controllers/authNgController.js';

router.post('/', handleNgLogin);

export default router;