const express = require('express');

const { isPackageValid } = require('../lib/package-processing');
const { getPackagesAll } = require('../controller/packages');

const { getAsync, redisClient } = require('../client/redis');


const router = express.Router();


router.post('/', function (req, res, next) {
  const data = req.body || {};
  const isPackageNameValid = isPackageValid(data.name);

  if (isPackageNameValid) {
    getAsync(data.name).then((cachedData) => {
      if (cachedData) {
        console.log('from cache');
        res.json({ status: 'ok', data: JSON.parse(cachedData) });

        return;
      }
      getPackagesAll(data.name).then((parsedData) => {
        redisClient.set(data.name, JSON.stringify(parsedData));
        res.json({ status: 'ok', data: parsedData });
      }).catch(error => {
        console.log('ERROR', error.message);
        res.json({status: 'fail'});
      });
    });
  } else {
    res.json({status: 'fail'});
  }
});

module.exports = router;
