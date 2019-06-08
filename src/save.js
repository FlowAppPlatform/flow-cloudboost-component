var Flow = require('flow-platform-sdk');
var API = require('./api');

/* ABANDONED */
/* This component is no longer used */
/* This (https://github.com/FlowAppPlatform/flow-insert-object-component) is used instead */

class SaveComponent extends Flow.Component {

  constructor(id = null) {

    super(id);    
    this.name = 'Save Component';

    var app_id = new Flow.Property('APP_ID', 'text');
    app_id.required = true;

    var client_key = new Flow.Property('CLIENT_KEY', 'text');
    client_key.required = true;

    var table = new Flow.Property('Table', 'text');
    table.required = true;

    var documents = new Flow.Property('Documents', 'list');
    documents.required = true;

    this.addProperty(app_id);
    this.addProperty(client_key);
    this.addProperty(table);
    this.addProperty(documents);

    var success = new Flow.Port('Success');
    var error = new Flow.Port('Error');
    
    var response = new Flow.Property('Data', 'object');
    success.addProperty(response);

    var generalError = new Flow.Property('Data', 'object');
    error.addProperty(generalError);

    this.addPort(success);
    this.addPort(error);

    // save the documents here
    this.attachTask(function () {
      let task = 
        new API(
          this.getProperty('APP_ID').data,
          this.getProperty('CLIENT_KEY').data,
          this.getProperty('Table').data
        ).save(this.getProperty('Documents').data);
      
      if (task instanceof Error) {
        const port = this.getPort('Error');
        port.getProperty('Data').data = task;
        port.emit();
        this.taskComplete();
      } else
        task
          .then(
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
    });

  }

}

module.exports = SaveComponent;