var Component = require('./src/component');
var SaveComponent = require('./src/save-component');
var DeleteComponent = require('./src/delete-component');
var QueryComponent = require('./src/query-component');

const APP_ID = 'APP_ID';
const CLIENT_KEY = 'CLIENT_KEY';
const table = 'Table';

describe(`Component Tests
`, function () {
  it('Components should have all general required properties', function (done) {
    try {
      let component = new Component();
      
      component.getProperty(APP_ID);
      component.getProperty(CLIENT_KEY);
      component.getProperty(table);
      
      component = new QueryComponent();
      component.getProperty(APP_ID);
      component.getProperty(CLIENT_KEY);
      component.getProperty(table);
      
      component = new SaveComponent();
      component.getProperty(APP_ID);
      component.getProperty(CLIENT_KEY);
      component.getProperty(table);
      
      component = new DeleteComponent();
      component.getProperty(APP_ID);
      component.getProperty(CLIENT_KEY);
      component.getProperty(table);
      
      done();
    } catch(e) { done(new Error('A component is missing required properties')); }
  })
  it('Component should have all required ports', function (done) {
    try {
      const component = new Component();
      component.getPort('Success');
      component.getPort('Error');
      done();
    } catch(e) { done(new Error('Component missing required ports')); }
  })
})