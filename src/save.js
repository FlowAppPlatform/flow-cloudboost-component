var Flow = require('flow-platform-sdk');
var Component = require('./component');
var API = require('./api');

class SaveComponent extends Component {

  constructor() {

    super();    
    this.name = 'Save Component';

    var documents = new Flow.Property('Documents', 'list');
    documents.required = true;
    
    this.addProperty(documents);

    // save the documents here
    this.attachTask(function () {
      let task = 
        new API(
          this.getProperty('APP_ID').data,
          this.getProperty('CLIENT_KEY').data,
          this.getProperty('Table').data
        ).save(this.getProperty('Documents').data);
      
      if (task instanceof Error) {
        this.emitResult('Error');
      } else
        task
          .then(
            () => this.emitResult('Success'),
            () => this.emitResult('Error')
          );
    });

  }

}

module.exports = SaveComponent;