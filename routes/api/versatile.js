import express from 'express';
import versatileController from '../../controllers/versatileController.js';
const router = express.Router();

router.route('/marvel')
    .get(versatileController.getMarvelCharacters)

router.route('/geolocation')
    .post(versatileController.postGeoLocation)

router.route('/geolocation')
    .get(versatileController.getAllGeoLocations)

router.route('/geolocation/:id')
    .delete(versatileController.deleteGeoLocation);

export default router;
