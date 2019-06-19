const {
  isPackageValid,
  extractDependencies,
  resolveDependency,
  parseName
} = require('./package-processing');

test('isPackageValid', () => {
  expect(isPackageValid("react")).toBe(true);
  expect(isPackageValid("   react    ")).toBe(true);
  expect(isPackageValid("react@latest")).toBe(true);
  expect(isPackageValid("react@1.2.3")).toBe(true);
  expect(isPackageValid("@scope/react@1.2.3")).toBe(true);

  expect(isPackageValid("@scope/react@134")).toBe(true);
  expect(isPackageValid("   react@1.34")).toBe(true);

  expect(isPackageValid("git://github.com/npm/cli.git#v1.0.27")).toBe(true);
  expect(isPackageValid("git+ssh://git@github.com:npm/cli#semver:^5.0")).toBe(true);
});

test('extractDependencies', () => {
  expect(
    extractDependencies({ dependencies: { "react": "16.1.1" }})
  ).toStrictEqual([
    { name: "react", version: "16.1.1" }
  ]);
});

test('resolveDependency', () => {
  expect(
    resolveDependency({ name: "react", range: "^16.1.1", allVersions: ["16.1.1", "16.2.1"] })
  ).toStrictEqual({ "react": { version: "16.2.1" } });
});

test('parseName', () => {
  expect(parseName('react')).toStrictEqual({ packageVersion: 'latest', packageName: 'react', type: 'tag' });
  expect(parseName('react@1.2.3')).toStrictEqual({ packageVersion: '1.2.3', packageName: 'react', type: 'version' });
  expect(parseName('@scope/react@1.2.3')).toStrictEqual({ packageVersion: '*', packageName: '@scope%2freact', type: 'version' });

  expect(parseName('git://github.com/npm/cli.git#v1.0.27')).toStrictEqual({ packageVersion: '1.0.27', packageName: 'cli', type: 'git' });
  expect(parseName('git+ssh://git@github.com:npm/cli#semver:^5.0')).toStrictEqual({ packageVersion: '^5.0', packageName: 'cli', type: 'git' });
});
