import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { colors } from '../config/constants';

interface ChatHeaderProps {
  chatName: string;
  chatId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatName, chatId }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('ChatInfo' as never, { chatId, chatName } as never)}
    >
      <TouchableOpacity
        style={styles.avatar}
        onPress={() => navigation.navigate('ChatInfo' as never, { chatId, chatName } as never)}
      >
        <View>
          <Text style={styles.avatarLabel}>
            {chatName.split(' ').reduce((prev, current) => `${prev}${current[0]}`, '')}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.chatName}>{chatName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginLeft: -30,
    marginRight: 10,
    width: 40,
  },
  avatarLabel: {
    color: 'white',
    fontSize: 20,
  },
  chatName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});

export default ChatHeader;
