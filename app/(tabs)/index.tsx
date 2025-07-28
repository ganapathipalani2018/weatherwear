import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी', value: 'hi' },
  { label: 'தமிழ்', value: 'ta' },
  { label: 'ಕನ್ನಡ', value: 'kn' },
];

export default function HomeScreen() {
  const [lang, setLang] = useState('en');

  const handleLangChange = (value: string) => {
    setLang(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.langRow}>
        <Text style={styles.langLabel}>🌐</Text>
        {Platform.OS === 'ios' ? (
          <Picker
            selectedValue={lang}
            style={styles.picker}
            onValueChange={handleLangChange}
          >
            {LANGUAGES.map(l => (
              <Picker.Item key={l.value} label={l.label} value={l.value} />
            ))}
          </Picker>
        ) : (
          <Picker
            selectedValue={lang}
            style={styles.picker}
            onValueChange={handleLangChange}
          >
            {LANGUAGES.map(l => (
              <Picker.Item key={l.value} label={l.label} value={l.value} />
            ))}
          </Picker>
        )}
      </View>
      
      <Text style={styles.title}>Welcome to WeatherWear!</Text>
      <Text style={styles.subtitle}>Your Smart Weather & Fashion Companion</Text>
      
      <View style={styles.featuresContainer}>
        <Text style={styles.featureTitle}>Features:</Text>
        <Text style={styles.feature}>• Weather-based clothing recommendations</Text>
        <Text style={styles.feature}>• AR Try-On for virtual fitting</Text>
        <Text style={styles.feature}>• Product catalog with favorites</Text>
        <Text style={styles.feature}>• Social feed and sharing</Text>
        <Text style={styles.feature}>• Multi-language support</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  langLabel: {
    fontSize: 20,
    marginRight: 8,
  },
  picker: {
    height: 40,
    width: 160,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  feature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
});
