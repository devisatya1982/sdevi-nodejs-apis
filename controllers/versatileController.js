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

export default {
  getMarvelCharacters
};
