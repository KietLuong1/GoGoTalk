import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary';
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', onPress }) => (
  <TouchableOpacity
    style={[
      styles.buttonContainer,
      { backgroundColor: variant === 'primary' ? 'black' : 'transparent' },
      { paddingHorizontal: variant === 'primary' ? 18 : 0 },
    ]}
    onPress={onPress}
  >
    <Text style={[styles.buttonLabel, { color: variant === 'primary' ? 'white' : 'black' }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 6,
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 18,
  },
});

export default Button;
