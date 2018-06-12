import { AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('Kompot', () => App);

let onComponentToTestReadyListener;
global.onComponentToTestReady = function(listener) {
  onComponentToTestReadyListener = listener;
}
global.setComponentToTest = function(ComponentToTest){
  onComponentToTestReadyListener(ComponentToTest);
}

fetchBundle();
async function fetchBundle() {
  try {
    const response = await fetch('http://localhost:1234/main.bundle.js', { method: 'GET', headers: { "Content-Type": "text/plain"} });
    const content = await response.text();
    eval(content);
  } catch (e) {
    console.error('Cannot fetch bundle: ',e.message);
  }
}