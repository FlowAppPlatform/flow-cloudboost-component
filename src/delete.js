var Flow = require('flow-platform-sdk');
var Component = require('./component');
var API = require('./api');

class DeleteComponent extends Component {

  constructor() {

    super();    
    this.name = 'Delete Component';

    // a list of document ids here
    var documents = new Flow.Property('Documents', 'list');
    documents.required = true;
    
    this.addProperty(documents);

    // delete the documents here
    this.attachTask(function () {
      let task = 
        new API(
          this.getProperty('APP_ID').data,
          this.getProperty('CLIENT_KEY').data,
          this.getProperty('Table').data
        ).delete(this.getProperty('Documents').data);
      
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

module.exports = DeleteComponent;