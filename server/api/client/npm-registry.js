const npmFetch = require('npm-registry-fetch');
const querystring = require('querystring');


class NPMRegistryClient {
  async getData ({ path }) {
    try {
      return await npmFetch.json(path);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  search ({ value }) {
    const parameters = {
      text: value,
      quality: 1.0,
      popularity: 1.0
    };
    return this.getData({
      path: `/-/v1/search?${querystring.stringify(parameters)}`
    });
  }

  getPackageData ({ name }) {
    return this.getData({
      path: `/${name}`
    });
  }
}

const client = new NPMRegistryClient();

module.exports = client;
