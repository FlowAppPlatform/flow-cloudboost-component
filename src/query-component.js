var Flow = require('flow-platform-sdk');
var Component = require('./component');
var API = require('./api');

class QueryComponent extends Component {

  constructor() {

    super();    
    this.name = 'Query Component';

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
        this.emitResult(this.getPort('Error'));
      } else
        task
          .then(
            () => this.emitResult(this.getPort('Success')),
            () => this.emitResult(this.getPort('Error'))
          );
    });

  }

}

module.exports = QueryComponent;