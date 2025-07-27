import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ARTryOnScreen from './src/screens/ARTryOnScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import FeedScreen from './src/screens/FeedScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyTryOnsScreen from './src/screens/MyTryOnsScreen';
import PostScreen from './src/screens/PostScreen';
import ProductCatalog from './src/screens/ProductCatalog';
import WeatherScreen from './src/screens/WeatherScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FavoritesTabIcon({ focused }) {
  const [count, setCount] = useState(0);
  const loadCount = async () => {
    const favs = await AsyncStorage.getItem('favorites');
    const favIds = favs ? JSON.parse(favs) : [];
    setCount(favIds.length);
  };
  useEffect(() => {
    loadCount();
    const interval = setInterval(loadCount, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={focused ? 'heart' : 'heart-o'} size={22} color={focused ? '#F44336' : '#888'} />
      {count > 0 && (
        <View style={{
          position: 'absolute',
          top: -4,
          right: -8,
          backgroundColor: '#F44336',
          borderRadius: 8,
          minWidth: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 3,
        }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{count}</Text>
        </View>
      )}
    </View>
  );
}

function MyTryOnsTabIcon({ focused }) {
  const [count, setCount] = useState(0);
  const loadCount = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') return;
    const album = await MediaLibrary.getAlbumAsync('DCIM');
    const assets = await MediaLibrary.getAssetsAsync({
      album: album || undefined,
      mediaType: 'photo',
      first: 100,
      sortBy: [['creationTime', false]],
    });
    const tryOnPhotos = assets.assets.filter(asset => asset.filename.startsWith('TryOn_'));
    setCount(tryOnPhotos.length);
  };
  useEffect(() => {
    loadCount();
    const interval = setInterval(loadCount, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="camera" size={22} color={focused ? '#2196F3' : '#888'} />
      {count > 0 && (
        <View style={{
          position: 'absolute',
          top: -4,
          right: -8,
          backgroundColor: '#2196F3',
          borderRadius: 8,
          minWidth: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 3,
        }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{count}</Text>
        </View>
      )}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AR Try-On" component={ARTryOnScreen} />
      <Tab.Screen name="Weather" component={WeatherScreen} />
      <Tab.Screen name="Catalog" component={ProductCatalog} />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ tabBarIcon: FavoritesTabIcon }}
      />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen
        name="My Try-Ons"
        component={MyTryOnsScreen}
        options={{ tabBarIcon: MyTryOnsTabIcon }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
