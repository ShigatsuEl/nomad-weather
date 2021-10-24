import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const API_KEY = "25a9a94f73898f55f849ed6883521984";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [success, setSuccess] = useState(true);

  const getLocationPermissionAsync = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setSuccess(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getLocationPermissionAsync();
  }, []);

  return (
    <View style={styles.container}>
      {success ? (
        <>
          <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
          </View>
          <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weather}
          >
            {days.length === 0 ? (
              <View style={styles.day}>
                <ActivityIndicator color="white" size="large" />
              </View>
            ) : (
              days.map((day, index) => (
                <View key={index} style={styles.day}>
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>
                    {day.weather[0].description}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </>
      ) : (
        <Text>😥 Please allow to get location permission! 😥</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
    fontWeight: "600",
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  },
});
