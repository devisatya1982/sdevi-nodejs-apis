import express from 'express';
import shoppingController from '../../controllers/shoppingController.js';
const router = express.Router();

router.route('/')
    .get(shoppingController.getCartItems)
   
export default router;
