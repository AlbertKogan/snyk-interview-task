const express = require('express');

const packagesRouter = require('./routes/packages');

const api = express();

api.use('/packages', packagesRouter);

module.exports = api;
