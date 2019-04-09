"use strict";

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/easygo', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})