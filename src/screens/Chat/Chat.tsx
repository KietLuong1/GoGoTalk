import PropTypes from 'prop-types';
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import EmojiModal from 'react-native-emoji-modal';
import React, { useState, useEffect, useCallback } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import {
  Send,
  Bubble,
  GiftedChat,
  InputToolbar,
  Day,
  Time,
  IMessage,
} from 'react-native-gifted-chat';
import { RouteProp } from '@react-navigation/native';
import { ref, getStorage, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {
  View,
  Text,
  Keyboard,
  BackHandler,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { colors } from '../../config/constants';
import { auth, database } from '../../config/firebase';
import { ChatParams } from './types';
import { chatStyles } from './styles';

const Chat = ({ route }: { route: RouteProp<ChatParams, 'Chat'> }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(database, 'chats', route.params.id), (document) => {
      setMessages(
        document
          ?.data()
          ?.messages.map((message: { createdAt: { toDate: () => any }; image: any }) => ({
            ...message,
            createdAt: message.createdAt.toDate(),
            image: message.image ?? '',
          }))
      );
    });

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Keyboard.dismiss();
      if (modal) {
        setModal(false);
        return true;
      }
      return false;
    });

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      if (modal) setModal(false);
    });

    return () => {
      unsubscribe();
      backHandler.remove();
      keyboardDidShowListener.remove();
    };
  }, [route.params.id, modal]);

  const onSend = useCallback(
    async (m: IMessage[] = []) => {
      const chatDocRef = doc(database, 'chats', route.params.id);
      const chatDocSnap = await getDoc(chatDocRef);

      const chatData = chatDocSnap.data();
      const data = chatData?.messages.map(
        (message: { createdAt: { toDate: () => any }; image: any }) => ({
          ...message,
          createdAt: message.createdAt.toDate(),
          image: message.image ?? '',
        })
      );

      const messagesWillSend = m?.[0] ? [{ ...m[0], sent: true, received: false }] : [];
      const chatMessages = GiftedChat.append(data as IMessage[], messagesWillSend);

      setDoc(
        doc(database, 'chats', route.params.id),
        {
          messages: chatMessages,
          lastUpdated: Date.now(),
        },
        { merge: true }
      );
    },
    [route.params.id]
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImageAsync(result.assets[0].uri);
    }
  };

  const uploadImageAsync = async (uri: string) => {
    setUploading(true);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const randomString = uuid.v4();
    const fileRef = ref(getStorage(), randomString);
    const uploadTask = uploadBytesResumable(fileRef, blob as any);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        onSend([
          {
            _id: randomString,
            createdAt: new Date(),
            text: '',
            image: downloadUrl,
            user: {
              _id: auth?.currentUser?.email || '',
              name: auth?.currentUser?.displayName || '',
              avatar: 'https://i.pravatar.cc/300',
            },
          } as IMessage,
        ]);
      }
    );
  };

  const handleEmojiPanel = useCallback(() => {
    setModal((prevModal) => {
      if (prevModal) {
        Keyboard.dismiss();
        return false;
      }
      Keyboard.dismiss();
      return true;
    });
  }, []);

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#F0F0F0',
          borderRadius: 16,
          marginBottom: 4,
          paddingHorizontal: 2,
        },
        right: {
          backgroundColor: colors.primary,
          borderRadius: 16,
          marginBottom: 4,
          paddingHorizontal: 2,
        },
      }}
      textStyle={{
        left: {
          color: '#333',
        },
        right: {
          color: 'white',
        },
      }}
    />
  );

  const renderDay = (props: any) => (
    <Day
      {...props}
      wrapperStyle={{
        backgroundColor: '#E0E0E0',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginVertical: 16,
      }}
      textStyle={{
        color: '#666',
        fontSize: 12,
      }}
    />
  );

  const renderTime = (props: any) => (
    <Time
      {...props}
      timeTextStyle={{
        left: {
          color: '#999',
          fontSize: 10,
        },
        right: {
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 10,
        },
      }}
    />
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={chatStyles.inputToolbar}
      primaryStyle={chatStyles.inputPrimary}
      renderActions={() => (
        <View style={chatStyles.actionsContainer}>
          <TouchableOpacity style={chatStyles.iconButton} onPress={handleEmojiPanel}>
            <Ionicons name="happy-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={chatStyles.iconButton} onPress={pickImage}>
            <Ionicons name="attach-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props} containerStyle={chatStyles.sendContainer}>
      <View style={chatStyles.sendButton}>
        <Ionicons name="send" size={20} color="white" />
      </View>
    </Send>
  );

  const renderLoading = () => (
    <View style={chatStyles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <View style={chatStyles.container}>
      {uploading && (
        <View style={chatStyles.uploadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={chatStyles.uploadingText}>Uploading image...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={chatStyles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={(messagesArr) => onSend(messagesArr)}
          user={{
            _id: auth?.currentUser?.email,
            name: auth?.currentUser?.displayName,
            avatar: 'https://i.pravatar.cc/300',
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          renderDay={renderDay}
          renderTime={renderTime}
          renderLoading={renderLoading}
          showAvatarForEveryMessage={false}
          showUserAvatar={false}
          alwaysShowSend
          scrollToBottom
          scrollToBottomStyle={chatStyles.scrollToBottomButton}
          renderUsernameOnMessage
          minInputToolbarHeight={60}
          maxComposerHeight={80}
          bottomOffset={Platform.OS === 'ios' ? 34 : 0}
          keyboardShouldPersistTaps="never"
          infiniteScroll
          inverted={true}
          listViewProps={{
            style: chatStyles.flatList,
            contentContainerStyle: chatStyles.flatListContent,
          }}
          timeFormat="HH:mm"
          dateFormat="MMMM DD, YYYY"
          renderAvatarOnTop
        />
      </KeyboardAvoidingView>

      {modal && (
        <EmojiModal
          onPressOutside={handleEmojiPanel}
          modalStyle={chatStyles.emojiModal}
          columns={8}
          emojiSize={30}
          onEmojiSelected={(emoji) => {
            onSend([
              {
                _id: uuid.v4(),
                createdAt: new Date(),
                text: emoji,
                user: {
                  _id: auth?.currentUser?.email,
                  name: auth?.currentUser?.displayName,
                  avatar: 'https://i.pravatar.cc/300',
                },
              },
            ]);
            setModal(false);
          }}
        />
      )}
    </View>
  );
};

Chat.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Chat;
