import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Text,
  View,
  Alert,
  Image,
  Switch,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { auth, database } from '@config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { profileStyles } from './styles';
import { getDynamicStyles, getRandomColor } from './helpers';
import { useTheme } from '@/contexts/ThemeContext';

const Profile = () => {
  const { colors, isDark, setTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(auth?.currentUser?.displayName || '');
  const [bio, setBio] = useState('Available');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const initials = auth?.currentUser?.displayName
    ? auth.currentUser.displayName
        .split(' ')
        .map((name) => name[0])
        .join('')
    : auth?.currentUser?.email?.charAt(0).toUpperCase();

  const randomAvatarColor = getRandomColor(auth?.currentUser?.displayName || '');

  const handleSaveProfile = async () => {
    try {
      if (auth?.currentUser?.email) {
        await updateDoc(doc(database, 'users', auth.currentUser.email), {
          name,
          about: bio,
        });

        Alert.alert('Success', 'Profile updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleDarkModeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <SafeAreaView style={[profileStyles.container, getDynamicStyles(colors, isDark).container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={profileStyles.keyboardAvoidingView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={[profileStyles.header, getDynamicStyles(colors, isDark).header]}>
            <View style={[profileStyles.avatar, { backgroundColor: randomAvatarColor }]}>
              <Text style={profileStyles.avatarText}>{initials}</Text>
            </View>
            <TouchableOpacity
              style={profileStyles.editAvatarButton}
              onPress={() => Alert.alert('Feature', 'Change profile picture coming soon')}
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>

            <Text style={[profileStyles.name, getDynamicStyles(colors, isDark).name]}>
              {editing ? (
                <TextInput
                  style={[
                    profileStyles.nameInput,
                    { color: colors.text, borderBottomColor: colors.primary },
                  ]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textSecondary}
                />
              ) : (
                name || 'No Name Set'
              )}
            </Text>
            <Text style={[profileStyles.email, getDynamicStyles(colors, isDark).email]}>
              {auth?.currentUser?.email}
            </Text>
          </View>

          {/* Main Content */}
          <View style={profileStyles.content}>
            <View style={profileStyles.section}>
              <View style={profileStyles.sectionHeader}>
                <Text
                  style={[
                    profileStyles.sectionTitle,
                    getDynamicStyles(colors, isDark).sectionTitle,
                  ]}
                >
                  Account
                </Text>
                {!editing ? (
                  <TouchableOpacity onPress={() => setEditing(true)}>
                    <Ionicons name="pencil" size={20} color={colors.primary} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleSaveProfile}>
                    <Text style={[profileStyles.saveButton, { color: colors.primary }]}>Save</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={[profileStyles.infoCard, getDynamicStyles(colors, isDark).infoCard]}>
                <View style={profileStyles.infoRow}>
                  <View style={profileStyles.infoIconContainer}>
                    <Ionicons name="person" size={20} color={colors.primary} />
                  </View>
                  <View style={profileStyles.infoContent}>
                    <Text
                      style={[profileStyles.infoLabel, getDynamicStyles(colors, isDark).infoLabel]}
                    >
                      Name
                    </Text>
                    {editing ? (
                      <TextInput
                        style={[
                          profileStyles.infoInput,
                          { color: colors.text, borderBottomColor: colors.primary },
                        ]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.textSecondary}
                      />
                    ) : (
                      <Text
                        style={[
                          profileStyles.infoValue,
                          getDynamicStyles(colors, isDark).infoValue,
                        ]}
                      >
                        {name || 'No Name Set'}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={[profileStyles.divider, { backgroundColor: colors.border }]} />

                <View style={profileStyles.infoRow}>
                  <View style={profileStyles.infoIconContainer}>
                    <Ionicons name="mail" size={20} color={colors.primary} />
                  </View>
                  <View style={profileStyles.infoContent}>
                    <Text
                      style={[profileStyles.infoLabel, getDynamicStyles(colors, isDark).infoLabel]}
                    >
                      Email
                    </Text>
                    <Text
                      style={[profileStyles.infoValue, getDynamicStyles(colors, isDark).infoValue]}
                    >
                      {auth?.currentUser?.email}
                    </Text>
                  </View>
                </View>

                <View style={[profileStyles.divider, { backgroundColor: colors.border }]} />

                <View style={profileStyles.infoRow}>
                  <View style={profileStyles.infoIconContainer}>
                    <Ionicons name="information-circle" size={20} color={colors.primary} />
                  </View>
                  <View style={profileStyles.infoContent}>
                    <Text
                      style={[profileStyles.infoLabel, getDynamicStyles(colors, isDark).infoLabel]}
                    >
                      Bio
                    </Text>
                    {editing ? (
                      <TextInput
                        style={[
                          profileStyles.infoInput,
                          { color: colors.text, borderBottomColor: colors.primary },
                        ]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Enter your bio"
                        placeholderTextColor={colors.textSecondary}
                        multiline
                      />
                    ) : (
                      <Text
                        style={[
                          profileStyles.infoValue,
                          getDynamicStyles(colors, isDark).infoValue,
                        ]}
                      >
                        {bio}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View style={profileStyles.section}>
              <Text
                style={[profileStyles.sectionTitle, getDynamicStyles(colors, isDark).sectionTitle]}
              >
                Preferences
              </Text>
              <View
                style={[profileStyles.preferencesCard, getDynamicStyles(colors, isDark).infoCard]}
              >
                <View style={profileStyles.preferenceRow}>
                  <View style={profileStyles.preferenceLeft}>
                    <View
                      style={[
                        profileStyles.preferenceIcon,
                        { backgroundColor: isDark ? '#0F3559' : '#E9F5FF' },
                      ]}
                    >
                      <Ionicons name="notifications" size={20} color={colors.primary} />
                    </View>
                    <Text style={[profileStyles.preferenceText, { color: colors.text }]}>
                      Notifications
                    </Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{
                      false: isDark ? '#3D3D3D' : '#D9D9D9',
                      true: isDark ? '#3065A3' : '#BDE3FF',
                    }}
                    thumbColor={notificationsEnabled ? colors.primary : isDark ? '#666' : '#F4F4F4'}
                  />
                </View>

                <View style={[profileStyles.divider, { backgroundColor: colors.border }]} />

                <View style={profileStyles.preferenceRow}>
                  <View style={profileStyles.preferenceLeft}>
                    <View
                      style={[
                        profileStyles.preferenceIcon,
                        { backgroundColor: isDark ? '#321F5E' : '#F0EBFF' },
                      ]}
                    >
                      <Ionicons name="moon" size={20} color={isDark ? '#9C7EF1' : '#7E57C2'} />
                    </View>
                    <Text style={[profileStyles.preferenceText, { color: colors.text }]}>
                      Dark Mode
                    </Text>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={handleDarkModeToggle}
                    trackColor={{
                      false: isDark ? '#3D3D3D' : '#D9D9D9',
                      true: isDark ? '#463B6A' : '#D6C8FF',
                    }}
                    thumbColor={isDark ? '#9C7EF1' : '#7E57C2'}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={profileStyles.logoutButton}
              onPress={() =>
                Alert.alert('Logout', 'Are you sure you want to logout?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => auth.signOut(),
                  },
                ])
              }
            >
              <Ionicons name="log-out" size={20} color="white" />
              <Text style={profileStyles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
