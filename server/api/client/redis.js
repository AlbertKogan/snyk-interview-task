const redis = require("redis");
const {promisify} = require('util');

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);

module.exports = { getAsync, redisClient };
