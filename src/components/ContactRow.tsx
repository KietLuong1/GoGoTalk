import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import { colors as constantColors } from '@config/constants';
import { useTheme } from '@/contexts/ThemeContext';

interface ContactRowProps {
  name: string;
  subtitle: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  onLongPress?: () => void;
  selected?: boolean;
  showForwardIcon?: boolean;
  subtitle2?: string;
  newMessageCount?: number;
  rightComponent?: React.ReactNode; // New prop for custom right component
}

const ContactRow: React.FC<ContactRowProps> = ({
  name,
  subtitle,
  onPress,
  style,
  onLongPress,
  selected,
  showForwardIcon = true,
  subtitle2,
  newMessageCount = 0,
  rightComponent,
}) => {
  const { colors, isDark } = useTheme();

  const getAvatarColor = (name: string): string => {
    const colorPalette = [
      '#7E57C2',
      '#EC407A',
      '#26A69A',
      '#42A5F5',
      '#FFA726',
      '#78909C',
      '#5C6BC0',
    ];
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalette[sum % colorPalette.length];
  };

  const avatarColor = getAvatarColor(name);

  return (
    <TouchableOpacity
      style={[
        styles.row,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarLabel}>{name.trim().charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.textsContainer}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>

      <View style={styles.rightContainer}>
        {rightComponent || (
          <>
            <Text style={[styles.subtitle2, { color: colors.textSecondary }]}>{subtitle2}</Text>

            {newMessageCount > 0 && (
              <View style={styles.newMessageBadge}>
                <Text style={styles.newMessageText}>{newMessageCount}</Text>
              </View>
            )}

            {selected && (
              <View style={styles.overlay}>
                <Ionicons name="checkmark-outline" size={16} color="white" />
              </View>
            )}

            {showForwardIcon && (
              <Ionicons name="chevron-forward-outline" size={20} color={colors.textSecondary} />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarLabel: {
    color: 'white',
    fontSize: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  newMessageBadge: {
    alignItems: 'center',
    backgroundColor: constantColors.teal,
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newMessageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: constantColors.teal,
    borderColor: 'black',
    borderRadius: 11,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 22,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    maxWidth: 200,
  },
  subtitle2: {
    fontSize: 12,
    marginBottom: 4,
  },
  textsContainer: {
    flex: 1,
    marginStart: 16,
  },
});

export default ContactRow;
