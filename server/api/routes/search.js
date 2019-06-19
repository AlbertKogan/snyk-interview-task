const express = require('express');

const { searchPackages } = require('../controller/search');


const router = express.Router();


router.post('/', function (req, res, next) {
  const data = req.body || {};

  try {
    searchPackages({ value: data.name }).then((parsedData) => {
      res.json({ status: 'ok', data: parsedData });
    }).catch(() => {
      res.json({ status: 'fail' });
    })
  } catch (e) {
    res.json({ status: 'fail' });
  }
});

module.exports = router;

