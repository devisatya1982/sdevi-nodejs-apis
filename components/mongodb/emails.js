import { MongoClient } from "mongodb";
import { Router } from "express";
import { createTransport } from 'nodemailer';

const router = Router();

// import verifyToken from "../authentication/token-service";

const uri =
  "mongodb+srv://sdevi:test@sdevicluster.wtwtl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// http://localhost:9000/emails
router.get("/", async (req, res) => {
  try {
    res.send("Email module default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});

router.get("/emails", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "emails";
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
router.post("/emails", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "emails";

  try {
    await client.connect();

    // TODO : Validations
    // const currentDatabase = client.db(database);
    // const currentCollection = currentDatabase.collection(collection);


    let transporter = createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: false,
      auth: {
        user: 'devisatya1982@gmail.com',
        pass: 'mkdeavmkjgclgrya'
      }
    });
    
    let mailOptions = {
      from: 'devisatya1982@gmail.com',
      to: 'admin@aahvaanadevelopers.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
   await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
       // console.log(error);
        res.status(200).send(`Error has been generated! ==> ${error}`);
      } else {
      //  console.log('Email sent: ' + info.response);
        res.status(200).send(`New Email has been sent! ==> ${info.response}`);
      }
    });




    // const newEmployee = req.body;

    // const result = await currentCollection.insertOne(newEmployee);

    // res.status(200).send('');
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
router.patch("/emails", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "emails";
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

    res.status(200).send(
      result.modifiedCount > 0
        ? true
        : false
    );

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
router.delete("/emails", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas"; 
  const collection = "emails";
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

    result.deletedCount > 0 ? res.status(200).send(currentBody) : res.sendStatus(404);

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

router.get("/emails/:emailId", async (req, res) => {
  const client = new MongoClient(uri);
  const database = "satyas";
  const collection = "emails";
  try {
    await client.connect();

    // TODO : Validations
    const currentDatabase = client.db(database);
    const currentCollection = currentDatabase.collection(collection);
    const currentEmployeeId = req.params.employeeId;

    const result = await currentCollection.findOne({
      employeeId: currentEmployeeId,
    });

    res.status(200).send(
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
