import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Image, ScrollView, TouchableOpacity, Linking, Modal, Dimensions, Alert } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeatherByLocation } from '../api/weather';
import { getOutfitSuggestion } from '../utils/rules';
import { getProductsByIds } from '../api/amazon';
import WeatherCard from '../components/WeatherCard';
import TryOnModal from '../components/TryOnModal';
import { useNavigation } from '@react-navigation/native';

const CATEGORY_LABELS = {
  tops: 'Tops',
  bottoms: 'Bottoms',
  accessories: 'Accessories',
  footwear: 'Footwear',
};

export default function WeatherScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [outfit, setOutfit] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

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
      const weatherData = await fetchWeatherByLocation(loc.coords.latitude, loc.coords.longitude);
      setWeather(weatherData);
      const suggestion = getOutfitSuggestion(weatherData);
      setOutfit(suggestion);
    } catch (e) {
      setError('Failed to get weather data');
    }
    setLoading(false);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading weather...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button title="Retry" onPress={getWeather} />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        <WeatherCard
          temp={weather.temp}
          condition={weather.condition}
          city={weather.city}
          suggestion={Object.values(outfit || {}).flat().length > 0 ? 'See outfit below' : 'No suggestion'}
        />
        {outfit && Object.entries(outfit).map(([category, ids]) => (
          ids.length > 0 && (
            <View key={category} style={styles.categoryBox}>
              <Text style={styles.categoryTitle}>{CATEGORY_LABELS[category]}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {getProductsByIds(category, ids).map(product => (
                  <View key={product.id} style={styles.productCard}>
                    <Image source={{ uri: product.image }} style={styles.productImage} />
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        style={styles.buyBtn}
                        onPress={() => Linking.openURL('https://' + product.affiliate)}
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBox: {
    width: '100%',
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
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
  buyBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 4,
    marginRight: 4,
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
    marginTop: 4,
  },
  tryOnBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
