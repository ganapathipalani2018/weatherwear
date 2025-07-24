import React, { useRef, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ARTryOnScreen from './src/screens/ARTryOnScreen';
import WeatherScreen from './src/screens/WeatherScreen';
import ProductCatalog from './src/screens/ProductCatalog';
import FeedScreen from './src/screens/FeedScreen';
import PostScreen from './src/screens/PostScreen';
import MyTryOnsScreen from './src/screens/MyTryOnsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import auth from '@react-native-firebase/auth';
// Firebase setup
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import Constants from 'expo-constants';

const firebaseConfig = Constants.expoConfig?.extra?.firebase || {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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

function MainTabs({ userId }) {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AR Try-On" component={ARTryOnScreen} />
      <Tab.Screen name="Weather" component={WeatherScreen} />
      <Tab.Screen name="Catalog" component={ProductCatalog} />
      <Tab.Screen
        name="Favorites"
        children={props => <FavoritesScreen {...props} userId={userId} />}
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
  const routeNameRef = useRef();
  const navigationRef = useRef();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(u => {
      setUser(u);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        analytics().logScreenView({
          screen_name: routeNameRef.current,
          screen_class: routeNameRef.current,
        });
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        ) : (
          <Stack.Screen name="MainTabs">
            {props => <MainTabs {...props} userId={user.uid} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
