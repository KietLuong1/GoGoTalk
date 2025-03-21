import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, database } from '@config/firebase';
import { accountStyles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/config/constants';

const Account = () => {
  const [privateAccount, setPrivateAccount] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [autoDownload, setAutoDownload] = useState(true);

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log('Error logging out: ', error));
  };

  const deleteAccount = () => {
    const currentUser = auth?.currentUser;
    if (currentUser?.email) {
      deleteUser(currentUser).catch((error) => console.log('Error deleting: ', error));
      deleteDoc(doc(database, 'users', currentUser.email));
    }
  };

  return (
    <SafeAreaView style={accountStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={accountStyles.section}>
          <Text style={accountStyles.sectionTitle}>Privacy</Text>

          <View style={accountStyles.card}>
            <View style={accountStyles.settingRow}>
              <View style={accountStyles.settingLeft}>
                <View style={[accountStyles.settingIcon, { backgroundColor: '#E9F5FF' }]}>
                  <Ionicons name="lock-closed" size={20} color="#2196F3" />
                </View>
                <View>
                  <Text style={accountStyles.settingText}>Private Account</Text>
                  <Text style={accountStyles.settingSubtext}>
                    Only approved followers can see your chats
                  </Text>
                </View>
              </View>
              <Switch
                value={privateAccount}
                onValueChange={setPrivateAccount}
                trackColor={{ false: '#D9D9D9', true: '#BDE3FF' }}
                thumbColor={privateAccount ? colors.primary : '#F4F4F4'}
              />
            </View>

            <View style={accountStyles.divider} />

            <View style={accountStyles.settingRow}>
              <View style={accountStyles.settingLeft}>
                <View style={[accountStyles.settingIcon, { backgroundColor: '#FFF0EB' }]}>
                  <Ionicons name="checkmark-done" size={20} color="#FF7043" />
                </View>
                <View>
                  <Text style={accountStyles.settingText}>Read Receipts</Text>
                  <Text style={accountStyles.settingSubtext}>
                    Let others know when you've read their message
                  </Text>
                </View>
              </View>
              <Switch
                value={readReceipts}
                onValueChange={setReadReceipts}
                trackColor={{ false: '#D9D9D9', true: '#FFD4C8' }}
                thumbColor={readReceipts ? '#FF7043' : '#F4F4F4'}
              />
            </View>
          </View>
        </View>

        <View style={accountStyles.section}>
          <Text style={accountStyles.sectionTitle}>Media</Text>

          <View style={accountStyles.card}>
            <View style={accountStyles.settingRow}>
              <View style={accountStyles.settingLeft}>
                <View style={[accountStyles.settingIcon, { backgroundColor: '#E6F4EA' }]}>
                  <Ionicons name="cloud-download" size={20} color="#4CAF50" />
                </View>
                <View>
                  <Text style={accountStyles.settingText}>Auto-download Media</Text>
                  <Text style={accountStyles.settingSubtext}>
                    Download images and videos automatically
                  </Text>
                </View>
              </View>
              <Switch
                value={autoDownload}
                onValueChange={setAutoDownload}
                trackColor={{ false: '#D9D9D9', true: '#C8E6C9' }}
                thumbColor={autoDownload ? '#4CAF50' : '#F4F4F4'}
              />
            </View>
          </View>
        </View>

        <View style={accountStyles.section}>
          <Text style={accountStyles.sectionTitle}>Manage</Text>

          <View style={accountStyles.card}>
            <TouchableOpacity
              style={accountStyles.menuItem}
              onPress={() => Alert.alert('Blocked Users', 'Coming soon')}
            >
              <View style={[accountStyles.settingIcon, { backgroundColor: '#EBF0FF' }]}>
                <Ionicons name="close-circle" size={20} color="#5C6BC0" />
              </View>
              <Text style={accountStyles.menuText}>Blocked Users</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <View style={accountStyles.divider} />

            <TouchableOpacity
              style={accountStyles.menuItem}
              onPress={() => {
                Alert.alert(
                  'Delete Account',
                  'Are you sure you want to delete your account? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: deleteAccount,
                    },
                  ]
                );
              }}
            >
              <View style={[accountStyles.settingIcon, { backgroundColor: '#FBE9E7' }]}>
                <Ionicons name="trash" size={20} color={colors.red} />
              </View>
              <Text style={[accountStyles.menuText, { color: colors.red }]}>Delete My Account</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={accountStyles.logoutButton}
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Logout',
                style: 'destructive',
                onPress: onSignOut,
              },
            ]);
          }}
        >
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={accountStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;
