const fs = require('fs');

class Storage {
  constructor (config = {}) {
    this.data = new Map();
    this.dirtyOperations = 0;
    this.persistLock = false;
    this.config = {
      storageFile: 'storage.txt',
      ...config
    }
  }

  get dirty() {
    return this.dirtyOperations > 0;
  }

  setItem(key, value) {
    this.data.set(key.toString(), value);
    this.dirtyOperations++;

    this.persist();
  }

  getItem(key) {
    return this.data.get(key.toString());
  }

  restore() {
    return new Promise(resolve => {
      fs.readFile(this.config.storageFile, (err, data) => {
        if (!err) {
          this.data = new Map(JSON.parse(data));
        }

        resolve();
      })
    });
  }

  persist() {
    if (this.persistLock) {
      console.log('Persisting already in progress');
      return;
    }

    this.persistLock = true;

    fs.writeFile(this.config.storageFile, JSON.stringify([...this.data]), err => {
      if(err) {
        return console.error(err);
      }

      this.persistLock = false;
      console.log("The file was saved!");
    });
  }
}

module.exports = Storage;