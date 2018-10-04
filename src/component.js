var Flow = require('flow-platform-sdk');

class Component extends Flow.Component {

  constructor() {

    super();    
    this.name = 'Component';

    var app_id = new Flow.Property('APP_ID', 'text');
    app_id.required = true;

    var client_key = new Flow.Property('CLIENT_KEY', 'text');
    client_key.required = true;

    var table = new Flow.Property('Table', 'text');
    table.required = true;

    this.addProperty(app_id);
    this.addProperty(client_key);
    this.addProperty(table);

    var success = new Flow.Port('Success');
    var error = new Flow.Port('Error');
    
    var response = new Flow.Property('Data', 'object');
    success.addProperty(response);

    var generalError = new Flow.Property('Data', 'object');
    error.addProperty(generalError);

    this.addPort(success);
    this.addPort(error);

  }

  emitResult(portName, result=null) {
    const port = this.getPort(portName);
    if (result) port.getProperty('Result').data = result;
    port.emit();
    this.taskComplete();
  }

}

module.exports = Component;