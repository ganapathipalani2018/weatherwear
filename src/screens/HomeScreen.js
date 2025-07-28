import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    weather: 'Current Weather',
    temp: 'Temperature',
    condition: 'Condition',
    humidity: 'Humidity',
    wind: 'Wind Speed',
    recommendations: 'Clothing Recommendations',
    features: 'Features',
    arTryOn: 'AR Try-On',
    catalog: 'Product Catalog',
    social: 'Social Feed',
    favorites: 'Favorites',
    myTryOns: 'My Try-Ons',
  },
  hi: {
    welcome: 'WeatherWear में आपका स्वागत है!',
    subtitle: 'आपका स्मार्ट मौसम और फैशन साथी',
    weather: 'वर्तमान मौसम',
    temp: 'तापमान',
    condition: 'स्थिति',
    humidity: 'आर्द्रता',
    wind: 'हवा की गति',
    recommendations: 'कपड़ों की सिफारिशें',
    features: 'विशेषताएं',
    arTryOn: 'AR ट्राई-ऑन',
    catalog: 'उत्पाद कैटलॉग',
    social: 'सोशल फीड',
    favorites: 'पसंदीदा',
    myTryOns: 'मेरे ट्राई-ऑन',
  },
  ta: {
    welcome: 'WeatherWear க்கு வரவேற்கிறோம்!',
    subtitle: 'உங்கள் ஸ்மார்ட் வானிலை மற்றும் ஃபேஷன் துணை',
    weather: 'தற்போதைய வானிலை',
    temp: 'வெப்பநிலை',
    condition: 'நிலை',
    humidity: 'ஈரப்பதம்',
    wind: 'காற்று வேகம்',
    recommendations: 'ஆடை பரிந்துரைகள்',
    features: 'அம்சங்கள்',
    arTryOn: 'AR ட்ரை-ஆன்',
    catalog: 'தயாரிப்பு பட்டியல்',
    social: 'சமூக ஊட்டம்',
    favorites: 'பிடித்தவை',
    myTryOns: 'எனது ட்ரை-ஆன்கள்',
  },
  kn: {
    welcome: 'WeatherWear ಗೆ ಸುಸ್ವಾಗತ!',
    subtitle: 'ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಹವಾಮಾನ ಮತ್ತು ಫ್ಯಾಷನ್ ಸಂಗಾತಿ',
    weather: 'ಪ್ರಸ್ತುತ ಹವಾಮಾನ',
    temp: 'ತಾಪಮಾನ',
    condition: 'ಸ್ಥಿತಿ',
    humidity: 'ಆರ್ದ್ರತೆ',
    wind: 'ಗಾಳಿಯ ವೇಗ',
    recommendations: 'ಉಡುಪು ಶಿಫಾರಸುಗಳು',
    features: 'ವೈಶಿಷ್ಟ್ಯಗಳು',
    arTryOn: 'AR ಟ್ರೈ-ಆನ್',
    catalog: 'ಉತ್ಪನ್ನ ಕ್ಯಾಟಲಾಗ್',
    social: 'ಸಾಮಾಜಿಕ ಫೀಡ್',
    favorites: 'ಮೆಚ್ಚಿನವುಗಳು',
    myTryOns: 'ನನ್ನ ಟ್ರೈ-ಆನ್‌ಗಳು',
  },
};

export default function HomeScreen({ navigation }) {
  const [lang, setLang] = useState('en');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      // Mock weather data for now
      const mockWeather = {
        temperature: 22,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        icon: '⛅',
      };
      setWeatherData(mockWeather);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data');
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
    <ScrollView style={styles.container}>
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

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.title}>{t.welcome}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      {/* Weather Section */}
      {weatherData && (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>{t.weather}</Text>
          <View style={styles.weatherContent}>
            <Text style={styles.weatherIcon}>{weatherData.icon}</Text>
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
              <Text style={styles.condition}>{weatherData.condition}</Text>
            </View>
          </View>
          <View style={styles.weatherDetails}>
            <Text style={styles.detailText}>{t.humidity}: {weatherData.humidity}%</Text>
            <Text style={styles.detailText}>{t.wind}: {weatherData.windSpeed} km/h</Text>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>{t.features}</Text>
        <View style={styles.actionGrid}>
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
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  weatherCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  condition: {
    fontSize: 16,
    color: '#666',
  },
  weatherDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
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
});
