import express from 'express';
import versatileController from '../../controllers/versatileController.js';
const router = express.Router();

router.route('/marvel')
    .get(versatileController.getMarvelCharacters)

export default router;
