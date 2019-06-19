const express = require('express');

const packagesRouter = require('./routes/packages');
const searchRouter = require('./routes/search');

const api = express();

api.use('/packages', packagesRouter);
api.use('/search', searchRouter);

module.exports = api;
