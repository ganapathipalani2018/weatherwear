import axios from 'axios';
import Constants from 'expo-constants';

const OPENWEATHER_API_KEY = Constants.expoConfig?.extra?.openWeatherApiKey || 'YOUR_OPENWEATHERMAP_API_KEY';

export async function fetchWeatherByLocation(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;
    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main,
      city: data.name,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return {
      temp: 25,
      condition: 'Sunny',
      city: 'Sample City',
    };
  }
}
