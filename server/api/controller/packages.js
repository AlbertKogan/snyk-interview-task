const {
  extractDependencies,
  resolveDependency,
  parseName,
  listToTree
} = require('../lib/package-processing');
const {keys, isEmpty, path} = require('ramda');

const client = require('../client/npm-registry');


const getPackagesAll = async (_packageName) => {
  let _dependencies = [];
  const {packageName, packageVersion} = parseName(_packageName);

  async function getPackagesDeep({input, version, parent = null}) {
    const packageData = await client.getPackageData({name: input});

    if (packageData instanceof Error) {
      throw new Error('Fail to load package');
    }
    const resolved = resolveDependency({
      allVersions: keys(packageData.versions),
      name: packageData.name,
      range: version
    });

    let packageVersion = path([packageData.name, 'version'], resolved);

    if (!packageVersion) {
      packageVersion = path(['dist-tags', version], packageData);
    }

    _dependencies.push({
      name: packageData.name,
      version: packageVersion,
      label: `${packageData.name} ${packageVersion}`,
      key: `${packageData.name}-${packageVersion}`,
      parent
    });

    // End of recursion
    if (isEmpty(keys(path(['versions', packageVersion, 'dependencies'], packageData) || {}))) {
      return _dependencies;
    }

    return await Promise.all(extractDependencies(
      packageData.versions[packageVersion]
    ).map(
      (data) => getPackagesDeep({
        input: data.name,
        version: data.version,
        parent: packageData.name
      })
    ));
  }

  return getPackagesDeep({
    input: packageName,
    version: packageVersion
  }).then(listToTree);
};

module.exports = {getPackagesAll};
