const express = require('express');
const helmet = require('helmet');

const packagesRouter = require('./routes/packages');
const searchRouter = require('./routes/search');

const api = express();

api.use(helmet());

api.use('/packages', packagesRouter);
api.use('/search', searchRouter);

module.exports = api;
