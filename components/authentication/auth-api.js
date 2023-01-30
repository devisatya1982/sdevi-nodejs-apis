import { MongoClient } from "mongodb";
import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";

const { sign } = jwt;

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DATABASE = "satyas";
const TABLE = "user";

router.get("/", async (req, res) => {
  try {
    res.send("Authentication route default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

router.post("/register", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);

    const userData = req.body;
    userData._id = Date.now();
    userData.key = Date.now();
    userData.isActivated = false;

    const insertedOneUser = await currentCollection.insertOne(userData);

    insertedOneUser.acknowledged && insertedOneUser.insertedId > 0
      ? res.status(200).send(true)
      : res.status(404).send(false);
  } catch (err) {
    res.send("Error " + err);
  } finally {
    await client.close();
  }
});

router.post("/login", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);
    const userData = req.body;

    const query = { email: userData.email };
    const foundUserData = await currentCollection.findOne(query);

    if (!foundUserData) {
      res.status(401).send("Invalid Email");
    } else if (foundUserData.password !== userData.password) {
      res.status(401).send("Invalid Password");
    } else if (!foundUserData.isActivated) {
      res.status(401).send("User Must Be Activated");
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

router.post("/activate", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);
    const userData = req.body;
    const activatedKey = req.body.key;

    const query = { email: userData.email };
    const foundUserData = await currentCollection.findOne(query);

    if (!foundUserData) {
      res.status(401).send("Invalid Email");
    } else if (foundUserData.password !== userData.password) {
      res.status(401).send("Invalid Password");
    } else if (foundUserData.key !== Number(activatedKey)) {
      res.status(401).send("Key is not valid!");
    } else {
      let currentStatusSuccess = {
        message: "User Already Activated!",
        status: true,
      };

      let currentStatusNotSuccess = {
        message: "User Not Activated!",
        status: false,
      };

      if (foundUserData.isActivated) {
        res.status(200).send(currentStatusSuccess);
      } else {
        foundUserData.isActivated = true;
        const updatedOneResult = await currentCollection.updateOne(
          { _id: foundUserData._id },
          { $set: foundUserData }
        );
        currentStatusSuccess = {
          message:"User Activated",
          status: true,
        }

        res.status(200).send(updatedOneResult.modifiedCount > 0 ? currentStatusSuccess : currentStatusNotSuccess);
      }
    }
  } catch (err) {
    res.send("Error => " + err);
  } finally {
    await client.close();
  }
});

export default router;
