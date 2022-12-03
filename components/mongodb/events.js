import { MongoClient } from "mongodb";
import { Router } from "express";
const routerEvents = Router();

import verifyToken from "../authentication/token-service.js";
// import { ObjectId } from "mongodb/lib/bson";

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

routerEvents.get("/", async (req, res) => {
  try {
    res.send("Events module default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

routerEvents.get("/events", verifyToken, async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "event";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);

    const query = {};
    const options = {};

    const cursor = currentCollection.find(query, options); // Satya : Use query, options properly.
    const results = await cursor.toArray();

    res.status(200).send(results);
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/mongodb/database/satyas/collection/event
// {
//   "name":"Chapel",
//   "phone": 67890906781
// }
routerEvents.post("/events", verifyToken, async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "event";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const newEvent = req.body;

    const result = await currentCollection.insertOne(newEvent);

    // * Set the response HTTP status code to `statusCode` and send its string representation as the response body.
    // * @link http://expressjs.com/4x/api.html#res.sendStatus
    // *
    // * Examples:
    // *
    // *    res.sendStatus(200); // equivalent to res.status(200).send('OK')
    // *    res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
    // *    res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
    // *    res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
    // *
    if (result.acknowledged) {
      res.status(200).send(newEvent);
    } else {
      res.status(500).send('Internal Server Error while creating new event!');
    }
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/mongodb/database/satyas/collection/event
// {
//   "name":"Chapel",
//   "phone": "1236547007"
// }
routerEvents.patch("/events", verifyToken, async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "event";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const currentBody = req.body;

    //  TODO : Update must be happen based _id rather than name.
    const result = await currentCollection.updateOne(
      { eventId: currentBody.eventId },
      { $set: currentBody }
    );

    result.modifiedCount > 0 ? res.status(200).send(currentBody) : res.sendStatus(404);
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/mongodb/database/satyas/collection/event
// {
//   "name":"Sangakkara"
// }
routerEvents.delete("/events", verifyToken, async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "event";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const currentBody = req.body;

    const result = await currentCollection.deleteOne({
      eventId: currentBody.eventId,
    });

    result.deletedCount > 0 ? res.status(200).send(currentBody) : res.sendStatus(404);
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

export default routerEvents;
