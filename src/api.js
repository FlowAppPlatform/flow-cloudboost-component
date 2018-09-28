var CB = require('cloudboost');

/* REMOVE FOR PRODUCTION */
CB.apiUrl = 'http://localhost:4730';

class API {

  constructor(APP_ID, CLIENT_KEY, TABLE) {
    this.APP_ID = APP_ID;
    this.CLIENT_KEY = CLIENT_KEY;
    this.TABLE = TABLE;

    this.CB = CB;
    this.CB.CloudApp.init(this.APP_ID, this.CLIENT_KEY);
  }

  save(documents=[]) {
    if (!documents.length) return new Error('No documents specified');
    const objects = documents.map(document => {
      const object = new this.CB.CloudObject(this.TABLE);
      Object.keys(document).forEach(key => object.set(key, document[key]));
      return object;
    });
    return this.CB.CloudObject.saveAll(objects);
  }

  delete(ids=[]) {
    if (!ids.length) return new Error('No documents specified');
    const objects = ids.map(id => {
      const query = new this.CB.CloudQuery(this.TABLE);
      query.findById(id).then(
        object => object,
        err => { if (err) return null; }
      );
    });
    return this.CB.CloudObject.deleteAll(objects);
  }

  deleteById(id) {
    return this.delete([id]);
  }

}

module.exports = API;