import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  doc,
  where,
  query,
  setDoc,
  orderBy,
  deleteDoc,
  collection,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import {
  Text,
  View,
  Alert,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { colors } from '../../config/constants';
import { auth, database } from '../../config/firebase';
import { ChatsProps } from './types';

const Chats = ({ setUnreadCount }: ChatsProps) => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newMessages, setNewMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      // Load unread messages from AsyncStorage when screen is focused
      const loadNewMessages = async () => {
        try {
          const storedMessages = await AsyncStorage.getItem('newMessages');
          const parsedMessages = storedMessages ? JSON.parse(storedMessages) : {};
          setNewMessages(parsedMessages);
          setUnreadCount(Object.values(parsedMessages).reduce((total, num) => total + num, 0));
        } catch (error) {
          console.log('Error loading new messages from storage', error);
        }
      };

      // Set up Firestore listener for chat updates
      const collectionRef = collection(database, 'chats');
      const q = query(
        collectionRef,
        where('users', 'array-contains', {
          email: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          deletedFromChat: false,
        }),
        orderBy('lastUpdated', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setChats(snapshot?.docs);
        setLoading(false);

        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const chatId = change.doc.id;
            const { messages } = change.doc.data();
            const firstMessage = messages[0];

            // Increase unread count if the first message is from someone else
            if (firstMessage.user._id !== auth?.currentUser?.email) {
              setNewMessages((prev) => {
                const updatedMessages = { ...prev, [chatId]: (prev[chatId] || 0) + 1 };
                AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
                setUnreadCount(
                  Object.values(updatedMessages).reduce((total, num) => total + num, 0)
                );
                return updatedMessages;
              });
            }
          }
        });
      });

      // Load unread messages and start listener when screen is focused
      loadNewMessages();

      // Clean up listener on focus change
      return () => unsubscribe();
    }, [setUnreadCount])
  );

  const handleChatName = (chat) => {
    const { users } = chat.data();
    const currentUser = auth?.currentUser;

    if (chat.data().groupName) {
      return chat.data().groupName;
    }

    if (currentUser?.displayName) {
      return users[0].name === currentUser.displayName ? users[1].name : users[0].name;
    }

    if (currentUser?.email) {
      return users[0].email === currentUser.email ? users[1].email : users[0].email;
    }

    return '~ No Name or Email ~';
  };

  const filteredChats = chats.filter((chat) => {
    const chatName = handleChatName(chat).toLowerCase();
    return chatName.includes(searchQuery.toLowerCase());
  });

  const handleOnPress = async (chat) => {
    const chatId = chat.id;
    if (selectedItems.length) {
      return selectItems(chat);
    }
    setNewMessages((prev) => {
      const updatedMessages = { ...prev, [chatId]: 0 };
      AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
      setUnreadCount(Object.values(updatedMessages).reduce((total, num) => total + num, 0));
      return updatedMessages;
    });
    navigation.navigate('Chat', { id: chat.id, chatName: handleChatName(chat) });
    return null;
  };

  const handleLongPress = (chat) => {
    selectItems(chat);
  };

  const selectItems = (chat) => {
    if (selectedItems.includes(chat.id)) {
      setSelectedItems(selectedItems.filter((item) => item !== chat.id));
    } else {
      setSelectedItems([...selectedItems, chat.id]);
    }
  };

  const getSelected = (chat) => selectedItems.includes(chat.id);

  const deSelectItems = useCallback(() => {
    setSelectedItems([]); // Clear the selected items
  }, []); // Empty dependency array, since this doesn't rely on any state or props

  const handleFabPress = () => {
    navigation.navigate('Users');
  };

  const handleDeleteChat = useCallback(() => {
    Alert.alert(
      selectedItems.length > 1 ? 'Delete selected chats?' : 'Delete this chat?',
      'Messages will be removed from this device.',
      [
        {
          text: 'Delete chat',
          onPress: () => {
            selectedItems.forEach((chatId) => {
              const chat = chats.find((c) => c.id === chatId);
              const updatedUsers = chat
                .data()
                .users.map((user) =>
                  user.email === auth?.currentUser?.email
                    ? { ...user, deletedFromChat: true }
                    : user
                );

              setDoc(doc(database, 'chats', chatId), { users: updatedUsers }, { merge: true });

              const deletedUsers = updatedUsers.filter((user) => user.deletedFromChat).length;
              if (deletedUsers === updatedUsers.length) {
                deleteDoc(doc(database, 'chats', chatId));
              }
            });
            deSelectItems();
          },
        },
        { text: 'Cancel' },
      ],
      { cancelable: true }
    );
  }, [selectedItems, chats, deSelectItems]); // Memoize based on these dependencies

  const handleClearChatHistory = useCallback(() => {
    if (selectedItems.length === 0) return;

    Alert.alert(
      selectedItems.length > 1 ? 'Clear selected chat histories?' : 'Clear chat history?',
      'All messages will be removed, but the chat will remain.',
      [
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            selectedItems.forEach(async (chatId) => {
              const chatRef = doc(database, 'chats', chatId);
              const chatDoc = await getDoc(chatRef);

              if (chatDoc.exists()) {
                // Keep the chat but remove all messages
                await setDoc(
                  chatRef,
                  {
                    messages: [],
                    lastUpdated: Date.now(),
                  },
                  { merge: true }
                );

                // Also clear unread message count for this chat
                setNewMessages((prev) => {
                  const updatedMessages = { ...prev, [chatId]: 0 };
                  AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
                  setUnreadCount(
                    Object.values(updatedMessages).reduce((total, num) => total + num, 0) as number
                  );
                  return updatedMessages;
                });
              }
            });
            deSelectItems();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }, [selectedItems, deSelectItems, setNewMessages, setUnreadCount]);
  const updateNavigationOptions = useCallback(() => {
    if (selectedItems.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.headerButton} onPress={handleClearChatHistory}>
              <Ionicons name="trash-bin-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleDeleteChat}>
              <Ionicons name="trash" size={22} color={colors.red} />
            </TouchableOpacity>
          </View>
        ),
        headerLeft: () => <Text style={styles.itemCount}>{selectedItems.length}</Text>,
      });
    } else {
      navigation.setOptions({
        headerRight: null,
        headerLeft: null,
      });
    }
  }, [selectedItems, navigation, handleDeleteChat, handleClearChatHistory]);

  useEffect(() => {
    updateNavigationOptions();
  }, [selectedItems, updateNavigationOptions]);

  const handleSubtitle = (chat) => {
    const message = chat.data().messages[0];
    if (!message) return 'No messages yet';

    const isCurrentUser = auth?.currentUser?.email === message.user._id;
    const userName = isCurrentUser ? 'You' : message.user.name.split(' ')[0];
    let messageText;
    if (message.image) {
      messageText = 'sent an image';
    } else if (message.text.length > 20) {
      messageText = `${message.text.substring(0, 20)}...`;
    } else {
      messageText = message.text;
    }

    return `${userName}: ${messageText}`;
  };

  const handleSubtitle2 = (chat) => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(chat.data().lastUpdated).toLocaleTimeString(undefined, options);
  };

  const getRandomColor = (name) => {
    const colors = ['#7E57C2', '#EC407A', '#26A69A', '#42A5F5', '#FFA726', '#78909C', '#5C6BC0'];
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#A0A0A0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <Pressable style={styles.content} onPress={deSelectItems}>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loadingContainer} />
        ) : (
          <ScrollView>
            {filteredChats.length === 0 ? (
              <View style={styles.blankContainer}>
                <Text style={styles.textContainer}>No conversations yet</Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Recent Messages</Text>
                {filteredChats.map((chat) => {
                  const chatName = handleChatName(chat);
                  const avatarColor = getRandomColor(chatName);

                  return (
                    <TouchableOpacity
                      key={chat.id}
                      style={[styles.chatItem, getSelected(chat) && styles.selectedChatItem]}
                      onPress={() => handleOnPress(chat)}
                      onLongPress={() => handleLongPress(chat)}
                    >
                      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
                        <Text style={styles.avatarText}>{chatName.charAt(0).toUpperCase()}</Text>
                        {newMessages[chat.id] > 0 && (
                          <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{newMessages[chat.id]}</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.chatDetails}>
                        <View style={styles.topRow}>
                          <Text style={styles.nameText} numberOfLines={1}>
                            {chatName}
                          </Text>
                          <Text style={styles.timeText}>{handleSubtitle2(chat)}</Text>
                        </View>
                        <View style={styles.bottomRow}>
                          <Text style={styles.messageText} numberOfLines={1}>
                            {handleSubtitle(chat)}
                          </Text>
                          {getSelected(chat) && (
                            <Ionicons name="checkmark-circle" size={20} color={colors.teal} />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                <Ionicons name="lock-open" size={12} style={{ color: '#565656' }} />
                Your personal messages are not
                <Text style={{ color: colors.teal }}> end-to-end-encrypted</Text>
              </Text>
            </View>
          </ScrollView>
        )}
      </Pressable>

      <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
        <Ionicons name="chatbox-ellipses" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 16,
    padding: 6,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    borderRadius: 24,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginBottom: 1,
  },
  selectedChatItem: {
    backgroundColor: '#F0F0F0',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.teal,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  messageText: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
    marginRight: 8,
  },
  blankContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 120,
  },
  textContainer: {
    fontSize: 16,
    color: '#757575',
  },
  footer: {
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCount: {
    color: colors.teal,
    fontSize: 18,
    fontWeight: '400',
    left: 16,
  },
  trashBin: {
    marginRight: 16,
  },
});

Chats.propTypes = {
  setUnreadCount: PropTypes.func,
};

export default Chats;
