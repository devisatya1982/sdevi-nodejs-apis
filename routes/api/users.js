import express from 'express';
const router = express.Router();
import usersController from '../../controllers/usersController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.addUser)
    .patch(usersController.updateUser)
router.route('/:id')
    .delete(usersController.deleteUser);
export default router;