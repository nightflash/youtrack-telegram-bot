class Storage {
  constructor(setter, getter) {
    this.setter = setter;
    this.getter = getter;
  }

  async getUserConfig(id) {
    const config = await this.getter(id);

    return JSON.parse(config) || {servers: []};
  }

  async setUserConfig(id, config) {
    return await this.setter(id, JSON.stringify(config));
  }

  async addServer(id, url, permanentToken) {
    const config = await this.getUserConfig(id);

    if (config.servers.some(s => s.url === url)) {
      return new Error(`Server ${url} already exists in your list`);
    }

    console.log(id, url, permanentToken, config);

    config.servers.push({
      url,
      permanentToken
    });

    this.setUserConfig(id, config);
  }

  async listServers(id) {
    const config = await this.getUserConfig(id);

    return config.servers;
  }
}

module.exports = Storage;
