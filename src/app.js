
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
// const { default: helmet }= require('helmet');
const helmet = require("helmet");
const compression = require('compression');
const app = express();

// console.log(`Process:: `, process.env);

//init middlewares
app.use(morgan('dev'));
app.use(helmet())
app.use(compression())




//init router
app.use('/', require('./routes'))

//init db
require('./bds/init.mongodb');

const { checkOverload } = require('./helpers/check.connect');
//checkOverload();
//handling error


module.exports = app;

