import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WeatherCard({ temp, condition, city, suggestion }) {
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.temp}>{temp}°C</Text>
      <Text style={styles.condition}>{condition}</Text>
      <View style={styles.suggestionBox}>
        <Text style={styles.suggestionLabel}>Outfit Suggestion:</Text>
        <Text style={styles.suggestion}>{suggestion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: 16,
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  condition: {
    fontSize: 20,
    color: '#666',
    marginBottom: 16,
  },
  suggestionBox: {
    marginTop: 12,
    alignItems: 'center',
  },
  suggestionLabel: {
    fontSize: 14,
    color: '#888',
  },
  suggestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
});
