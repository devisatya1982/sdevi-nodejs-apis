import express from 'express';
const router = express.Router();
import versatileController from '../../controllers/versatileController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';

router.route('/marvel')
    .get(versatileController.getMarvelCharacters)


export default router;
