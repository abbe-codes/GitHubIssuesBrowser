// index.js
import { AppRegistry } from 'react-native';
import App from './src/App'; // Adjust the path if your App component is elsewhere
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
