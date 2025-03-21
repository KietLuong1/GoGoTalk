import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
  initializeAuth,
  getReactNativePersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.apiKey as string,
  authDomain: Constants.expoConfig?.extra?.authDomain as string,
  projectId: Constants.expoConfig?.extra?.projectId as string,
  storageBucket: Constants.expoConfig?.extra?.storageBucket as string,
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId as string,
  appId: Constants.expoConfig?.extra?.appId as string,
  databaseURL: Constants.expoConfig?.extra?.databaseURL as string,
  measurementId: Constants.expoConfig?.extra?.measurementId as string,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const persistence =
  Platform.OS === 'web'
    ? browserSessionPersistence
    : getReactNativePersistence(ReactNativeAsyncStorage);

export const auth = initializeAuth(app, { persistence });

export const database = getFirestore();
export const storage = getStorage(app);
