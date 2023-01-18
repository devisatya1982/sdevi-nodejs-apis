import  { MongoClient } from "mongodb";
import  { Router } from "express";
const router = Router();

// import verifyToken from "../authentication/token-service";

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
  const database = "satyas";
  const collection = "employee";
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
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/employee/employees
// {
//   "employeeId":"10006",
//   "employeeName": "Jadeja",
//   "employeeSal": "111116"
// }
router.post("/employees", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "employee";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const newEmployee = req.body;

    const result = await currentCollection.insertOne(newEmployee);

    res.status(200).send(newEmployee);
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/employee/employees
// {
//   "employeeId":"10006",
//   "employeeName": "Jadeja updated",
//   "employeeSal": "1111160000"
// }
router.patch("/employees", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "employee";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const currentBody = req.body;

    //  TODO : Update must be happen based _id rather than name.
    const result = await currentCollection.updateOne(
      { employeeId: currentBody.employeeId },
      { $set: currentBody }
    );

    res.status(200).send(result.modifiedCount > 0 ? true : false);

    // res.status(200).send(
    //   result.modifiedCount > 0
    //     ? `${currentBody.employeeId} details have been updated successfully!`
    //     : `No records found with the ${currentBody.employeeId} !`
    // );
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

// http://localhost:9000/employee/employees/10006
// router.delete("/employees/:employeeId", verifyToken, async (req, res) => {
router.delete("/employees", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "employee";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);

    // const currentEmployeeId = req.params.employeeId;

    const currentBody = req.body;
    const result = await currentCollection.deleteOne({
      employeeId: currentBody.employeeId,
    });

    result.deletedCount > 0
      ? res.status(200).send(currentBody)
      : res.sendStatus(404);

    // res.status(200).send(
    //   result.deletedCount > 0
    //     ? `${currentBody.employeeId} details have been removed successfully!`
    //     : `No records found with the ${currentBody.employeeId} !`
    // );
  } catch (err) {
    res.status(500).send("Error " + err);
  } finally {
    await client.close();
  }
});

router.get("/employees/:employeeId", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "employee";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const currentEmployeeId = Number(req.params.employeeId);

    const result = await currentCollection.findOne({
      employeeId: currentEmployeeId,
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
