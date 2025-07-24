import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: 'slide1',
    title: 'Welcome to WeatherWear',
    text: 'Get weather-based outfit suggestions, try on clothes virtually, and share your style!',
    image: require('../../assets/images/onboarding1.png'),
  },
  {
    key: 'slide2',
    title: 'Virtual Try-On',
    text: 'Use your camera to try on outfits and accessories before you buy.',
    image: require('../../assets/images/onboarding2.png'),
  },
  {
    key: 'slide3',
    title: 'Save & Share',
    text: 'Save your try-ons, share with friends, and build your favorites wishlist.',
    image: require('../../assets/images/onboarding3.png'),
  },
  {
    key: 'slide4',
    title: 'Permissions',
    text: 'We need camera, gallery, and location permissions to give you the best experience.',
    image: require('../../assets/images/onboarding4.png'),
  },
];

export default function OnboardingScreen({ navigation }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const requestPermissions = async () => {
    const { status: camStatus } = await Location.requestForegroundPermissionsAsync();
    setPermissionsGranted(camStatus === 'granted');
  };

  const nextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const handleGetStarted = async () => {
    await requestPermissions();
    navigation.replace('Auth');
  };

  const slide = slides[slideIndex];

  return (
    <View style={styles.container}>
      <Image source={slide.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.text}>{slide.text}</Text>
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, slideIndex === i && styles.dotActive]} />
        ))}
      </View>
      <View style={styles.btnRow}>
        {slideIndex > 0 && (
          <TouchableOpacity style={styles.navBtn} onPress={prevSlide}>
            <Text style={styles.navBtnText}>Back</Text>
          </TouchableOpacity>
        )}
        {slideIndex < slides.length - 1 ? (
          <TouchableOpacity style={styles.navBtn} onPress={nextSlide}>
            <Text style={styles.navBtnText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.getStartedBtn} onPress={handleGetStarted}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#eee',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#2196F3',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtn: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  navBtnText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  getStartedBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  getStartedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
}); 