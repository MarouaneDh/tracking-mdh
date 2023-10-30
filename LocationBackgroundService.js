import BackgroundGeolocation from 'react-native-background-geolocation';
import axios from 'axios';

let intervalId = null;

const getCurrentTime = () => {
    const today = new Date();
    const hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
    const minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    const seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
    return hours + ':' + minutes + ':' + seconds;
};

BackgroundGeolocation.configure({
    desiredAccuracy: 10,
    stationaryRadius: 50,
    distanceFilter: 50,
    notificationTitle: 'Location tracking',
    notificationText: 'Enabled',
    debug: false,
    startOnBoot: false,
    stopOnTerminate: false,
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
});

BackgroundGeolocation.on('location', (location) => {
    const { latitude, longitude } = location.coords;
    const currentTime = getCurrentTime();
    const url = 'https://api.green-city.prod-projet.com/items/contact';

    const data = {
        firstName: `${latitude}`,
        lastName: `${longitude}`,
        organization: `${currentTime}`,
        contactBy: 'phone',
        phoneNumber: '50032125',
        email: 'dhambrimarouane@gmail.com',
        reason: 'test',
        comment: 'background testing',
    };

    // Send the data to your API using Axios
    axios.post(url, data);
});

BackgroundGeolocation.start();