import { MongoClient } from "mongodb";
import { Router } from "express";
const router = Router();

// import verifyToken from "../authentication/token-service";

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const DATABASE = "satyas";
const TABLE = "employee";

// http://localhost:9000/employee
router.get("/", async (req, res) => {
  try {
    res.send("Employees module default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/employees", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);

    const query = {};
    const options = {};

    const cursor = currentCollection.find(query, options); // Satya : Use query, options properly.
    const results = await cursor.toArray();

    res.status(200).send(results);
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/employee/employees
// {
//   "_id":"10006",
//   "employeeName": "Jadeja",
//   "employeeSal": "111116"
// }
router.post("/employees", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);
    const newEmployee = req.body;
    newEmployee._id = Date.now();
    delete newEmployee.employeeId;

    const insertOneResult = await currentCollection.insertOne(newEmployee);

    insertOneResult.acknowledged && insertOneResult.insertedId > 0
      ? res.status(200).send(true)
      : res.status(204).send(false);
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/employee/employees
// {
//   "_id":"10006",
//   "employeeName": "Jadeja updated",
//   "employeeSal": "1111160000"
// }
router.patch("/employees", async (req, res) => {
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

    res.status(200).send(updatedOneResult.modifiedCount > 0 ? true : false);
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/employee/employees/10006
// router.delete("/employees/:employeeId", verifyToken, async (req, res) => {
router.delete("/employees/:_id", async (req, res) => {
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

    result.acknowledged && result.deletedCount > 0
      ? res.status(200).send(true)
      : res.status(404).send(false);
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// This end point mostly not using at this time i.e. 30 Jan 2023
router.get("/employees/:_id", async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(DATABASE);
    const currentCollection = currentDatabase.collection(TABLE);
    const currentEmployeeId = Number(req.params._id);

    const result = await currentCollection.findOne({
      _id: currentEmployeeId,
    });

    res
      .status(200)
      .send(
        result === null
          ? `No records found with the ${currentEmployeeId} !`
          : result
      );
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

export default router;
