'use strict';
const mongoose = require('mongoose');
const connectString = `mongodb://127.0.0.1:27017/shopDEV`
mongoose.connect(connectString)
    .then(() => {
        console.log(`Connect Mongodb Success`)
    })
    .catch(err => {
        console.log(`Err Connect, Fail`)
    })

//dev
if (1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
}

module.exports = mongoose;

