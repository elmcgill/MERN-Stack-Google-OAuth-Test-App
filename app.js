const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('');

const app = express();

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//routes
app.use('/users', require('./routes/users'));

//start the server
const port = process.env.PORT || 5000;

app.listen(port);

console.log(`Server listening at ${port}`);