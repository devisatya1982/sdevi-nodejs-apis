import express from 'express';
const router = express.Router();
import usersController from '../../controllers/usersController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';

router.route('/')
    .get(usersController.getAllUsers)
    //.get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

export default router;