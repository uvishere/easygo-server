'use strict';

/* Load all the environment variables first */
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
require('./db/dbconfig');

const userRouter = require('./routers/user');
const pointRouter = require('./routers/point');

const auth = require('./middleware/auth');

//Define Express configs
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(auth, pointRouter);

// Define Port Initialization settings
const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server is Up on Port ' + port);
});
