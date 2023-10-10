import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Geolocation from '@react-native-community/geolocation';

Geolocation.setRNConfiguration({
    authorizationLevel: 'always', // Request "always" location permission
    skipPermissionRequests: false,
});

AppRegistry.registerComponent(appName, () => App);
