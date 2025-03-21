import React, { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, View, Linking, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';

import Cell from '@components/Cell';
import { auth } from '@config/firebase';
import { colors } from '@config/constants';
import ContactRow from '@components/ContactRow';
import { AuthenticatedUserContext } from '@contexts/AuthenticatedUserContext';
import { styles } from './styles';
import { useTheme } from '@/contexts/ThemeContext'; // Import useTheme hook

const Settings = ({ navigation }: { navigation: NativeStackNavigationProp<any> }) => {
  console.log('🚀 ~ Settings ~ AuthenticatedUserContext:', AuthenticatedUserContext);
  const { user } = useContext(AuthenticatedUserContext);
  const { colors: themeColors, isDark } = useTheme(); // Use theme colors

  async function openGithub(url: string) {
    await Linking.openURL(url);
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout?',
      'You will need to login again',
      [
        {
          text: 'Logout',
          onPress: () => {
            signOut(auth).catch((error) => console.log('Error logging out: ', error));
          },
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ContactRow
        name={user?.displayName ?? 'No name'}
        subtitle={user?.email || ''}
        style={[styles.contactRow, { backgroundColor: themeColors.card }]}
        onPress={() => {
          navigation.navigate('Profile');
        }}
      />

      <Cell
        title="Account"
        subtitle="Privacy, security settings"
        icon="key-outline"
        onPress={() => {
          navigation.navigate('Account');
        }}
        iconColor={isDark ? themeColors.text : 'black'}
        style={{ marginTop: 20, backgroundColor: themeColors.card }}
        textColor={themeColors.text}
        subtitleColor={themeColors.textSecondary}
      />

      <Cell
        title="Help"
        subtitle="Contact us, app info"
        icon="help-circle-outline"
        iconColor={isDark ? themeColors.text : 'black'}
        onPress={() => {
          navigation.navigate('Help');
        }}
        style={{ backgroundColor: themeColors.card }}
        textColor={themeColors.text}
        subtitleColor={themeColors.textSecondary}
      />

      <Cell
        title="Invite a friend"
        icon="people-outline"
        iconColor={isDark ? themeColors.text : 'black'}
        onPress={() => {
          alert('Share touched');
        }}
        showForwardIcon={false}
        style={{ backgroundColor: themeColors.card }}
        textColor={themeColors.text}
      />

      <Cell
        title="Logout"
        icon="log-out-outline"
        tintColor={colors.teal}
        onPress={handleLogout}
        showForwardIcon={false}
        style={{ marginTop: 20, backgroundColor: themeColors.card }}
        textColor={themeColors.text}
      />

      <TouchableOpacity
        style={styles.githubLink}
        onPress={() => openGithub('https://github.com/KietLuong1')}
      >
        <View style={styles.githubContainer}>
          <Ionicons name="logo-github" size={12} style={{ color: colors.teal }} />
          <Text style={{ fontSize: 12, fontWeight: '400', marginLeft: 4, color: themeColors.text }}>
            App's Github
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
