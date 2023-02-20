import Request from "request";

import GeoLocation from "../model/GeoLocation.js";

const getMarvelCharacters = async (req, res) => {
  const uri = process.env.MARVEL_API;
  try {
    await Request.get(uri, (error, response, body) => {
      if (error) {
        return res.status(500).send("Error " + error);
      }
      const responseJSON = JSON.parse(body);
      return res.status(200).send(responseJSON.data.results);
    });
  } catch (err) {
    res.status(500).send("Error " + err);
  }
};

const postGeoLocation = async (req, res) => {
  const geoLocation = req.body;

  try {
    if (geoLocation?.address) {
      const result = await GeoLocation.create({
        address: geoLocation.address,
        timeStamp: geoLocation.timeStamp,
      });

      res
        .status(201)
        .json({
          message: `New GeoLocation ${JSON.stringify(result)} created!`,
        });
    }
  } catch (err) {
    res.status(500).send("Error " + err);
  }
};

const getAllGeoLocations = async (req, res) => {

  try {
    const geoLocations = await GeoLocation.find().exec();
    if (!geoLocations) return res.status(204).json({ message: "No geo locations found" });
    res.json(geoLocations);
  } catch (err) {
    res.status(500).send("Error " + err);
  }
};

const deleteGeoLocation = async (req, res) => {
  try {
      const geoLocationId = req?.params?.id;

      if (!geoLocationId) return res.status(400).json({ "message": 'Geo Location ID required' });
  
      const geoLocation = await GeoLocation.findOne({ _id: geoLocationId }).exec();
  
      if (!geoLocation) {
          return res.status(204).json({ 'message': `Geo Location ID ${geoLocationId} not found` });
      }
  
      const result = await geoLocation.deleteOne({ _id: geoLocationId });
      res.json(result);
      
  } catch (error) {
      res.status(500).send("Error " + error);
  }   
}

export default {
  getMarvelCharacters,
  postGeoLocation,
  getAllGeoLocations,
  deleteGeoLocation
};
