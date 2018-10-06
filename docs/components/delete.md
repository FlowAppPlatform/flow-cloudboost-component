# Flow Cloudboost Delete component
The npm package contains Cloudboost components designed to work with Flow SDK

*To use the component, install the package in your NodeJS project*

```
npm install flow-cloudboost-component --save
```

*Use the component as below*

```javascript
// require the component
const Component = require('flow-cloudboost-component');

// create instance of the query component for example
const component = new Component.Delete();
```

*Provide cloudboost credentials, app id, client key*

```javascript
component.getProperty('APP_ID').data = 'Your_App_ID';
component.getProperty('CLIENT_KEY').data = 'Your_Client_Key';
```

*Provide collection to delete from*

```javascript
// have this created, for example 'Games'
component.getProperty('Table').data = 'Your_Collection';
// provide IDs of the documents to delete
component.getProperty('Documents').data = ['TbzuxauD','ekJKbC79'];
```

*Listen in for port emit events*
```javascript
component.getPort('Success').onEmit(function() {
  // query was successfully made
  // the result (an array of deleted cloud objects) can be accessed through the 'Data' property of the port
  let deletedCloudObjects = component.getPort('Success').getProperty('Data')
    .data
    .map(d => d.document);
});

component.getPort('Error').onEmit(function() {
  // an error occured
  // the actual error can be accessed through the 'Data' property of the port
  let err = component.getPort('Error').getProperty('Data').data;
});


// mandatory to execute the component
component.execute();
```

#### Conclusion

And that's the Flow Cloudboost Delete component.

You may also check the [Cloudboost Save](./save.md) and [Cloudboost Query](./query.md) components

If you are having trouble, ensure that you are using the correct [Cloudboost credentials](https://cloudboost.io/).