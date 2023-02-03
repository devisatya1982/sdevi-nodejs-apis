import express, { json } from "express";
import cors from "cors";
const app = express();
const port = 9000;
import sum from "./components/another-file.js";
import moment from "moment";

import mongoDBRouter from "./components/mongodb/databases.js";
import employeeRouter from "./components/mongodb/employees.js";
import userRouter from "./components/mongodb/users.js";
import emailsRouter from "./components/mongodb/emails.js";
import eventRouter from "./components/mongodb/events.js";
import marvelsRouter from "./components/combination/marvelAPI.js";
import authenticationRouter from "./components/authentication/auth-api.js";

app.use(cors());

app.get("/", async (req, res) => {
  try {
    res.send("Hello Satyanarayana Devi, this is main route default path!");
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
    res.send(
      `Hello Satya, Current Time Is ==> ${moment().format(
        "MMMM Do YYYY, h:mm:ss a"
      )}`
    );
  } catch (err) {
    res.send("Error " + err);
  }
});

app.use(json());

app.use("/mongodb", mongoDBRouter);
app.use("/auth", authenticationRouter);
app.use("/employee", employeeRouter);
app.use("/user", userRouter);
app.use("/event", eventRouter);
app.use("/email", emailsRouter);
app.use("/marvels", marvelsRouter);

app.listen(process.env.PORT || port, () => {
  console.log(
    ` Hello Satya, Express Server Is Running... at http://localhost:${port} , only on Local`
  );
});
