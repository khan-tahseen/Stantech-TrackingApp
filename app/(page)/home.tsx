import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationObject } from 'expo-location';
import { Attendance, DealerLocation, LocationHistory } from '@/types/type';

const LOCATION_INTERVAL = 5 * 60 * 1000; // 5 minutes

const DEALER_LOCATIONS: DealerLocation[] = [
  { latitude: 37.7749, longitude: -122.4194, name: 'Dealer 1' },
  { latitude: 37.7848, longitude: -122.4271, name: 'Dealer 2' },
  // Add more dealer locations as needed
];


const Home = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([]);
  const [attendance, setAttendance] = useState<Attendance>({ clockIn: null, clockOut: null });
  const [checkedInDealer, setCheckedInDealer] = useState<DealerLocation | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: LOCATION_INTERVAL,
          distanceInterval: 10,
        },
        (location) => {
          setCurrentLocation(location);
          addLocationToHistory(location.coords);
        }
      );

      loadStoredData();
    })();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedLocationHistory = await AsyncStorage.getItem('locationHistory');
      if (storedLocationHistory) setLocationHistory(JSON.parse(storedLocationHistory));

      const storedAttendance = await AsyncStorage.getItem('attendance');
      if (storedAttendance) setAttendance(JSON.parse(storedAttendance));
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  const addLocationToHistory = async (coords: { latitude: number; longitude: number }) => {
    const newLocation: LocationHistory = {
      ...coords,
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [...locationHistory, newLocation];
    setLocationHistory(updatedHistory);
    try {
      await AsyncStorage.setItem('locationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving location history:', error);
    }
  };

  const handleClockIn = async () => {
    const clockIn = new Date().toISOString();
    setAttendance({ ...attendance, clockIn });
    try {
      await AsyncStorage.setItem('attendance', JSON.stringify({ ...attendance, clockIn }));
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const handleClockOut = async () => {
    const clockOut = new Date().toISOString();
    setAttendance({ ...attendance, clockOut });
    try {
      await AsyncStorage.setItem('attendance', JSON.stringify({ ...attendance, clockOut }));
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const checkInOutAtDealer = (dealer: DealerLocation) => {
    if (checkedInDealer && checkedInDealer.name === dealer.name) {
      setCheckedInDealer(null);
    } else {
      setCheckedInDealer(dealer);
      addLocationToHistory(dealer);
    }
  };

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
          {DEALER_LOCATIONS.map((dealer, index) => (
            <Marker
              key={index}
              coordinate={dealer}
              title={dealer.name}
              description={checkedInDealer && checkedInDealer.name === dealer.name ? 'Checked In' : ''}
              pinColor={checkedInDealer && checkedInDealer.name === dealer.name ? 'green' : 'red'}
              onPress={() => checkInOutAtDealer(dealer)}
            />
          ))}
        </MapView>
      )}
      <View style={styles.controlsContainer}>
        <Button title="Check In" onPress={handleClockIn} disabled={!!attendance.clockIn} />
        <Button title="Check Out" onPress={handleClockOut} disabled={!attendance.clockIn || !!attendance.clockOut} />
      </View>
      <View style={styles.attendanceContainer}>
        <Text>Check In: {attendance.clockIn ? new Date(attendance.clockIn).toLocaleTimeString() : '00:00:00'}</Text>
        <Text>Check Out: {attendance.clockOut ? new Date(attendance.clockOut).toLocaleTimeString() : '00:00:00'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginBottom: 8
  },
});

export default Home;