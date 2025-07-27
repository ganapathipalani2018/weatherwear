import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from '../utils/i18n';

export default function ProductCard({ id, title, price, image, demographic, link, onFavoriteChange, userId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    const favIds = favs ? JSON.parse(favs) : [];
    setIsFavorite(favIds.includes(id));
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    Animated.sequence([
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const toggleFavorite = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    let favIds = favs ? JSON.parse(favs) : [];
    let msg = '';
    if (favIds.includes(id)) {
      favIds = favIds.filter(favId => favId !== id);
      setIsFavorite(false);
      msg = 'Removed from favorites';
    } else {
      favIds.push(id);
      setIsFavorite(true);
      msg = 'Added to favorites';
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favIds));
    showToast(msg);
    if (onFavoriteChange) onFavoriteChange();
  };

  const handleBuy = async () => {
    // Log the event locally instead of Firebase
    console.log('Affiliate link clicked:', { product_id: id, demographic });
    Linking.openURL(link);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.heartBtn} onPress={toggleFavorite}>
        <Icon name={isFavorite ? 'heart' : 'heart-o'} size={22} color={isFavorite ? '#F44336' : '#888'} />
      </TouchableOpacity>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.demographic}>{I18n.t('demographic')}: {demographic?.charAt(0).toUpperCase() + demographic?.slice(1)}</Text>
      <TouchableOpacity style={styles.button} onPress={handleBuy}>
        <Text style={styles.buttonText}>{I18n.t('buyOnAmazon')}</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.toast, { opacity: toastAnim }]}
        pointerEvents="none">
        <Text style={styles.toastText}>{toastMsg}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 10,
    marginHorizontal: 16,
    width: 220,
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    fontSize: 15,
    color: '#2196F3',
    marginBottom: 2,
  },
  demographic: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#FF9900',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  toast: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(60,60,60,0.95)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  toastText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
