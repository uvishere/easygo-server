"use strict";

require('dotenv').config()
const express = require('express')
require('./db/dbconfig')
const userRouter = require('./routers/user')


//Define Express configs
const app = express()
app.use(express.json())
app.use(userRouter)


// Define Port Initialization settings
const port = process.env.PORT || 3300

app.listen(port, () => {
    console.log('Server is Up on Port '+ port)
})
