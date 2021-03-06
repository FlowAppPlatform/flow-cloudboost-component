var Q = require('q');

var SaveComponent = require('./src/save');
var DeleteComponent = require('./src/delete');
var QueryComponent = require('./src/query');

/*
 * 
 * To run all tests,
 * 
 * replace appId, clientKey, table with your own
 * 
 */

const appId       = '',
      clientKey   = '',
      table       = '';

describe(`Component Tests
`, function () {
  
  const APP_ID = 'APP_ID';
  const CLIENT_KEY = 'CLIENT_KEY';
  const TABLE = 'Table';

  const Graph = require('flow-platform-sdk').Graph;

  it('Query Component should execute without errors', function (done) {
    try {
      const Component = require('./src/query');
      const component = new Component();

      component.getProperty('APP_ID').data = APP_ID;
      component.getProperty('CLIENT_KEY').data = CLIENT_KEY;
      component.getProperty('Table').data = TABLE;

      component.getProperty('Constraints').data = {
        name: { equalTo: 'Chess' }
      };

      component.getPort('Success').onEmit(function(){
        done();
      });
      component.getPort('Error').onEmit(function(){
        done(component.getPort('Error').getProperty('Data').data);
      });

      new Graph("graph-1").addComponent(component);
      component.execute();

    } catch(e) { done(e); }
  })
  it('Save Component should execute without errors', function (done) {
    try {
      const Component = require('./src/save');
      const component = new Component();

      component.getProperty('APP_ID').data = APP_ID;
      component.getProperty('CLIENT_KEY').data = CLIENT_KEY;
      component.getProperty('Table').data = TABLE;

      component.getProperty('Documents').data = [{ name: 'Jonah Dillingham' }];

      component.getPort('Success').onEmit(function(){
        done();
      });
      component.getPort('Error').onEmit(function(){
        done(component.getPort('Error').getProperty('Data').data);
      });

      new Graph("graph-1").addComponent(component);
      component.execute();

    } catch(e) { done(e); }
  })
  it('Delete Component should execute without errors', function (done) {
    try {
      const Component = require('./src/delete');
      const component = new Component();

      component.getProperty('APP_ID').data = APP_ID;
      component.getProperty('CLIENT_KEY').data = CLIENT_KEY;
      component.getProperty('Table').data = TABLE;

      component.getProperty('Documents').data = ['TbzuxauD'];

      component.getPort('Success').onEmit(function(){
        done();
      });
      component.getPort('Error').onEmit(function(){
        done(component.getPort('Error').getProperty('Data').data);
      });

      new Graph("graph-1").addComponent(component);
      component.execute();

    } catch(e) { done(e); }
  })
  it('Component should have all required ports', function (done) {
    try {
      let component = new QueryComponent();
      component.getPort('Success');
      component.getPort('Error');
      component = new DeleteComponent();
      component.getPort('Success');
      component.getPort('Error');
      component = new SaveComponent();
      component.getPort('Success');
      component.getPort('Error');
      done();
    } catch(e) { done(new Error('Component missing required ports')); }
  })
})

if (!(appId && clientKey && table)) return

function query(constraints=null) {
  const d = Q.defer();
  try {

    const component = new QueryComponent();
    
    component.getProperty('APP_ID').data = appId;
    component.getProperty('CLIENT_KEY').data = clientKey;
    component.getProperty('Table').data = table;
    if (constraints)
      component.getProperty('Constraints').data = constraints;

    component.getPort('Success').onEmit(function() {
      d.resolve(component.getPort('Success').getProperty('Result').data);
    });
    component.getPort('Error').onEmit(function() {
      d.reject(new Error('Emit returned error'));
    });
    component.execute();

  } catch(e) { d.reject(e); }
  return d.promise;
}

function save(name) {
  const d = Q.defer();
  try {

    const component = new SaveComponent();
    
    component.getProperty('APP_ID').data = appId;
    component.getProperty('CLIENT_KEY').data = clientKey;
    component.getProperty('Table').data = table;
    component.getProperty('Documents').data = [{ 
        name: name
    }];

    component.getPort('Success').onEmit(function() {
      d.resolve(/* component.getPort('Success').getProperty('Result').data */);
    });
    component.getPort('Error').onEmit(function() {
      d.reject(new Error('Emit returned error'));
    });
    component.execute();
    
  } catch(e) { d.reject(e); }
  return d.promise;
}

function remove(id) {
  const d = Q.defer();
  try {

    const component = new DeleteComponent();
    
    component.getProperty('APP_ID').data = appId;
    component.getProperty('CLIENT_KEY').data = clientKey;
    component.getProperty('Table').data = table;
    component.getProperty('Documents').data = [id];

    component.getPort('Success').onEmit(function() {
      d.resolve(/* component.getPort('Success').getProperty('Result').data */);
    });
    component.getPort('Error').onEmit(function() {
      d.reject(new Error('Emit returned error'));
    });
    component.execute();
    
  } catch(e) { d.reject(e); }
  return d.promise;
}

describe(`API Tests
`, function () {
  it('QueryComponent should return documents', function (done) {
    query().then(
      function(res) { if (res instanceof Array) done(); },
      function(e) { done(e); }
    );
  })
  it('SaveComponent should save documents', function (done) {
    save('Chess').then(
      function() { done(); },
      function(e) { done(e); }
    );
  })
  it('DeleteComponent should delete documents', function (done) {
    this.timeout(7000);
    query().then(
      function(res) { 
        if (res.length) {
          remove(res[0].document._id).then(
            function() {
              query().then(
                function(r) { if (r.length+1 === res.length) done(); },
                function(e) { done(e); }
              );
            },
            function(e) { done(e); }
          );
        } else done();
      },
      function(e) { done(e); }
    );
  })
})