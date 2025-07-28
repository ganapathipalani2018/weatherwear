import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchWeatherByLocation } from '../api/weather';

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी', value: 'hi' },
  { label: 'தமிழ்', value: 'ta' },
  { label: 'ಕನ್ನಡ', value: 'kn' },
];

const TRANSLATIONS = {
  en: {
    welcome: 'Welcome to WeatherWear!',
    subtitle: 'Your Smart Weather & Fashion Companion',
    currentWeather: 'Current Weather',
    temp: 'Temperature',
    condition: 'Condition',
    humidity: 'Humidity',
    wind: 'Wind Speed',
    recommendations: 'Clothing Recommendations',
    features: 'Quick Actions',
    arTryOn: 'AR Try-On',
    catalog: 'Product Catalog',
    social: 'Social Feed',
    favorites: 'Favorites',
    myTryOns: 'My Try-Ons',
    weatherAlerts: 'Weather Alerts',
    hourlyForecast: 'Hourly Forecast',
    dailyForecast: 'Daily Forecast',
    uvIndex: 'UV Index',
    airQuality: 'Air Quality',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    feelsLike: 'Feels Like',
    pressure: 'Pressure',
    visibility: 'Visibility',
    dewPoint: 'Dew Point',
  },
  hi: {
    welcome: 'WeatherWear में आपका स्वागत है!',
    subtitle: 'आपका स्मार्ट मौसम और फैशन साथी',
    currentWeather: 'वर्तमान मौसम',
    temp: 'तापमान',
    condition: 'स्थिति',
    humidity: 'आर्द्रता',
    wind: 'हवा की गति',
    recommendations: 'कपड़ों की सिफारिशें',
    features: 'त्वरित कार्य',
    arTryOn: 'AR ट्राई-ऑन',
    catalog: 'उत्पाद कैटलॉग',
    social: 'सोशल फीड',
    favorites: 'पसंदीदा',
    myTryOns: 'मेरे ट्राई-ऑन',
    weatherAlerts: 'मौसम चेतावनी',
    hourlyForecast: 'घंटेवार पूर्वानुमान',
    dailyForecast: 'दैनिक पूर्वानुमान',
    uvIndex: 'यूवी इंडेक्स',
    airQuality: 'वायु गुणवत्ता',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    feelsLike: 'महसूस होता है',
    pressure: 'दबाव',
    visibility: 'दृश्यता',
    dewPoint: 'ओस बिंदु',
  },
  ta: {
    welcome: 'WeatherWear க்கு வரவேற்கிறோம்!',
    subtitle: 'உங்கள் ஸ்மார்ட் வானிலை மற்றும் ஃபேஷன் துணை',
    currentWeather: 'தற்போதைய வானிலை',
    temp: 'வெப்பநிலை',
    condition: 'நிலை',
    humidity: 'ஈரப்பதம்',
    wind: 'காற்று வேகம்',
    recommendations: 'ஆடை பரிந்துரைகள்',
    features: 'விரைவு செயல்கள்',
    arTryOn: 'AR ட்ரை-ஆன்',
    catalog: 'தயாரிப்பு பட்டியல்',
    social: 'சமூக ஊட்டம்',
    favorites: 'பிடித்தவை',
    myTryOns: 'எனது ட்ரை-ஆன்கள்',
    weatherAlerts: 'வானிலை எச்சரிக்கைகள்',
    hourlyForecast: 'மணி நேர முன்னறிவிப்பு',
    dailyForecast: 'தினசரி முன்னறிவிப்பு',
    uvIndex: 'யூவி குறியீடு',
    airQuality: 'காற்று தரம்',
    sunrise: 'சூரிய உதயம்',
    sunset: 'சூரிய மறைவு',
    feelsLike: 'எப்படி உணர்கிறது',
    pressure: 'அழுத்தம்',
    visibility: 'பார்வை',
    dewPoint: 'பனி புள்ளி',
  },
  kn: {
    welcome: 'WeatherWear ಗೆ ಸುಸ್ವಾಗತ!',
    subtitle: 'ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಹವಾಮಾನ ಮತ್ತು ಫ್ಯಾಷನ್ ಸಂಗಾತಿ',
    currentWeather: 'ಪ್ರಸ್ತುತ ಹವಾಮಾನ',
    temp: 'ತಾಪಮಾನ',
    condition: 'ಸ್ಥಿತಿ',
    humidity: 'ಆರ್ದ್ರತೆ',
    wind: 'ಗಾಳಿಯ ವೇಗ',
    recommendations: 'ಉಡುಪು ಶಿಫಾರಸುಗಳು',
    features: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    arTryOn: 'AR ಟ್ರೈ-ಆನ್',
    catalog: 'ಉತ್ಪನ್ನ ಕ್ಯಾಟಲಾಗ್',
    social: 'ಸಾಮಾಜಿಕ ಫೀಡ್',
    favorites: 'ಮೆಚ್ಚಿನವುಗಳು',
    myTryOns: 'ನನ್ನ ಟ್ರೈ-ಆನ್‌ಗಳು',
    weatherAlerts: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು',
    hourlyForecast: 'ಗಂಟೆಯ ಮುನ್ಸೂಚನೆ',
    dailyForecast: 'ದೈನಂದಿನ ಮುನ್ಸೂಚನೆ',
    uvIndex: 'ಯುವಿ ಸೂಚ್ಯಂಕ',
    airQuality: 'ಗಾಳಿಯ ಗುಣಮಟ್ಟ',
    sunrise: 'ಸೂರ್ಯೋದಯ',
    sunset: 'ಸೂರ್ಯಾಸ್ತ',
    feelsLike: 'ಅನುಭವಿಸುತ್ತಿದೆ',
    pressure: 'ಒತ್ತಡ',
    visibility: 'ದೃಷ್ಟಿ',
    dewPoint: 'ತುಪ್ಪುಳ ಬಿಂದು',
  },
};

const WEATHER_ICONS = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Snow': '❄️',
  'Thunderstorm': '⛈️',
  'Drizzle': '🌦️',
  'Mist': '🌫️',
  'Fog': '🌫️',
};

export default function HomeScreen({ navigation }) {
  const [lang, setLang] = useState('en');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    loadLanguage();
    fetchWeatherData();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang) {
        setLang(savedLang);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const handleLangChange = async (value) => {
    setLang(value);
    try {
      await AsyncStorage.setItem('language', value);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for weather data');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      
      const weather = await fetchWeatherByLocation(loc.coords.latitude, loc.coords.longitude);
      setWeatherData(weather);
    } catch (error) {
      console.log('Error fetching weather:', error);
      // Use mock data if API fails
      setWeatherData({
        temp: 26,
        condition: 'Cloudy',
        humidity: 64,
        windSpeed: 29,
        pressure: 1008.5,
        visibility: 10,
        city: 'Gandhi Nagar, Karnataka',
        icon: '☁️',
        uvIndex: 6,
        airQuality: 23,
        sunrise: '06:04',
        sunset: '18:48',
        feelsLike: 26,
        dewPoint: 18,
      });
    } finally {
      setLoading(false);
    }
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Language Selector */}
      <View style={styles.langRow}>
        <Text style={styles.langLabel}>🌐</Text>
        <Picker
          selectedValue={lang}
          style={styles.picker}
          onValueChange={handleLangChange}
        >
          {LANGUAGES.map(l => (
            <Picker.Item key={l.value} label={l.label} value={l.value} />
          ))}
        </Picker>
      </View>

      {/* Current Weather Section */}
      {weatherData && (
        <View style={styles.weatherSection}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationText}>{weatherData.city}</Text>
            <Text style={styles.timeText}>As of {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
          
          <View style={styles.currentWeatherCard}>
            <View style={styles.temperatureSection}>
              <Text style={styles.temperatureText}>{Math.round(weatherData.temp)}°</Text>
              <Text style={styles.conditionText}>{weatherData.condition}</Text>
              <Text style={styles.feelsLikeText}>{t.feelsLike} {Math.round(weatherData.feelsLike)}°</Text>
            </View>
            
            <View style={styles.weatherIconSection}>
              <Text style={styles.weatherIcon}>{weatherData.icon}</Text>
            </View>
          </View>

          {/* Weather Details Grid */}
          <View style={styles.weatherDetailsGrid}>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>💧</Text>
              <Text style={styles.detailLabel}>{t.humidity}</Text>
              <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>💨</Text>
              <Text style={styles.detailLabel}>{t.wind}</Text>
              <Text style={styles.detailValue}>{weatherData.windSpeed} km/h</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>🌡️</Text>
              <Text style={styles.detailLabel}>{t.pressure}</Text>
              <Text style={styles.detailValue}>{weatherData.pressure} mb</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>👁️</Text>
              <Text style={styles.detailLabel}>{t.visibility}</Text>
              <Text style={styles.detailValue}>{weatherData.visibility} km</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>☀️</Text>
              <Text style={styles.detailLabel}>{t.uvIndex}</Text>
              <Text style={styles.detailValue}>{weatherData.uvIndex}/11</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>🌬️</Text>
              <Text style={styles.detailLabel}>{t.airQuality}</Text>
              <Text style={styles.detailValue}>{weatherData.airQuality}</Text>
            </View>
          </View>

          {/* Sunrise/Sunset */}
          <View style={styles.sunSection}>
            <View style={styles.sunItem}>
              <Text style={styles.sunIcon}>🌅</Text>
              <Text style={styles.sunLabel}>{t.sunrise}</Text>
              <Text style={styles.sunTime}>{weatherData.sunrise}</Text>
            </View>
            <View style={styles.sunItem}>
              <Text style={styles.sunIcon}>🌇</Text>
              <Text style={styles.sunLabel}>{t.sunset}</Text>
              <Text style={styles.sunTime}>{weatherData.sunset}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>{t.features}</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Weather')}>
            <Text style={styles.actionIcon}>🌤️</Text>
            <Text style={styles.actionText}>{t.currentWeather}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('AR Try-On')}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>{t.arTryOn}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.actionIcon}>🛍️</Text>
            <Text style={styles.actionText}>{t.catalog}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Feed')}>
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionText}>{t.social}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Favorites')}>
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionText}>{t.favorites}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('My Try-Ons')}>
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionText}>{t.myTryOns}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weather Alerts */}
      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>{t.weatherAlerts}</Text>
        <View style={styles.alertCard}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <Text style={styles.alertText}>No severe weather alerts for your area</Text>
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
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  langLabel: {
    fontSize: 20,
    marginRight: 8,
  },
  picker: {
    height: 40,
    width: 160,
    fontSize: 16,
  },
  weatherSection: {
    backgroundColor: '#2196F3',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  locationHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 20,
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
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  feelsLikeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  weatherIconSection: {
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 60,
  },
  weatherDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  sunSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 16,
  },
  sunItem: {
    alignItems: 'center',
  },
  sunIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  sunLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 2,
  },
  sunTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  alertsSection: {
    padding: 16,
    paddingBottom: 32,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
});
