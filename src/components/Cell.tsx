import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

interface CellProps {
  title: string;
  icon: string;
  iconColor?: string;
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  secondIcon?: string;
  subtitle?: string;
  showForwardIcon?: boolean;
}

const Cell: React.FC<CellProps> = ({
  title,
  icon,
  iconColor = 'white',
  tintColor,
  style,
  onPress,
  secondIcon,
  subtitle,
  showForwardIcon = true,
}) => (
  <TouchableOpacity style={[styles.cell, style]} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: tintColor }]}>
      <Ionicons name={icon as any} size={24} color={iconColor} style={{ marginStart: 4 }} />
    </View>

    <View style={styles.textsContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    {showForwardIcon && (
      <Ionicons name={(secondIcon ?? 'chevron-forward-outline') as any} size={20} />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  iconContainer: {
    alignContent: 'center',
    borderRadius: 6,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  subtitle: {
    color: '#565656',
  },
  textsContainer: {
    flex: 1,
    marginStart: 8,
  },
  title: {
    fontSize: 16,
  },
});

export default Cell;
