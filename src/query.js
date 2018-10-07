var Flow = require('flow-platform-sdk');
var Component = require('./component');
var API = require('./api');

class QueryComponent extends Component {

  constructor() {

    super();    
    this.name = 'Query Component';

    /* 
    * 'Constraints' sample structure 
    * { 
    *   first_name: {equalTo: "qwerty"},
    *   age: {greaterThan: 6}
    * }
    * 
    */
    var constraints = new Flow.Property('Constraints', 'object');
    this.addProperty(constraints);

    // query with constraints here
    this.attachTask(function () {

      try {

        new API(
          this.getProperty('APP_ID').data,
          this.getProperty('CLIENT_KEY').data,
          this.getProperty('Table').data
        ).find(this.getProperty('Constraints').data).then(
          response => {
            const port = this.getPort('Success');
            port.getProperty('Data').data = response;
            port.emit();
            this.taskComplete();
          },
          err => {
            const port = this.getPort('Error');
            port.getProperty('Data').data = err;
            port.emit();
            this.taskComplete();
          }
        );

      } catch(err) {
        const port = this.getPort('Error');
        port.getProperty('Data').data = err;
        port.emit();
        this.taskComplete();
      }

    });

  }

}

module.exports = QueryComponent;