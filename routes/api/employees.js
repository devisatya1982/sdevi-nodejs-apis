import express from 'express';
const router = express.Router();
import employeesController from '../../controllers/employeesController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    // .delete(employeesController.deleteEmployee);

router.route('/:id')
    .delete(employeesController.deleteEmployee);

export default router;


// .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
// .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
// .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);
