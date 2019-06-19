const npa = require('npm-package-arg');
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
  try {
    if (!value || typeof value !== 'string') {
      return false
    }

    npa(value.trim());

    return true
  } catch (e) {
    console.log(e);
    return false
  }
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

/**
 *
 * @param name
 * @returns {{packageVersion: string, packageName: *, type: *}}
 */
const parseName = (name) => {
  const parsed = npa(name);
  const packageName = parsed.escapedName || (parsed.hosted && parsed.hosted.project);
  let packageVersion = parsed.scope ? '*' : parsed.fetchSpec;

  if (parsed.scope) {
    // Workaround for npm-registry (doe not support scoped packages with version)
    packageVersion = '*';
  } else if (parsed.type === 'git') {
    if (parsed.gitCommittish) {
      packageVersion = semver.clean(parsed.gitCommittish)
    } else if (parsed.gitRange) {
      packageVersion = parsed.gitRange
    } else {
      packageVersion = 'latest';
    }
  }

  return { packageName, packageVersion, type: parsed.type };

};

module.exports = {
  isPackageValid,
  extractDependencies,
  resolveDependency,
  parseName
};
