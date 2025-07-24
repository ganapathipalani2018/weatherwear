import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal, Dimensions, Share, Alert, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width / 3 - 8;

export default function MyTryOnsScreen() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to view your try-ons.');
        setLoading(false);
        return;
      }
      // Get all photos, filter for TryOn_ prefix
      const album = await MediaLibrary.getAlbumAsync('DCIM');
      const assets = await MediaLibrary.getAssetsAsync({
        album: album || undefined,
        mediaType: 'photo',
        first: 100,
        sortBy: [['creationTime', false]],
      });
      const tryOnPhotos = assets.assets.filter(asset => asset.filename.startsWith('TryOn_'));
      setPhotos(tryOnPhotos);
    } catch (e) {
      Alert.alert('Error', 'Failed to load photos.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const openPhoto = (photo) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
  };

  const handleShare = async () => {
    if (!selectedPhoto) return;
    try {
      await Share.share({
        url: selectedPhoto.uri,
        message: 'Check out my virtual try-on!'
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to share photo.');
    }
  };

  const handleDelete = async () => {
    if (!selectedPhoto) return;
    try {
      await MediaLibrary.deleteAssetsAsync([selectedPhoto.id]);
      Alert.alert('Deleted', 'Photo deleted.');
      closeModal();
      loadPhotos();
    } catch (e) {
      Alert.alert('Error', 'Failed to delete photo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Try-Ons</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 40 }} />
      ) : photos.length === 0 ? (
        <Text style={styles.emptyText}>No try-on photos found.</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openPhoto(item)}>
              <Image source={{ uri: item.uri }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPhoto && (
              <Image source={{ uri: selectedPhoto.uri }} style={styles.modalImage} resizeMode="contain" />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleShare}>
                <Text style={styles.modalBtnText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#F44336' }]} onPress={handleDelete}>
                <Text style={styles.modalBtnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtn} onPress={closeModal}>
                <Text style={styles.modalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 10,
    margin: 4,
    backgroundColor: '#eee',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: width * 0.85,
    maxHeight: width * 1.2,
  },
  modalImage: {
    width: width * 0.7,
    height: width * 0.9,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#222',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginHorizontal: 6,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 