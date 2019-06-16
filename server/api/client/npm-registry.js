const url = require('url');
const got = require('got');

const NPM_REGISTRY_URL ='https://registry.npmjs.org';


class NPMRegistryClient {
  async getData ({ _url }) {
    try {
      const { body } = await got(_url, {
        responseType: 'json'
      });

      return JSON.parse(body);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  getPackageDataExactVersion ({ name, version }) {
    return this.getData({
      _url: url.resolve(NPM_REGISTRY_URL, `/${name}/${version}`)
    });
  }

  getPackageData ({ name }) {
    return this.getData({
      _url: url.resolve(NPM_REGISTRY_URL, `/${name}`)
    });
  }

  collectPackageData ({ packages }) {
    return Promise.all(
      packages.map((name) => this.getPackageData({ name }))
    ).then(
      responses => responses.reduce((acc, response) => ({
        ...acc,
        [response.name]: Object.keys(response.versions)
      }), {})
    )
  }
}

module.exports = NPMRegistryClient;
