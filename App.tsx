import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

interface LocationItem {
  latitude: number;
  longitude: number;
  time: string;
}

function App(): JSX.Element {
  const [locationArray, setLocationArray] = useState<LocationItem[]>([]);

  const keyExtractor = (item: LocationItem, index: number) => index.toString();

  const renderItem = ({item, index}: {item: LocationItem; index: number}) => {
    return (
      <View style={styles.locationContainer}>
        <Text style={{fontWeight: 'bold'}}>Location #{index + 1}:</Text>
        <Text>
          Time : <Text style={{fontWeight: 'bold'}}>{item.time}</Text>
        </Text>
        <Text>
          Latitude : <Text style={{fontWeight: 'bold'}}>{item.latitude}</Text>
        </Text>
        <Text>
          Longitude : <Text style={{fontWeight: 'bold'}}>{item.longitude}</Text>
        </Text>
      </View>
    );
  };

  const getCurrentTime = () => {
    const today = new Date();
    const hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
    const minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    const seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
    return hours + ':' + minutes + ':' + seconds;
  };

  useEffect(() => {
    // Request background location updates
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'always',
      enableBackgroundLocationUpdates: true,
    });

    const locationUpdateInterval = 10000; // 10 seconds in milliseconds

    const updateLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const currentTime = getCurrentTime();

          console.log({latitude, longitude, time: currentTime});

          // Add the location data to the array
          setLocationArray(prevArray => [
            ...prevArray,
            {latitude, longitude, time: currentTime},
          ]);
        },
        error => {
          console.error('Error getting location:', error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    };

    // Initial location update
    updateLocation();

    // Set up interval for subsequent location updates
    const locationUpdateTimer = setInterval(
      updateLocation,
      locationUpdateInterval,
    );

    return () => {
      clearInterval(locationUpdateTimer); // Clean up the interval when the component unmounts
    };
  }, []);

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
