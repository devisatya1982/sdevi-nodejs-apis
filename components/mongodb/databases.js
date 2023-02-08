import { MongoClient } from 'mongodb';
import { Router } from "express";
const router = Router();

import verifyToken from '../authentication/token-service.js';

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

router.get("/", async (req, res) => {
  try {
    res.send("Hello Satya, MongoDB route default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/databases", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const databasesList = await client.db().admin().listDatabases();
    res.send(databasesList);
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

// https://sdevi-nodejs-api.herokuapp.com/mongodb/database/<DATABASE_NAME>/collection/<COLLECTION_NAME>
// https://sdevi-nodejs-api.herokuapp.com/mongodb/database/sample_geospatial/collection/shipwrecks
router.get("/database/:dbName/collection/:colName", verifyToken, async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(req.params.dbName);
    const currentCollection = currentDatabase.collection(req.params.colName);

    const query = {};
    const options = {};

    const cursor = currentCollection.find(query, options); // Satya : Use query, options properly.
    const results = await cursor.toArray();

    res.send(results);
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/mongodb/database/satyas/collection/employee
// {
//   "name":"Chapel",
//   "phone": 67890906781
// }
router.post("/database/:dbName/collection/:colName", verifyToken, async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(req.params.dbName);
    const currentCollection = currentDatabase.collection(req.params.colName);
    const newEmployee = req.body;

    const result = await currentCollection.insertOne(newEmployee);

    res.send(result.insertedId);
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/mongodb/database/satyas/collection/employee
// {
//   "name":"Chapel",
//   "phone": "1236547007"
// }
router.patch("/database/:dbName/collection/:colName", verifyToken, async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(req.params.dbName);
    const currentCollection = currentDatabase.collection(req.params.colName);
    const currentBody = req.body;

    const result = await currentCollection.updateOne(
      { name: currentBody.name },
      { $set: currentBody }
    );

    res.send(
      result.modifiedCount > 0
        ? `${currentBody.name} details have been updated successfully!`
        : `No records found with the ${currentBody.name} !`
    );
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/mongodb/database/satyas/collection/employee
// {
//   "name":"Sangakkara"
// }
router.delete("/database/:dbName/collection/:colName", verifyToken, async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(req.params.dbName);
    const currentCollection = currentDatabase.collection(req.params.colName);
    const currentBody = req.body;

    const result = await currentCollection.deleteOne(
      { name: currentBody.name }
    );

    res.send(
      result.deletedCount > 0
        ? `${currentBody.name} details have been removed successfully!`
        : `No records found with the ${currentBody.name} !`
    );
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

export default router;
