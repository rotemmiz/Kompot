module.exports = {
  require: function (getComponent, mocks={}) {
    if (global.KompotApp) {
      Object.keys(mocks).forEach(key => {
        if(global[key]) {
          mocks[key]();
        }
      });
      global.KompotApp(getComponent())
    }
  },
 
  testComponent: function(name) {
    const fetch = require('node-fetch');
    const requests = [];
    requests.push(fetch(`http://localhost:2600/setCurrentComponent?componentName=${name}`));

    return {
      withMocks: function(globals) {
        const query = globals.map(global => `${global}=true`).join('&');
        requests.push(fetch(`http://localhost:2600/setGlobals?${query}`));
        return this;
      },
      withProps: function(props) {
        const query = Object.keys(props)
        .map(key => {
          let value = props[key];
          if(isFunction(props[key])){
            value = 'FUNCTION#'+ value.toString();
          }
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join('&');
        requests.push(fetch(`http://localhost:2600/setProps?${query}`));
        return this;
      },
      mount : async function(){
        return Promise.all(requests);
      }
    };
  }
};

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
 }