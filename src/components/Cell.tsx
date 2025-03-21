import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { colors } from '@config/constants';

interface CellProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: string;
  tintColor?: string;
  style?: StyleProp<ViewStyle>;
  showForwardIcon?: boolean;
  iconColor?: string;
  textColor?: string;
  subtitleColor?: string;
}

const Cell: React.FC<CellProps> = ({
  title,
  subtitle,
  onPress,
  icon,
  tintColor,
  style,
  showForwardIcon = true,
  iconColor = 'black',
  textColor = 'black',
  subtitleColor = 'gray',
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: 'white',
          borderBottomColor: '#e3e3e3',
          borderBottomWidth: 0.5,
          padding: 16,
        },
        style,
      ]}
      onPress={onPress}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        {icon ? (
          <Ionicons
            color={tintColor ?? iconColor}
            name={icon}
            style={{ marginRight: 16 }}
            size={24}
          />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text style={{ color: tintColor ?? textColor, fontSize: 16 }}>{title}</Text>
          {subtitle ? (
            <Text style={{ color: subtitleColor, fontSize: 13, marginTop: 5 }}>{subtitle}</Text>
          ) : null}
        </View>

        {showForwardIcon && <Ionicons color="gray" name="chevron-forward-outline" size={18} />}
      </View>
    </TouchableOpacity>
  );
};

export default Cell;
