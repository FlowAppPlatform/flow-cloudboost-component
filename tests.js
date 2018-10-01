var Q = require('q');

var Component = require('./src/component');
var SaveComponent = require('./src/save-component');
var DeleteComponent = require('./src/delete-component');
var QueryComponent = require('./src/query-component');

/*
 * 
 * Before running tests
 * 
 * create a 'Games' table
 * replace appId, clientKey with your own
 * 
 *  */
const appId = '';
const clientKey = '';
const TABLE = '';

if (!appId || !clientKey || !TABLE) return;

describe(`Component Tests
`, function () {
  
  const APP_ID = 'APP_ID';
  const CLIENT_KEY = 'CLIENT_KEY';
  const TABLE = 'Table';

  it('Components should have all general required properties', function (done) {
    try {
      let component = new Component();
      
      component.getProperty(APP_ID);
      component.getProperty(CLIENT_KEY);
      component.getProperty(TABLE);
      
      component = new QueryComponent();
      component.getProperty(APP_ID);
      component.getProperty(CLIENT_KEY);
      component.getProperty(TABLE);
      
      component = new SaveComponent();
      component.getProperty(APP_ID);
      component.getProperty(CLIENT_KEY);
      component.getProperty(TABLE);
      
      component = new DeleteComponent();
      component.getProperty(APP_ID);
      component.getProperty(CLIENT_KEY);
      component.getProperty(TABLE);
      
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

function query(constraints=null) {
  const d = Q.defer();
  try {

    const component = new QueryComponent();
    
    component.getProperty('APP_ID').data = appId;
    component.getProperty('CLIENT_KEY').data = clientKey;
    component.getProperty('Table').data = TABLE;
    if (constraints)
      component.getProperty('Constraints').data = JSON.stringify(constraints);

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
    component.getProperty('Table').data = TABLE;
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
    component.getProperty('Table').data = TABLE;
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