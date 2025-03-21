// Create this file: src/screens/Chat/ChatInfoWrapper.tsx
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import ChatInfo from './ChatInfo';
import { ChatInfoRouteParams } from './types';

type ChatInfoScreenRouteProp = RouteProp<
  {
    ChatInfo: ChatInfoRouteParams;
  },
  'ChatInfo'
>;

const ChatInfoWrapper = () => {
  const route = useRoute<ChatInfoScreenRouteProp>();
  return <ChatInfo route={{ params: route.params }} />;
};

export default ChatInfoWrapper;
