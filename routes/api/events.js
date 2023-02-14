import express from 'express';
const router = express.Router();
import eventsController from '../../controllers/eventsController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';

router.route('/')
    .get(eventsController.getAllEvents)
    .post(eventsController.createNewEvent)
    .patch(eventsController.updateEvent)

    router.route('/:id')
    .delete(eventsController.deleteEvent);

export default router;