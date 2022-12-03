import express, { json } from "express";
import cors from "cors";
const app = express();
const port = 9000;
import sum from "./another-file.js";
import moment from "moment";

app.use(cors());
app.get("/", async (req, res) => {
  try {
    res.send("Hello Satya D, this is main route default path!");
  } catch (err) {
    res.send("Error " + err);
  }
});



app.get("/sum", async (req, res) => {
  try {
    res.send(`The sum is ${sum(5, 5)}`);
  } catch (err) {
    res.send("Error " + err);
  }
});

app.get("/time", async (req, res) => {
  try {
    res.send(`Hello Satya, Current Time Is ==> ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
  } catch (err) {
    res.send("Error " + err);
  }
});

app.use(json());

app.listen(process.env.PORT || port, () => {
  console.log(
    ` Hello Satya, Express Server Is Running... at http://localhost:${port}`
  );
});