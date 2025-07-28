import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getProductsByIds } from '../api/amazon';
import { fetchWeatherByLocation } from '../api/weather';
import TryOnModal from '../components/TryOnModal';
import { getOutfitSuggestion } from '../utils/rules';

const { width } = Dimensions.get('window');

const WEATHER_ICONS = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Snow': '❄️',
  'Thunderstorm': '⛈️',
  'Drizzle': '🌦️',
  'Mist': '🌫️',
  'Fog': '🌫️',
  'Smoke': '🌫️',
  'Haze': '🌫️',
  'Dust': '🌫️',
  'Sand': '🌫️',
  'Ash': '🌫️',
  'Squall': '💨',
  'Tornado': '🌪️',
};

export default function WeatherScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [outfit, setOutfit] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedTab, setSelectedTab] = useState('current');

  const getWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }
      
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      
      // Fetch current weather
      const weatherData = await fetchWeatherByLocation(loc.coords.latitude, loc.coords.longitude);
      setWeather(weatherData);
      
      // Generate mock hourly forecast (in real app, this would come from API)
      const hourly = generateHourlyForecast(weatherData);
      setHourlyForecast(hourly);
      
      // Generate mock daily forecast
      const daily = generateDailyForecast(weatherData);
      setDailyForecast(daily);
      
      const suggestion = getOutfitSuggestion(weatherData);
      setOutfit(suggestion);
    } catch (e) {
      setError('Failed to get weather data');
      console.log('Weather error:', e);
    }
    setLoading(false);
  };

  const generateHourlyForecast = (currentWeather) => {
    const hours = [];
    const baseTemp = currentWeather.temp;
    const baseCondition = currentWeather.condition;
    
    for (let i = 0; i < 24; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() + i);
      
      // Simulate temperature variation
      const tempVariation = Math.sin(i * Math.PI / 12) * 5;
      const temp = Math.round(baseTemp + tempVariation);
      
      // Simulate condition changes
      const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm'];
      const condition = i % 6 === 0 ? conditions[Math.floor(Math.random() * conditions.length)] : baseCondition;
      
      hours.push({
        time: hour.getHours(),
        temp: temp,
        condition: condition,
        icon: WEATHER_ICONS[condition] || '☀️',
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 20) + 5,
      });
    }
    return hours;
  };

  const generateDailyForecast = (currentWeather) => {
    const days = [];
    const baseTemp = currentWeather.temp;
    const conditions = ['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Snow'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const highTemp = Math.round(baseTemp + Math.random() * 10 - 5);
      const lowTemp = Math.round(highTemp - Math.random() * 10 - 5);
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      days.push({
        date: date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        high: highTemp,
        low: lowTemp,
        condition: condition,
        icon: WEATHER_ICONS[condition] || '☀️',
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        precipitation: Math.floor(Math.random() * 100),
      });
    }
    return days;
  };

  useEffect(() => {
    getWeather();
  }, []);

  const handleTryOn = (product) => {
    setSelectedProduct(product);
    setShowTryOn(true);
    setCapturedPhoto(null);
  };

  const closeTryOn = () => {
    setShowTryOn(false);
    setSelectedProduct(null);
    setCapturedPhoto(null);
  };

  const handlePhotoCaptured = (uri) => {
    setCapturedPhoto(uri);
  };

  const handleViewMyTryOns = () => {
    closeTryOn();
    navigation.navigate('My Try-Ons');
  };

  const formatTime = (hour) => {
    return hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={getWeather}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Current Weather Section */}
        {weather && (
          <View style={styles.currentWeatherSection}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationText}>{weather.city}</Text>
              <Text style={styles.timeText}>As of {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            
            <View style={styles.currentWeatherCard}>
              <View style={styles.temperatureSection}>
                <Text style={styles.temperatureText}>{Math.round(weather.temp)}°</Text>
                <Text style={styles.conditionText}>{weather.condition}</Text>
                <Text style={styles.feelsLikeText}>Feels like {Math.round(weather.temp)}°</Text>
              </View>
              
              <View style={styles.weatherIconSection}>
                <Text style={styles.weatherIcon}>{WEATHER_ICONS[weather.condition] || '☀️'}</Text>
              </View>
            </View>

            {/* Weather Details */}
            <View style={styles.weatherDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{weather.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Wind Speed</Text>
                <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>{weather.pressure} mb</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Visibility</Text>
                <Text style={styles.detailValue}>{weather.visibility} km</Text>
              </View>
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'current' && styles.activeTab]} 
            onPress={() => setSelectedTab('current')}
          >
            <Text style={[styles.tabText, selectedTab === 'current' && styles.activeTabText]}>Current</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'hourly' && styles.activeTab]} 
            onPress={() => setSelectedTab('hourly')}
          >
            <Text style={[styles.tabText, selectedTab === 'hourly' && styles.activeTabText]}>Hourly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'daily' && styles.activeTab]} 
            onPress={() => setSelectedTab('daily')}
          >
            <Text style={[styles.tabText, selectedTab === 'daily' && styles.activeTabText]}>Daily</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'hourly' && (
          <View style={styles.forecastSection}>
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
              {hourlyForecast.map((hour, index) => (
                <View key={index} style={styles.hourlyCard}>
                  <Text style={styles.hourlyTime}>{formatTime(hour.time)}</Text>
                  <Text style={styles.hourlyIcon}>{hour.icon}</Text>
                  <Text style={styles.hourlyTemp}>{hour.temp}°</Text>
                  <Text style={styles.hourlyCondition}>{hour.condition}</Text>
                  <Text style={styles.hourlyDetails}>H: {hour.humidity}%</Text>
                  <Text style={styles.hourlyDetails}>W: {hour.windSpeed} km/h</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {selectedTab === 'daily' && (
          <View style={styles.forecastSection}>
            <Text style={styles.sectionTitle}>Daily Forecast</Text>
            {dailyForecast.map((day, index) => (
              <View key={index} style={styles.dailyCard}>
                <View style={styles.dailyHeader}>
                  <Text style={styles.dailyDay}>{day.day}</Text>
                  <Text style={styles.dailyDate}>{day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                </View>
                <View style={styles.dailyContent}>
                  <View style={styles.dailyLeft}>
                    <Text style={styles.dailyIcon}>{day.icon}</Text>
                    <Text style={styles.dailyCondition}>{day.condition}</Text>
                  </View>
                  <View style={styles.dailyRight}>
                    <Text style={styles.dailyHigh}>{day.high}°</Text>
                    <Text style={styles.dailyLow}>{day.low}°</Text>
                    <Text style={styles.dailyPrecip}>{day.precipitation}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Clothing Recommendations */}
        {outfit && Object.entries(outfit).length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Clothing Recommendations</Text>
            {Object.entries(outfit).map(([category, ids]) => (
              ids.length > 0 && (
                <View key={category} style={styles.categoryBox}>
                  <Text style={styles.categoryTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {getProductsByIds(category, ids).map(product => (
                      <View key={product.id} style={styles.productCard}>
                        <Image source={{ uri: product.image }} style={styles.productImage} />
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.productPrice}>{product.price}</Text>
                        <View style={styles.productActions}>
                          <TouchableOpacity
                            style={styles.buyBtn}
                            onPress={() => Alert.alert('Buy', `Opening ${product.name}`)}
                          >
                            <Text style={styles.buyBtnText}>Buy</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.tryOnBtn}
                            onPress={() => handleTryOn(product)}
                          >
                            <Text style={styles.tryOnBtnText}>Try On</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )
            ))}
          </View>
        )}
      </ScrollView>
      
      <TryOnModal
        visible={showTryOn}
        product={selectedProduct}
        onClose={closeTryOn}
        onPhotoCaptured={handlePhotoCaptured}
        capturedPhoto={capturedPhoto}
        onViewMyTryOns={handleViewMyTryOns}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  currentWeatherSection: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  locationHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  currentWeatherCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperatureSection: {
    flex: 1,
  },
  temperatureText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  feelsLikeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  weatherIconSection: {
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 80,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  forecastSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  hourlyScroll: {
    marginBottom: 16,
  },
  hourlyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hourlyTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  hourlyIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  hourlyTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  hourlyCondition: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  hourlyDetails: {
    fontSize: 10,
    color: '#999',
  },
  dailyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dailyDay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dailyDate: {
    fontSize: 14,
    color: '#666',
  },
  dailyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  dailyCondition: {
    fontSize: 16,
    color: '#333',
  },
  dailyRight: {
    alignItems: 'flex-end',
  },
  dailyHigh: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  dailyLow: {
    fontSize: 16,
    color: '#666',
  },
  dailyPrecip: {
    fontSize: 12,
    color: '#999',
  },
  recommendationsSection: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  categoryBox: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  productCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#eee',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 13,
    color: '#2196F3',
    marginBottom: 6,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  buyBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  buyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tryOnBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tryOnBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
