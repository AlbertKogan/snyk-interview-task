const client = require('../client/npm-registry');
const {pipe, propOr, map, path} = require('ramda');

const searchPackages = async ({ value }) =>
  pipe(
    propOr([], 'objects'),
    map(path(['package', 'name']))
  )(await client.search({ value }));

module.exports = { searchPackages };
