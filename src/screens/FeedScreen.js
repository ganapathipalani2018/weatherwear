import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock data instead of Firebase
    const mockPosts = [
      {
        id: '1',
        imageUrl: 'https://via.placeholder.com/220x220/2196F3/FFFFFF?text=Try+On+1',
        caption: 'Perfect outfit for today\'s weather!',
        demographic: 'men'
      },
      {
        id: '2',
        imageUrl: 'https://via.placeholder.com/220x220/4CAF50/FFFFFF?text=Try+On+2',
        caption: 'Stylish and comfortable!',
        demographic: 'women'
      },
      {
        id: '3',
        imageUrl: 'https://via.placeholder.com/220x220/FF9800/FFFFFF?text=Try+On+3',
        caption: 'Great for outdoor activities',
        demographic: 'unisex'
      }
    ];
    
    // Simulate loading
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading feed...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No posts yet. Be the first to share!</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style={styles.demographic}>{item.demographic?.charAt(0).toUpperCase() + item.demographic?.slice(1)}</Text>
        </View>
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  list: {
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 18,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  demographic: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
});
