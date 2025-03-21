import React from 'react';
import { Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../config/constants';

interface WelcomeButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'text';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const WelcomeButton: React.FC<WelcomeButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.button,
    variant === 'outline' && styles.outlineButton,
    variant === 'text' && styles.textButton,
    style,
  ];

  const textStyles = [
    styles.buttonText,
    variant === 'outline' && styles.outlineButtonText,
    variant === 'text' && styles.textButtonText,
    textStyle,
  ];

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} activeOpacity={0.8}>
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: 'transparent',
    elevation: 0,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    shadowColor: 'transparent',
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: colors.primary,
  },
  textButtonText: {
    color: colors.primary,
  },
});

export default WelcomeButton;
