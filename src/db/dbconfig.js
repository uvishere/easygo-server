"use strict";

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWD,
})