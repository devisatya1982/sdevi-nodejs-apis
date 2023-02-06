import { Router } from 'express';
const router = Router();
import { join } from 'path';

router.get('^/$|/index(.html)?', (req, res) => {   
   res.sendFile(join(process.cwd(), 'views', 'index.html'));
});

export default router;