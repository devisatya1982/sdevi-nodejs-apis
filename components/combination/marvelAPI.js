import { Router } from "express";

import Request from "request";
const routerEvents = Router();
const uri =
  "https://gateway.marvel.com/v1/public/characters?ts=1&apikey=a15913eec57c1465dd4ab34f0ee1f6ea&hash=517a5f46193d46ccc86698d99d07c178";

routerEvents.get("/", async (req, res) => {
  try {
    res.send("Marvels module default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

routerEvents.get("/characters", (req, res) => {
  try {
    Request.get(uri, (error, response, body) => {
      if (error) {
        res.status(500).send("Error " + error);
      }
      const responseJSON = JSON.parse(body);
      res.status(200).send(responseJSON.data.results);
    });
  } catch (err) {
    res.status(500).send("Error " + err);
  }
});

export default routerEvents;
