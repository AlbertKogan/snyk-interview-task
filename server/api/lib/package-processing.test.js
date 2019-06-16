const {
  isPackageValid,
  getNameAndVersion,
  extractDependencies,
  resolveDependency
} = require('./package-processing');

test('isPackageValid', () => {
  expect(isPackageValid("react")).toBe(true);
  expect(isPackageValid("   react    ")).toBe(true);
  expect(isPackageValid("react@latest")).toBe(true);
  expect(isPackageValid("react@1.2.3")).toBe(true);
  expect(isPackageValid("@scope/react@1.2.3")).toBe(true);

  expect(isPackageValid("@scope/react@134")).toBe(false);
  expect(isPackageValid("   react@1.34")).toBe(false);
});

test('getNameAndVersion', () => {
  expect(getNameAndVersion("react")).toStrictEqual({
    name: "react", version: "latest"
  });

  expect(getNameAndVersion("react@1.2.3")).toStrictEqual({
    name: "react", version: "1.2.3"
  });

  expect(getNameAndVersion("@scope/react@1.2.3")).toStrictEqual({
    name: "@scope/react", version: "1.2.3"
  });
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