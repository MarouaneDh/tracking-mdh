import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';

interface LocationItem {
  latitude: number;
  longitude: number;
  time: string;
}

function App(): JSX.Element {
  const [locationArray, setLocationArray] = useState<LocationItem[]>([]);

  const getCurrentTime = () => {
    const today = new Date();
    const hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
    const minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    const seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
    return hours + ':' + minutes + ':' + seconds;
  };

  const makeLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const time = getCurrentTime();
        setLocationArray(prevState => [...prevState, { latitude, longitude, time }]);
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 2000000000,
        maximumAge: 1000,
      }
    );
  }, [setLocationArray]);

  useEffect(() => {
    const intervalId = BackgroundTimer.setInterval(() => {
      makeLocation();
    }, 10000); // 10 seconds

    // Immediately invoke `makeLocation` to get the initial location
    makeLocation();

    return () => {
      BackgroundTimer.clearInterval(intervalId);
    };
  }, [makeLocation]);

  const keyExtractor = (item: LocationItem, index: number) => index.toString();

  const renderItem = ({ item, index }: { item: LocationItem; index: number }) => {
    return (
      <View style={styles.locationContainer}>
        <Text style={{ fontWeight: 'bold' }}>Location #{index + 1}:</Text>
        <Text>Time : <Text style={{ fontWeight: 'bold' }}>{item.time}</Text></Text>
        <Text>Latitude : <Text style={{ fontWeight: 'bold' }}>{item.latitude}</Text></Text>
        <Text>Longitude : <Text style={{ fontWeight: 'bold' }}>{item.longitude}</Text></Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={locationArray}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    display: 'flex',
    margin: 10,
  },
});

export default App;
