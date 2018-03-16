class Core {
  constructor(setter, getter) {
    this.setter = setter;
    this.getter = getter;
  }

  async getUserConfig(id) {
    const config = await this.getter(id);

    return config || {servers: []};
  }

  async setUserConfig(id, config) {
    return await this.setter(id, config);
  }

  async addServer(id, url, token) {
    const config = await this.getUserConfig(id);

    if (config.servers.some(s => s.url === url)) {
      return new Error(`Server ${url} already exists in your list`);
    }

    config.servers = [
      ...config.servers,
      {
        url,
        token
      }
    ];

    this.setUserConfig(id, config);
  }

  async listServers(id) {
    const config = await this.getUserConfig(id);

    return config.servers;
  }
}

module.exports = Core;
