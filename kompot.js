module.exports = {
  kompotRequire: function (pathToComponent) {
    const path = require('path');
    const fetch = require('node-fetch');
    const fileName = path.basename(pathToComponent, '.js');
    const {serialize} = require('./Serialize');
    let globals = [];
    let triggers = [];
    let props = {};

    //helpers:
    const getArrayQuery = (globals) => globals.map(global => `${global}=true`).join('&');
    const getPropsQuery = (props) => `props=${encodeURIComponent(serialize(props))}`;

    const testComponentBuilder =  {
        withMocks: function(globalsToAdd) {
          globals = globals.concat(globalsToAdd);
          return this;
        },
        withTriggers: function(triggeresToAdd) {
          triggers = triggers.concat(triggeresToAdd);
          return this;
        },
        withProps: function(propsToAdd) {
          Object.assign(props, propsToAdd);
          return this;
        },
        kompotInjector: function(){
          return this;
        },
        mount : async function(){
          const requests = [];
          const globalsQuery = getArrayQuery(globals);
          const triggersQuery = getArrayQuery(triggers);
          const propsQuery = getPropsQuery(props);
          await fetch(`http://localhost:2600/setCurrentComponent?componentName=${fileName}`);
          requests.push(fetch(`http://localhost:2600/setGlobals?${globalsQuery}`));
          requests.push(fetch(`http://localhost:2600/setTriggers?${triggersQuery}`));
          requests.push(fetch(`http://localhost:2600/setProps?${propsQuery}`));
          await Promise.all(requests);
          await device.reloadReactNative();
          globals = [];
          props = {};
        }
      };

    const handler = {
      get: (target,prop) => {
        if(testComponentBuilder.hasOwnProperty(prop)){
          return testComponentBuilder[prop];
        } else{
          return testComponentBuilder;
        }
      }
    }
    return new Proxy(testComponentBuilder, handler);
  }
};
