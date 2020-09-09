const express = require('express');
const usersRouter = require('../routes/users');
const app = express();

process.env.NODE_ENV = 'test';
require('./mongodb');

// Create the database connection
//mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.json());
app.use(usersRouter);

module.exports = app;
