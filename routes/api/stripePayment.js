import express from 'express';
const router = express.Router();
import stripeController from '../../controllers/stripeController.js';

router.route('/')
    .post(stripeController.createStripePayment)

export default router;
