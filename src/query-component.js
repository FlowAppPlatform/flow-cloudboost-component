var Flow = require('flow-platform-sdk');
var Component = require('./component');
var API = require('./api');

class QueryComponent extends Component {

  constructor() {

    super();    
    this.name = 'Query Component';

    /* 
    * 'Constraints' should be passed here as a JSON stringified object
    * 'Constraints' sample structure 
    * `{ 
    *   "first_name": {"equalTo": "qwerty"},
    *   "age": {"greaterThan": 6}
    * }`
    * 
    */
    var constraints = new Flow.Property('Constraints', 'text');
    this.addProperty(constraints);

    // query with constraints here
    this.attachTask(function () {

      try {

        new API(
          this.getProperty('APP_ID').data,
          this.getProperty('CLIENT_KEY').data,
          this.getProperty('Table').data
        ).find(
          this.getProperty('Constraints').data ?
            // constraints was added JSON stringified
            // so we have to JSON.parse here
            JSON.parse(this.getProperty('Constraints').data) :
            this.getProperty('Constraints').data
        ).then(
          (results) => this.emitResult(this.getPort('Success'), results),
          () => this.emitResult(this.getPort('Error'))
        );

      } catch(e) { this.emitResult(this.getPort('Error')); }

    });

  }

}

module.exports = QueryComponent;