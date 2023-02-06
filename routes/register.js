import { Router } from 'express';
const router = Router();
import { handleNewUser } from '../controllers/registerController.js';

router.post('/', handleNewUser);

export default router;