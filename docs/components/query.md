# Flow Cloudboost Query component
Cloudboost components designed to work with Flow SDK

*To get started, install the package in your NodeJS project*

```
npm i flow-cloudboost-component --save
```

*Use the component as below*

```javascript
// require the component
const Component = require('flow-cloudboost-component');

// create instance of the query component for example
const component = new Component.Query();
```

*Provide cloudboost credentials, app id, client key*

```javascript
component.getProperty('APP_ID').data = 'Your_App_ID';
component.getProperty('CLIENT_KEY').data = 'Your_Client_Key';
```

*Provide collection to query against*

```javascript
// have this created, for example 'Games'
component.getProperty('Table').data = 'Your_Collection';
// constrain the query if you may, this is optional
component.getProperty('Constraints').data = {
  name: { equalTo: 'Chess' },
  players: { lessThan: 2 }
};
```

*Listen in for port emit events*
```javascript
component.getPort('Success').onEmit(function() {
  // query was successfully made
  // the documents can be accessed through the 'Data' property of the port
  let documents = component.getPort('Success').getProperty('Data')
    .data
    .map(d => d.document);
});

component.getPort('Error').onEmit(function() {
  // an error occured
  // the actual error can be accessed through the 'Data' property of the port
  let err = component.getPort('Error').getProperty('Data').data;
});
```

*Execute the component*
```javascript
// add the component to a graph before executing it
const Graph = require('flow-platform-sdk').Graph;
new Graph("graph-1").addComponent(component);

component.execute();
```

#### Conclusion

Also check the [Cloudboost Save](./save.md) and [Cloudboost Delete](./delete.md) components

If you are having trouble, ensure that you are using the correct [Cloudboost credentials](https://cloudboost.io/).