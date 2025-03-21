import { registerRootComponent } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Chat from '@/screens/Chat/Chat';
import Help from '@screens/Help';
import Chats from '@/screens/Chat/Chats';
import Login from '@screens/Auth/Login';
import Users from '@screens/Users';
import About from '@screens/About';
import Group from '@screens/Chat/Group';
import SignUp from '@screens/Auth/SignUp';
import Welcome from '@screens/Welcome';
import Profile from '@/screens/User/Profile';
import Account from '@/screens/User/Account';
import { auth } from '@config/firebase';
import Settings from '@screens/Settings';
import ChatInfo from '@/screens/Chat/ChatInfo';
import ChatMenu from '@components/ChatMenu';
import ChatHeader from '@components/ChatHeader';
import { UnreadMessagesProvider, UnreadMessagesContext } from './contexts/UnreadMessagesContext';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from './contexts/AuthenticatedUserContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { unreadCount, setUnreadCount } = useContext(UnreadMessagesContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Chats') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Chats" options={{ tabBarBadge: unreadCount > 0 ? unreadCount : undefined }}>
        {() => <Chats setUnreadCount={setUnreadCount} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ route }: any) => ({
          headerTitle: () => (
            <ChatHeader chatName={route.params.chatName} chatId={route.params.id} />
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ChatMenu chatName={route.params.chatName} chatId={route.params.id} />
            </View>
          ),
        })}
      />
      <Stack.Screen name="Users" component={Users} options={{ title: 'Select User' }} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Group" component={Group} options={{ title: 'New Group' }} />
      <Stack.Screen name="ChatInfo" component={ChatInfo} options={{ title: 'Chat Information' }} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

const AppContent = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser || null);
      setIsLoading(false);
    });

    return unsubscribeAuth;
  }, [setUser]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <NavigationContainer>{user ? <MainStack /> : <AuthStack />}</NavigationContainer>;
};

const App = () => (
  <MenuProvider>
    <AuthenticatedUserProvider>
      <UnreadMessagesProvider>
        <AppContent />
      </UnreadMessagesProvider>
    </AuthenticatedUserProvider>
  </MenuProvider>
);

export default registerRootComponent(App);
