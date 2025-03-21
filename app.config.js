import 'dotenv/config';
import process from 'process';

export default {
  expo: {
    name: 'GoGoTalk',
    slug: 'go-go-talk',
    version: '1.0.0',
    orientation: 'portrait',
    icon: 'src/assets/icon.png',
    userInterfaceStyle: 'light',
    entryPoint: './src/App.tsx',
    splash: {
      image: 'src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: 'src/assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.cse443.gogotalk',
    },
    web: {
      favicon: 'src/assets/favicon.png',
    },
    newArchEnabled: true,
    extra: {
      apiKey: process.env.EXPO_PUBLIC_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_APP_ID,
      measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
      eas: {
        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
      },
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: 'The app needs access to your photos to let you share them in chats.',
        },
      ],
      'expo-auth-session',
      'expo-crypto',
    ],
    fonts: [
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/AntDesign.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Entypo.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/EvilIcons.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/AntDesign.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Fontisto.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Foundation.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Octicons.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/SimpleLineIcons.ttf',
      },
      {
        asset:
          './node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Zocial.ttf',
      },
    ],
  },
};
