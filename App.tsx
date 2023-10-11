import React, { useEffect, useState, useCallback } from 'react';
import { AppState, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundFetch from 'react-native-background-fetch';

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

  const handleLocationUpdate = useCallback((position: any) => {
    const { latitude, longitude } = position.coords;
    const time = getCurrentTime();
    setLocationArray((prevState) => [...prevState, { latitude, longitude, time }]);
  }, [setLocationArray]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (nextAppState === 'active') {
        // App is in the foreground
        console.log('App is in the foreground');
        Geolocation.getCurrentPosition(handleLocationUpdate);
      } else if (nextAppState === 'background') {
        // App is in the background
        console.log('App is in the background');
      }
    };

    // Add the AppState change listener
    AppState.addEventListener('change', handleAppStateChange);

    // Register a background task
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Fetch every 15 minutes (adjust as needed)
      },
      async (taskId) => {
        // Fetch the location in the background
        Geolocation.getCurrentPosition(
          (position) => {
            handleLocationUpdate(position);
          },
          (error) => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 2000000000,
            maximumAge: 1000,
          }
        );

        // Finish the background task
        BackgroundFetch.finish(taskId);
      }
    );

    // Start the background task
    BackgroundFetch.start();

    return () => {
      // Remove the AppState change listener and stop the background task when the component unmounts
      AppState.removeEventListener('change', handleAppStateChange);
      BackgroundFetch.stop();
    };
  }, [handleLocationUpdate]);

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
