import React, { useState } from 'react';
import { Picker, Platform, StyleSheet, Text, View } from 'react-native';
import I18n, { setLanguage } from '../utils/i18n';

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी', value: 'hi' },
  { label: 'தமிழ்', value: 'ta' },
  { label: 'ಕನ್ನಡ', value: 'kn' },
];

export default function HomeScreen() {
  const [lang, setLang] = useState(I18n.locale || 'en');

  const handleLangChange = (value) => {
    setLang(value);
    setLanguage(value);
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
          <select
            value={lang}
            onChange={e => handleLangChange(e.target.value)}
            style={styles.picker}
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        )}
      </View>
      <Text style={styles.title}>{I18n.t('welcome')}</Text>
      <Text style={styles.subtitle}>{I18n.t('subtitle')}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
