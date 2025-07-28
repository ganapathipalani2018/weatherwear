import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchWeatherByLocation } from '../../src/api/weather';

const WEATHER_ICONS: { [key: string]: string } = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Snow': '❄️',
  'Thunderstorm': '⛈️',
  'Drizzle': '🌦️',
  'Mist': '🌫️',
  'Fog': '🌫️',
};

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  city: string;
  icon: string;
}

interface HourlyForecast {
  time: number;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface DailyForecast {
  date: Date;
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export default function ExploreScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [selectedTab, setSelectedTab] = useState('hourly');

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      const weather = await fetchWeatherByLocation(loc.coords.latitude, loc.coords.longitude);
      const weatherData: WeatherData = {
        temp: weather.temp || 26,
        condition: weather.condition || 'Cloudy',
        humidity: 64, // Mock data since API doesn't provide this
        windSpeed: 29, // Mock data since API doesn't provide this
        pressure: 1008.5, // Mock data since API doesn't provide this
        visibility: 10, // Mock data since API doesn't provide this
        city: weather.city || 'Gandhi Nagar, Karnataka',
        icon: WEATHER_ICONS[weather.condition] || '☁️',
      };
      setWeatherData(weatherData);
      
      // Generate mock hourly forecast
      const hourly = generateHourlyForecast(weatherData);
      setHourlyForecast(hourly);
      
      // Generate mock daily forecast
      const daily = generateDailyForecast(weatherData);
      setDailyForecast(daily);
    } catch (error) {
      console.log('Error fetching weather:', error);
      // Use mock data
      const mockWeather: WeatherData = {
        temp: 26,
        condition: 'Cloudy',
        humidity: 64,
        windSpeed: 29,
        pressure: 1008.5,
        visibility: 10,
        city: 'Gandhi Nagar, Karnataka',
        icon: '☁️',
      };
      setWeatherData(mockWeather);
    }
  };

  const generateHourlyForecast = (currentWeather: WeatherData): HourlyForecast[] => {
    const hours: HourlyForecast[] = [];
    const baseTemp = currentWeather.temp;
    const baseCondition = currentWeather.condition;
    
    for (let i = 0; i < 24; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() + i);
      
      const tempVariation = Math.sin(i * Math.PI / 12) * 5;
      const temp = Math.round(baseTemp + tempVariation);
      
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

  const generateDailyForecast = (currentWeather: WeatherData): DailyForecast[] => {
    const days: DailyForecast[] = [];
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

  const formatTime = (hour: number): string => {
    return hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Weather Summary */}
      {weatherData && (
        <View style={styles.currentSection}>
          <Text style={styles.locationText}>{weatherData.city}</Text>
          <View style={styles.currentWeather}>
            <Text style={styles.temperatureText}>{Math.round(weatherData.temp)}°</Text>
            <Text style={styles.conditionText}>{weatherData.condition}</Text>
            <Text style={styles.weatherIcon}>{weatherData.icon}</Text>
          </View>
        </View>
      )}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
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

      {/* Weather Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Weather Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>☔</Text>
          <Text style={styles.tipTitle}>Rain Expected</Text>
          <Text style={styles.tipText}>Don't forget your umbrella! Light rain is expected in the afternoon.</Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>🌡️</Text>
          <Text style={styles.tipTitle}>Temperature Alert</Text>
          <Text style={styles.tipText}>High UV index today. Remember to wear sunscreen and stay hydrated.</Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>👕</Text>
          <Text style={styles.tipTitle}>Clothing Suggestion</Text>
          <Text style={styles.tipText}>Perfect weather for light layers. Consider a light jacket for the evening.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  currentSection: {
    backgroundColor: '#2196F3',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  currentWeather: {
    alignItems: 'center',
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  weatherIcon: {
    fontSize: 48,
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
  tipsSection: {
    padding: 16,
    paddingBottom: 32,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
