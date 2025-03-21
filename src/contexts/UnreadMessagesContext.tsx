import React, { useMemo, useState, useEffect, createContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UnreadMessagesContextType } from '../commonTypes';

export const UnreadMessagesContext = createContext<UnreadMessagesContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
});

interface UnreadMessagesProviderProps {
  children: ReactNode;
}

export const UnreadMessagesProvider: React.FC<UnreadMessagesProviderProps> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem('newMessages');
        const newMessages = storedMessages ? JSON.parse(storedMessages) : {};
        const count = Object.values(newMessages).reduce(
          (total: number, num: any) => total + num,
          0
        );
        setUnreadCount(count);
      } catch (error) {
        console.log('Error loading unread messages count', error);
      }
    };
    loadUnreadCount();
  }, []);

  const value = useMemo(() => ({ unreadCount, setUnreadCount }), [unreadCount, setUnreadCount]);

  return <UnreadMessagesContext.Provider value={value}>{children}</UnreadMessagesContext.Provider>;
};
