import express from 'express';
import geoLocationController from '../../controllers/geoLocationController.js';
const router = express.Router();

router.route('/')
    .get(geoLocationController.getAllGeoLocations)
    .post(geoLocationController.postGeoLocation)

router.route('/:id')
    .delete(geoLocationController.deleteGeoLocation);

export default router;
