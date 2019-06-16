const express = require('express');

const {
  isPackageValid,
  getNameAndVersion,
  extractDependencies,
  resolveDependency
} = require('../lib/package-processing');
const NPMRegistryClient = require('../client/npm-registry');


const router = express.Router();
const client = new NPMRegistryClient();

/*
* {
*   "react": {
*     "version": "16.0.0",
*     "dependencies": {
*       "loose-envify": {
*         "verision": "1.1.1",
*       },
*       "another: {
*         "version": "1.1.1",
*         "dependencies": {
*           "yetAnother": {
*             "version": "0.0.1"
*           }
*         }
*       }
*     }
*   }
* }
* */
// TODO: fix nesting. currently only one nested
const getPackagesDeep = async ({name, version}) => {
  const packageData = await client.getPackageDataExactVersion({name, version}); // package.json
  const dependencies = extractDependencies(packageData); // [{ name: 'object-assign', version: "^0.0.1" }]
  const packagesNames = dependencies.map(({name}) => name); // ['react', 'redux']
  const collectedData = await client.collectPackageData({packages: packagesNames}); // {"react": ["0.0.1", "0.0.2"], "object-assign": ["0.0.1", "0.0.2"]}

  const resolvedDeps = await dependencies.reduce((acc, dependency) => {
    const resolved = resolveDependency({
      allVersions: collectedData[dependency.name] || {},
      name: dependency.name,
      range: dependency.version
    }); // { react: { version: "0.0.1", original: "^0.0.1"} }
    const packageVersion = resolved[dependency.name].version;

    return {
      ...acc,
      [dependency.name]: {
        version: packageVersion,
        dependencies: getPackagesDeep({
          name: dependency.name,
          version: packageVersion
        })
      }
    };
  }, {});


  return {
    [packageData.name]: {
      version: packageData.version,
      dependencies: resolvedDeps
    }
  };
};


router.post('/', function (req, res, next) {
  const data = req.body || {};
  const isPackageNameValid = isPackageValid(data.name);

  if (isPackageNameValid) {
    const {name, version} = getNameAndVersion(data.name);
    getPackagesDeep({name, version}).then((fin) => {
      res.send({ status: 'ok', response: fin });
    })

  } else {
    res.send({status: 'fail'});
  }
});

module.exports = router;

