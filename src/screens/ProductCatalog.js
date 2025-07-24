import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Share, Alert, Platform } from 'react-native';
import { fetchProducts } from '../api/amazon';
import ProductCard from '../components/ProductCard';
import TryOnModal from '../components/TryOnModal';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';

const DEMOGRAPHICS = [
  { label: 'All', value: 'all' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
  { label: 'Kids', value: 'kids' },
  { label: 'Unisex', value: 'unisex' },
];

export default function ProductCatalog() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showTryOn, setShowTryOn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const loadProducts = async (demographic = 'all') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(demographic);
      setProducts(data);
    } catch (e) {
      setError('Failed to load products');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts(filter);
  }, [filter]);

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
    if (Platform.OS === 'android') {
      MediaLibrary.requestPermissionsAsync();
    }
  };

  const handleShare = async () => {
    if (!capturedPhoto) return;
    try {
      await Share.share({
        url: capturedPhoto,
        message: 'Check out my virtual try-on!',
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to share photo.');
    }
  };

  const handleSave = async () => {
    if (!capturedPhoto) return;
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to save photos.');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(capturedPhoto);
      Alert.alert('Saved', 'Photo saved to gallery!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save photo.');
    }
  };

  const handleViewMyTryOns = () => {
    closeTryOn();
    navigation.navigate('My Try-Ons');
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {DEMOGRAPHICS.map(d => (
          <TouchableOpacity
            key={d.value}
            style={[styles.filterBtn, filter === d.value && styles.filterBtnActive]}
            onPress={() => setFilter(d.value)}
          >
            <Text style={[styles.filterText, filter === d.value && styles.filterTextActive]}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', marginTop: 40 }}>{error}</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
          {products.map(product => (
            <View key={product.id} style={styles.productCard}>
              <ProductCard {...product} />
              <TouchableOpacity style={styles.tryOnBtn} onPress={() => handleTryOn(product)}>
                <Text style={styles.tryOnBtnText}>Try On</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <TryOnModal
        visible={showTryOn}
        product={selectedProduct}
        onClose={closeTryOn}
        onPhotoCaptured={handlePhotoCaptured}
        capturedPhoto={capturedPhoto}
        onViewMyTryOns={handleViewMyTryOns}
      />
      {capturedPhoto && (
        <View style={styles.shareSaveRow}>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save to Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginHorizontal: 4,
  },
  filterBtnActive: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    color: '#333',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollRow: {
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
  productCard: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tryOnBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  tryOnBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  shareSaveRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  shareBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#FF9800',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
