import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WeatherWear Features</Text>
        <Text style={styles.subtitle}>Discover what makes WeatherWear special</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌤️ Weather Integration</Text>
        <Text style={styles.sectionText}>
          Get real-time weather data and receive personalized clothing recommendations based on current conditions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👕 AR Try-On</Text>
        <Text style={styles.sectionText}>
          Use your camera to virtually try on clothing items and see how they look on you before purchasing.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛍️ Smart Catalog</Text>
        <Text style={styles.sectionText}>
          Browse through curated clothing items, save favorites, and get recommendations based on your style preferences.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Social Features</Text>
        <Text style={styles.sectionText}>
          Share your outfits, discover new styles from the community, and get inspired by others' fashion choices.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌍 Multi-Language</Text>
        <Text style={styles.sectionText}>
          Available in multiple languages including English, Hindi, Tamil, and Kannada for a global user experience.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Local Storage</Text>
        <Text style={styles.sectionText}>
          Your favorites and preferences are saved locally on your device for privacy and offline access.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
