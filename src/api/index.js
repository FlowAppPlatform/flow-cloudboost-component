var CB = require('cloudboost');
var Q  = require('q');

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
    const deferred = Q.defer();
    ids.forEach((id, index) => {
      const query = new this.CB.CloudQuery(this.TABLE);
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
    const d = Q.defer();
    const query = this._constructQuery(constraints);
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
      this._effectOperator(
        operator.toString().toLowerCase(),
        query,
        column,
        constraint[operator]
      );
    } catch (error) {
      return null;
    }
  }

  _effectOperator(operator, query, column, value) {
    switch (operator) {
    case 'equalto':
      query.equalTo(column, value);
      break;
    case 'notequalto':
      query.notEqualTo(column, value);
      break;
    case 'lessthan':
      query.lessThan(column, value);
      break;
    case 'greaterthan':
      query.greaterThan(column, value);
      break;
    default: break;
    }
  }

}

module.exports = API;