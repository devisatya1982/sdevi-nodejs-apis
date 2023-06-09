import express, { json } from "express";
import cors from "cors";
const app = express();
import dotenv from 'dotenv';
dotenv.config();

import {join, dirname} from 'path';

import corsOptions from "./config/corsOptions.js"
import { logger } from "./middleware/logEvents.js"
import errorHandler from "./middleware/errorHandler.js"
import verifyJWT from "./middleware/verifyJWT.js"
import cookieParser from "cookie-parser"
import credentials from "./middleware/credentials.js"
import mongoose from "mongoose"
import connectDB from "./config/dbConn.js"
const PORT = process.env.PORT;

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
import authNgRouter from './routes/authNg.js';
import refreshRouter from './routes/refresh.js';
import logoutRouter from './routes/logout.js';
import employeesRouter from './routes/api/employees.js';
import eventsRouter from './routes/api/events.js';
import usersRouter from './routes/api/users.js';
import shoppingRouter from './routes/api/shopping.js';
import versatileRouter from './routes/api/versatile.js';
import geoLocationRouter from './routes/api/geoLocation.js';

import stripeRouter from './routes/api/stripePayment.js';

// routes
app.use('/', rootRouter);
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/authNg', authNgRouter);

app.use('/shopping', shoppingRouter);
app.use('/payment', stripeRouter);
app.use('/refresh', refreshRouter);
app.use('/geoLocation', geoLocationRouter);
app.use('/logout', logoutRouter);


app.use(verifyJWT);
app.use('/employees', employeesRouter);
app.use('/events', eventsRouter);
app.use('/users', usersRouter);
app.use('/versatile', versatileRouter);

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
  console.log(`Connected to MongoDB && Environment is => ${process.env.NODE_ENV?.toLocaleLowerCase().trim()}`);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});