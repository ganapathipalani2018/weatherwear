import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DEMOGRAPHICS = ['men', 'women', 'kids', 'unisex'];

export default function PostScreen() {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [demographic, setDemographic] = useState('unisex');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadPost = async () => {
    if (!image || !caption) {
      Alert.alert('Missing Info', 'Please select a photo and enter a caption.');
      return;
    }
    setUploading(true);
    try {
      // Save post locally instead of Firebase
      const newPost = {
        id: Date.now().toString(),
        imageUrl: image,
        caption,
        demographic,
        createdAt: new Date().toISOString(),
      };
      
      // Get existing posts from local storage
      const existingPosts = await AsyncStorage.getItem('localPosts');
      const posts = existingPosts ? JSON.parse(existingPosts) : [];
      posts.unshift(newPost);
      
      // Save back to local storage
      await AsyncStorage.setItem('localPosts', JSON.stringify(posts));
      
      setImage(null);
      setCaption('');
      setDemographic('unisex');
      Alert.alert('Success', 'Post saved locally!');
    } catch (e) {
      Alert.alert('Upload Error', e.message);
    }
    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Select Photo</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Add a caption..."
        value={caption}
        onChangeText={setCaption}
      />
      <View style={styles.demographicRow}>
        {DEMOGRAPHICS.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[styles.demographicBtn, demographic === tag && styles.demographicBtnActive]}
            onPress={() => setDemographic(tag)}
          >
            <Text style={[styles.demographicText, demographic === tag && styles.demographicTextActive]}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.uploadBtn} onPress={uploadPost} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadBtnText}>Save Post</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  imagePicker: {
    width: 180,
    height: 180,
    backgroundColor: '#eee',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    overflow: 'hidden',
  },
  imagePickerText: {
    color: '#888',
    fontSize: 16,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'cover',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  demographicRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  demographicBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginHorizontal: 4,
  },
  demographicBtnActive: {
    backgroundColor: '#2196F3',
  },
  demographicText: {
    color: '#333',
    fontWeight: 'bold',
  },
  demographicTextActive: {
    color: '#fff',
  },
  uploadBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
