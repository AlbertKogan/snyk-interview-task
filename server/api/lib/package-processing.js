const validate = require('validate-npm-package-name');
const semver = require('semver');

/**
 *
 * @param data
 * @returns {array}
 */
const extractDependencies = (data) => {
  // Peer, Dev not handled yet
  const dependencies = data.dependencies || {};
  const packagesNames = Object.keys(dependencies);

  return packagesNames.map((name) => ({
    name,
    version: dependencies[name]
  }))
};

/**
 * Split input to package name (could contains @scope) and version
 * @param value
 * @returns {{name: string, version: string}}
 */
const getNameAndVersion = (value) => {
  // TODO: handle links
  const trimmedValue = value.trim();
  let [name, version] = trimmedValue.split('@').filter((item) => !!item);

  version = version || 'latest';
  name = trimmedValue.startsWith('@') ? `@${name}` : name;

  return { name, version }
};

/**
 * Validate input. Valid names:
 * - package_name
 * - package_name@tag
 * - package_name@1.2.3
 * - @scope_name/package_name
 * - @scope_name/package_name@tag (stable, beta, dev, canary)
 * - @scope_name/package_name@1.2.3
 * @param value
 * @returns {boolean}
 */
const isPackageValid = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const { name, version } = getNameAndVersion(value);

  if (version && version !== 'latest' && !semver.valid(version)) {
    return false;
  }

  const { validForNewPackages, validForOldPackages} = validate(name);

  return validForNewPackages && validForOldPackages;
};

/**
 *
 * @param name
 * @param range
 * @param allVersions
 * @returns {{}}
 */
const resolveDependency = ({ name, range, allVersions }) => ({
  [name]: { version: semver.maxSatisfying(allVersions, range) }
});

module.exports = {
  getNameAndVersion,
  isPackageValid,
  extractDependencies,
  resolveDependency
};
