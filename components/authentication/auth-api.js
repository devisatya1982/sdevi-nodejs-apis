import { MongoClient } from "mongodb";
import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";


const { sign } = jwt;

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

router.get("/", async (req, res) => {
  try {
    res.send("Authentication route default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/register", async (req, res) => {
  const client = new MongoClient(uri);

  const database = "satyas";
  const collection = "user";

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const userData = req.body;

    await currentCollection.insertOne(userData);

    let payload = { subject: userData.email };
    let token = sign(payload, "secretKey");
    res.status(200).send({ token });
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

router.post("/login", async (req, res) => {
  const client = new MongoClient(uri);

  const database = "satyas";
  const collection = "user";

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const userData = req.body;

    const query = { email: userData.username };
    const foundUserData = await currentCollection.findOne(query);

    if (!foundUserData) {
      res.status(401).send("Invalid Email");
    } else if (foundUserData.password !== userData.password) {
      res.status(401).send("Invalid Password");
    } else {
      let payload = { subject: foundUserData.email };
      let token = sign(payload, "secretKey");
      res.status(200).send({ token });
    }
  } catch (err) {
    res.send("Error => " + err);
  } finally {
    await client.close();
  }
});

export default router;

