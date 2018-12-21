var CB = require('cloudboost');
var Q  = require('q');

class API {

  constructor(APP_ID, CLIENT_KEY, TABLE) {
    this.APP_ID = APP_ID;
    this.CLIENT_KEY = CLIENT_KEY;
    this.TABLE = TABLE;

    if (process.env.NODE_ENV === 'testing') return;
    this.CB = CB;
    this.CB.CloudApp.init(this.APP_ID, this.CLIENT_KEY);
  }

  save(documents=[]) {
    /* Support tests to this point */
    if (process.env.NODE_ENV === 'testing') return new Promise(
      resolve => resolve(JSON.stringify({}))
    );
    if (!documents.length) return new Error('No documents specified');
    const objects = documents.map(document => {
      const object = new this.CB.CloudObject(this.TABLE);
      Object.keys(document).forEach(key => object.set(key, document[key]));
      return object;
    });
    return this.CB.CloudObject.saveAll(objects);
  }

  delete(ids=[]) {
    /* Support tests to this point */
    if (process.env.NODE_ENV === 'testing') return new Promise(
      resolve => resolve({})
    );
    if (!ids.length) return new Error('No documents specified');
    const deferred = Q.defer();
    const query = new this.CB.CloudQuery(this.TABLE);
    ids.forEach((id, index) => {
      query.findById(id).then(
        object => {
          object.delete({
            success : () => {
              if (index + 1 === ids.length)
                deferred.resolve(object);
            },
            error : e => deferred.reject(e)
          });
        },
        err => deferred.reject(err)
      );
    });
    return deferred.promise;
  }

  deleteById(id) {
    return this.delete([id]);
  }

  /* 
   * sample 'constraints' structure 
   * { 
   *   first_name: {equalTo: "qwerty"},
   *   age: {greaterThan: 6}
   * }
   * 
   */
  find(constraints) {
    /* Support tests to this point */
    if (process.env.NODE_ENV === 'testing') return new Promise(
      resolve => resolve([])
    );
    const d = Q.defer();
    const query = this._constructQuery(constraints);
    query.setLimit(99999999);
    query.find({
      success: documents => d.resolve(documents),
      error: error => d.reject(error)
    });
    return d.promise;
  }

  /* 
   * sample 'constraints' structure 
   * { 
   *   first_name: {equalTo: "qwerty"},
   *   age: {greaterThan: 6}
   * }
   * 
   */
  _constructQuery(constraints={}) {
    const query = new this.CB.CloudQuery(this.TABLE);
    const keys = Object.keys(constraints);
    if (!keys.length) return query;
    keys.forEach(key => {
      this._constraintQuery(key, constraints[key], query);
    });
    return query;
  }

  _constraintQuery(column, constraint, query) {      
    try {
      const operator = Object.keys(constraint)[0];
      this._operators(query)[operator.toString().toLowerCase()]
        .call(query, column, constraint[operator]);
    } catch (error) {
      return null;
    }
  }

  _operators(query) {
    return {
      'equalto'     : query.equalTo,
      'notequalto'  : query.notEqualTo,
      'lessthan'    : query.lessThan,
      'greaterthan' : query.greaterThan,
    };
  }

}

module.exports = API;