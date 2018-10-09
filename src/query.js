var Flow = require('flow-platform-sdk');
var API = require('./api');

class QueryComponent extends Flow.Component {

  constructor() {

    super();    
    this.name = 'Query Component';

    var app_id = new Flow.Property('APP_ID', 'text');
    app_id.required = true;

    var client_key = new Flow.Property('CLIENT_KEY', 'text');
    client_key.required = true;

    var table = new Flow.Property('Table', 'text');
    table.required = true;

    /* 
    * 'Constraints' sample structure 
    * { 
    *   first_name: {equalTo: "qwerty"},
    *   age: {greaterThan: 6}
    * }
    * 
    */
    var constraints = new Flow.Property('Constraints', 'object');
    
    this.addProperty(app_id);
    this.addProperty(client_key);
    this.addProperty(table);
    this.addProperty(constraints);

    var success = new Flow.Port('Success');
    var error = new Flow.Port('Error');
    
    var response = new Flow.Property('Data', 'object');
    success.addProperty(response);

    var generalError = new Flow.Property('Data', 'object');
    error.addProperty(generalError);

    this.addPort(success);
    this.addPort(error);

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