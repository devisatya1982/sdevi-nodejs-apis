import { MongoClient } from "mongodb";
import { Router } from "express";
import bcrypt from "bcrypt";
const router = Router();

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const DATABASE = "satyas";
const TABLE = "user";

let response = {
  message: "",
  status: false,
  user: {
    email: "",
    name: "",
    role: "",
  },
};

router.get("/", async (req, res) => {
  try {
    res.send("Users module default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);

    const query = {};
    const options = {};

    const cursor = currentCollection.find(query, options);
    const results = await cursor.toArray();

    res.status(200).send(results);
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

router.post("/users", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);
    const newUser = req.body;
    newUser._id = Date.now();
    newUser.key = Date.now() + 9999999;

    const query = { email: newUser.email };
    const foundUserData = await currentCollection.findOne(query);
    if (foundUserData) {
      let response = {
        message: `Email : ${foundUserData.email} already exists`,
        status: false,
        user: {},
      };
      res.status(401).send(response);
    } else {
      //#region Encrypt Password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newUser.password, salt);
      newUser.password = hashedPassword;

      //#endregion

      const insertOneResult = await currentCollection.insertOne(newUser);
     // const insertOneResult= {};

      if (insertOneResult.acknowledged && insertOneResult.insertedId > 0) {
        response = {
          message: "New User Created Successfully!",
          status: true,
          user: {
            email: newUser.email,
            name: newUser.firstName + " " + newUser.lastName,
            role: newUser.roles,
          },
        };

        res.status(200).send(response);
      } else {
        response = {
          message: "New User Not Created!",
          status: false,
          user: {},
        };
        res.status(204).send(response);
      }
    }
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

router.patch("/users", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);
    const currentBody = req.body;

    const updatedOneResult = await currentCollection.updateOne(
      { _id: currentBody._id },
      { $set: currentBody }
    );

    if (updatedOneResult.acknowledged && updatedOneResult.modifiedCount > 0) {
      response = {
        message: "User Modified Successfully!",
        status: true,
        user: {
          email: currentBody.email,
          name: currentBody.firstName + " " + currentBody.lastName,
          roles: currentBody.roles,
        },
      };

      res.status(200).send(response);
    } else {
      response = {
        message: "User Not Modified!",
        status: false,
        user: {},
      };
      res.status(404).send(response);
    }
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

router.delete("/users/:_id", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);

    const currentEmployeeId = Number(req.params._id);

    const result = await currentCollection.deleteOne({
      _id: currentEmployeeId,
    });

    if (result.acknowledged && result.deletedCount > 0) {
      response = {
        message: `User : ${currentEmployeeId} Removed Successfully!`,
        status: true,
        user: {},
      };

      res.status(200).send(response);
    } else {
      response = {
        message: `User : ${currentEmployeeId} Not Removed!`,
        status: false,
        user: {},
      };
      res.status(404).send(response);
    }
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

export default router;
