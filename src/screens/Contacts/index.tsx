import React, { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Users: undefined;
  Chat: { id: string; chatName: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const navigation = useNavigation<NavigationProp>();
import ContactRow from '@components/ContactRow';
import { auth, database } from '@config/firebase';
import { styles } from './styles';
import { Contact } from './helpers';
import { useTheme } from '@/contexts/ThemeContext';

const Contacts = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!auth.currentUser?.email) return;

      try {
        const userRef = doc(database, 'users', auth.currentUser.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const following = userData.following || [];
          setFollowingUsers(following);
        }

        const usersRef = collection(database, 'users');
        const q = query(usersRef, where('email', '!=', auth.currentUser.email));
        const querySnapshot = await getDocs(q);

        const contactsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isFollowing: followingUsers.includes(doc.id),
        }));

        setContacts(contactsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const createOrGetChatId = (contactEmail: string) => {
    // Todo
    // This should be implemented to check if a chat exists between the users
    // and return the chatId, or create a new chat if none exists
    // For now, returning a placeholder
    return 'placeholder-chat-id';
  };

  const toggleFollow = async (contactEmail: string) => {
    if (!auth.currentUser?.email) return;

    try {
      const userRef = doc(database, 'users', auth.currentUser.email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const following = userData.following || [];

        let updatedFollowing;
        if (following.includes(contactEmail)) {
          updatedFollowing = following.filter((email: string) => email !== contactEmail);
        } else {
          updatedFollowing = [...following, contactEmail];
        }

        await updateDoc(userRef, {
          following: updatedFollowing,
        });

        setFollowingUsers(updatedFollowing);
        setContacts(
          contacts.map((contact) =>
            contact.id === contactEmail
              ? { ...contact, isFollowing: !contact.isFollowing }
              : contact
          )
        );
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const navigateToChat = (contact) => {
    navigation.navigate(
      'Chat' as never,
      {
        id: createOrGetChatId(contact.email),
        chatName: contact.name || contact.email,
      } as never
    );
  };

  const filteredContacts = contacts.filter((contact) => {
    const name = contact.name || '';
    const email = contact.email || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
  });

  const followedContacts = contacts.filter((contact) => contact.isFollowing);

  const renderContactItem = ({ item }) => (
    <ContactRow
      name={item.name || item.email}
      subtitle={item.about || 'Available'}
      onPress={() => navigateToChat(item)}
      style={{ backgroundColor: colors.background }}
      showForwardIcon={false}
      rightComponent={
        <TouchableOpacity
          onPress={() => toggleFollow(item.id)}
          style={[
            styles.followButton,
            item.isFollowing
              ? { backgroundColor: colors.primary }
              : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
          ]}
        >
          <Text
            style={{
              color: item.isFollowing ? 'white' : colors.primary,
              fontSize: 12,
              fontWeight: '500',
            }}
          >
            {item.isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      }
    />
  );

  const [activeTab, setActiveTab] = useState('all');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <View
          style={[styles.searchContainer, { backgroundColor: isDark ? colors.card : '#F5F5F5' }]}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search contacts..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'all' && { borderBottomColor: colors.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'all' ? colors.primary : colors.textSecondary },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'following' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab('following')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'following' ? colors.primary : colors.textSecondary },
            ]}
          >
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={activeTab === 'all' ? filteredContacts : followedContacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {activeTab === 'all' ? 'No contacts found' : 'You are not following anyone yet'}
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Users')}
      >
        <Ionicons name="person-add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Contacts;
