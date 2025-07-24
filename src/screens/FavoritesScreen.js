import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProducts } from '../api/amazon';
import TryOnModal from '../components/TryOnModal';
import { useNavigation } from '@react-navigation/native';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTryOn, setShowTryOn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favs = await AsyncStorage.getItem('favorites');
      const favIds = favs ? JSON.parse(favs) : [];
      setFavorites(favIds);
      const allProducts = await fetchProducts('all');
      setProducts(allProducts.filter(p => favIds.includes(p.id)));
    } catch (e) {
      Alert.alert('Error', 'Failed to load favorites.');
    }
    setLoading(false);
  };

  const handleUnfavorite = async (productId) => {
    try {
      const newFavs = favorites.filter(id => id !== productId);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
      setFavorites(newFavs);
      setProducts(products.filter(p => p.id !== productId));
    } catch (e) {
      Alert.alert('Error', 'Failed to update favorites.');
    }
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      {loading ? (
        <Text style={styles.emptyText}>Loading...</Text>
      ) : products.length === 0 ? (
        <Text style={styles.emptyText}>No favorites yet. Tap the heart icon on a product to add it here.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.unfavBtn} onPress={() => handleUnfavorite(item.id)}>
                  <Text style={styles.unfavBtnText}>Unfavorite</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tryOnBtn} onPress={() => handleTryOn(item)}>
                  <Text style={styles.tryOnBtnText}>Try On</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <TryOnModal
        visible={showTryOn}
        product={selectedProduct}
        onClose={closeTryOn}
        onPhotoCaptured={handlePhotoCaptured}
        capturedPhoto={capturedPhoto}
        onViewMyTryOns={handleViewMyTryOns}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#222',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  grid: {
    paddingHorizontal: 8,
    alignItems: 'flex-start',
  },
  productCard: {
    width: '46%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    margin: '2%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  unfavBtn: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 6,
  },
  unfavBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tryOnBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  tryOnBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 