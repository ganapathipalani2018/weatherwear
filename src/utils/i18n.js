// Placeholder for i18n utility
import I18n from 'react-native-i18n';

I18n.fallbacks = true;
I18n.translations = {
  en: {
    welcome: 'Welcome to WeatherWear!',
    subtitle: 'Your weather-based outfit assistant',
    capturePhoto: 'Capture Photo',
    buyOnAmazon: 'Buy on Amazon',
    selectPhoto: 'Select Photo',
    addCaption: 'Add a caption...',
    uploadPost: 'Upload Post',
    demographic: 'Demographic',
    feed: 'Feed',
    catalog: 'Catalog',
    weather: 'Weather',
    arTryOn: 'AR Try-On',
    post: 'Post',
  },
  hi: {
    welcome: 'WeatherWear में आपका स्वागत है!',
    subtitle: 'आपका मौसम-आधारित आउटफिट सहायक',
    capturePhoto: 'फोटो लें',
    buyOnAmazon: 'अमेज़न पर खरीदें',
    selectPhoto: 'फोटो चुनें',
    addCaption: 'कैप्शन जोड़ें...',
    uploadPost: 'पोस्ट अपलोड करें',
    demographic: 'जनसांख्यिकी',
    feed: 'फ़ीड',
    catalog: 'कैटलॉग',
    weather: 'मौसम',
    arTryOn: 'एआर ट्राय-ऑन',
    post: 'पोस्ट',
  },
  ta: {
    welcome: 'WeatherWear-க்கு வரவேற்கிறோம்!',
    subtitle: 'உங்கள் வானிலை அடிப்படையிலான உடை உதவியாளர்',
    capturePhoto: 'புகைப்படம் எடுக்கவும்',
    buyOnAmazon: 'அமேசானில் வாங்கவும்',
    selectPhoto: 'புகைப்படத்தைத் தேர்ந்தெடுக்கவும்',
    addCaption: 'விளக்கத்தைச் சேர்க்கவும்...',
    uploadPost: 'பதிவேற்றவும்',
    demographic: 'மக்கள் தொகை',
    feed: 'ஊட்டம்',
    catalog: 'பட்டியல்',
    weather: 'வானிலை',
    arTryOn: 'AR முயற்சி',
    post: 'பதிவு',
  },
  kn: {
    welcome: 'WeatherWear ಗೆ ಸ್ವಾಗತ!',
    subtitle: 'ನಿಮ್ಮ ಹವಾಮಾನ ಆಧಾರಿತ ಉಡುಪು ಸಹಾಯಕ',
    capturePhoto: 'ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ',
    buyOnAmazon: 'ಅಮೆಜಾನ್‌ನಲ್ಲಿ ಖರೀದಿಸಿ',
    selectPhoto: 'ಫೋಟೋ ಆಯ್ಕೆಮಾಡಿ',
    addCaption: 'ವಿವರಣೆಯನ್ನು ಸೇರಿಸಿ...',
    uploadPost: 'ಪೋಸ್ಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    demographic: 'ಜನಸಂಖ್ಯೆ',
    feed: 'ಫೀಡ್',
    catalog: 'ಕ್ಯಾಟಲಾಗ್',
    weather: 'ಹವಾಮಾನ',
    arTryOn: 'AR ಪ್ರಯತ್ನಿಸಿ',
    post: 'ಪೋಸ್ಟ್',
  },
};

export function setLanguage(lang) {
  I18n.locale = lang;
}

export default I18n;
