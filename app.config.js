export default {
  expo: {
    name: "WeatherWear",
    slug: "WeatherWear",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "weatherwear",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "org.mastery.weatherwear"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "org.mastery.weatherwear",
      googleServicesFile: "./app/google-services.json"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "@react-native-firebase/app"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      firebase: {
        apiKey: "AIzaSyCEZXUbAV-WIqH9BsA251c698mDL4tQE_g",
        authDomain: "weatherwear-7085f.firebaseapp.com",
        projectId: "weatherwear-7085f",
        storageBucket: "weatherwear-7085f.appspot.com",
        messagingSenderId: "415900197764",
        appId: "1:415900197764:android:0eb386310514354e3ff3d1",
        measurementId: "G-XXXXXXXXXX"
      },
      openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "b147197b2188b82b9bee1a4d41ec1819",
      eas: {
        projectId: "b566283c-4fb7-48c6-baeb-6ebd19a90d17"
      }
    }
  }
}; 