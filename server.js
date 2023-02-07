import express, { json } from "express";
import cors from "cors";
const app = express();

import {join, dirname} from 'path';
import moment from "moment";

// import mongoDBRouter from "./components/mongodb/databases.js";
// import employeeRouter from "./components/mongodb/employees.js";
// import userRouter from "./components/mongodb/users.js";
// import emailsRouter from "./components/mongodb/emails.js";
// import eventRouter from "./components/mongodb/events.js";
// import marvelsRouter from "./components/combination/marvelAPI.js";
// import authenticationRouter from "./components/authentication/auth-api.js";

import corsOptions from "./config/corsOptions.js"
import { logger } from "./middleware/logEvents.js"
import errorHandler from "./middleware/errorHandler.js"
import verifyJWT from "./middleware/verifyJWT.js"
import cookieParser from "cookie-parser"
import credentials from "./middleware/credentials.js"
import mongoose from "mongoose"
import connectDB from "./config/dbConn.js"
const PORT = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(join(process.cwd(), '/public')));

import rootRouter from './routes/root.js';
import registerRouter from './routes/register.js';
import authRouter from './routes/auth.js';
import refreshRouter from './routes/refresh.js';
import logoutRouter from './routes/logout.js';
import employeesRouter from './routes/api/employees.js';
import usersRouter from './routes/api/users.js';

// routes
app.use('/', rootRouter);
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh', refreshRouter);
app.use('/logout', logoutRouter);

app.use(verifyJWT);
app.use('/employees', employeesRouter);
app.use('/users', usersRouter);


// app.use(json());

// app.use("/mongodb", mongoDBRouter);
// // app.use("/auth", authenticationRouter);
// app.use("/employee", employeeRouter);
// app.use("/user", userRouter);
// app.use("/event", eventRouter);
// app.use("/email", emailsRouter);
// app.use("/marvels", marvelsRouter);



app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
     res.sendFile(join(process.cwd(), 'views', '404.html'));
  } else if (req.accepts('json')) {
      res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});