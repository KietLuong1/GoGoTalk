import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile, createUserWithEmailAndPassword } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Text,
  View,
  Image,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../config/constants';
import { auth, database } from '../../config/firebase';
import { RootStackParamList } from './types';
import { signupStyles } from './styles';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

interface SignUpProps {
  navigation: SignUpScreenNavigationProp;
}

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const onHandleSignup = () => {
    if (email === '' || password === '' || username === '') {
      Alert.alert('Registration error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Registration error', 'Passwords do not match');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        updateProfile(cred.user, { displayName: username }).then(() => {
          if (cred.user.email) {
            setDoc(doc(database, 'users', cred.user.email), {
              id: cred.user.uid,
              email: cred.user.email,
              name: cred.user.displayName,
              about: 'Available',
            });
          } else {
            console.error('User email is null');
          }
        });
        console.log(`Signup success: ${cred.user.email}`);
      })
      .catch((err) => Alert.alert('Signup error', err.message));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <SafeAreaView style={signupStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={signupStyles.keyboardAvoidingView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={signupStyles.headerContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={signupStyles.logo}
              resizeMode="contain"
            />
            <Text style={signupStyles.title}>Create Account</Text>
            <Text style={signupStyles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={signupStyles.formContainer}>
            <View
              style={[
                signupStyles.inputContainer,
                isUsernameFocused && signupStyles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={isUsernameFocused ? colors.primary : '#AEAEAE'}
              />
              <TextInput
                style={signupStyles.input}
                placeholder="Full Name"
                placeholderTextColor="#AEAEAE"
                autoCapitalize="words"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
              />
            </View>

            <View
              style={[
                signupStyles.inputContainer,
                isEmailFocused && signupStyles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={22}
                color={isEmailFocused ? colors.primary : '#AEAEAE'}
              />
              <TextInput
                style={signupStyles.input}
                placeholder="Email"
                placeholderTextColor="#AEAEAE"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
            </View>

            <View
              style={[
                signupStyles.inputContainer,
                isPasswordFocused && signupStyles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={isPasswordFocused ? colors.primary : '#AEAEAE'}
              />
              <TextInput
                style={signupStyles.input}
                placeholder="Password"
                placeholderTextColor="#AEAEAE"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={signupStyles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#AEAEAE"
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                signupStyles.inputContainer,
                isConfirmPasswordFocused && signupStyles.inputContainerFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={isConfirmPasswordFocused ? colors.primary : '#AEAEAE'}
              />
              <TextInput
                style={signupStyles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#AEAEAE"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={toggleConfirmPasswordVisibility}
                style={signupStyles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#AEAEAE"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={signupStyles.signupButton}
              onPress={onHandleSignup}
              activeOpacity={0.8}
            >
              <Text style={signupStyles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={signupStyles.orContainer}>
              <View style={signupStyles.orLine} />
              <Text style={signupStyles.orText}>OR</Text>
              <View style={signupStyles.orLine} />
            </View>

            <View style={signupStyles.socialButtonsContainer}>
              <TouchableOpacity style={signupStyles.socialButton} activeOpacity={0.8}>
                <Ionicons name="logo-google" size={24} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity style={signupStyles.socialButton} activeOpacity={0.8}>
                <Ionicons name="logo-apple" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity style={signupStyles.socialButton} activeOpacity={0.8}>
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={signupStyles.footerContainer}>
            <Text style={signupStyles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={signupStyles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
