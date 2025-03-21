import { colors as constantColors } from '@/config/constants';

export function getRandomColor(name: string): string {
  const colors = [
    '#7E57C2', // Purple
    '#EC407A', // Pink
    '#26A69A', // Teal
    '#42A5F5', // Light Blue
    '#FFA726', // Orange
    '#78909C', // Blue Grey
    '#5C6BC0', // Indigo
  ];

  if (!name) return colors[0];

  // Generate a consistent color based on the name
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }

  return colors[sum % colors.length];
}

// This function now accepts color parameters and returns the dynamic styles
export const getDynamicStyles = (colors: any, isDark: boolean) => ({
  container: {
    backgroundColor: colors.card,
  },
  header: {
    backgroundColor: colors.background,
  },
  name: {
    color: colors.text,
  },
  email: {
    color: colors.textSecondary,
  },
  sectionTitle: {
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.background,
  },
  infoLabel: {
    color: colors.textSecondary,
  },
  infoValue: {
    color: colors.text,
  },
  preferenceIcon: {
    backgroundColor: isDark
      ? { notifications: '#0F3559', darkMode: '#321F5E' }
      : { notifications: '#E9F5FF', darkMode: '#F0EBFF' },
  },
  iconColor: {
    notifications: isDark ? colors.primary : '#2196F3',
    darkMode: isDark ? '#9C7EF1' : '#7E57C2',
  },
  trackColor: {
    notifications: {
      false: isDark ? '#3D3D3D' : '#D9D9D9',
      true: isDark ? '#3065A3' : '#BDE3FF',
    },
    darkMode: {
      false: isDark ? '#3D3D3D' : '#D9D9D9',
      true: isDark ? '#463B6A' : '#D6C8FF',
    },
  },
  thumbColor: {
    notifications: isDark ? colors.primary : '#2196F3',
    darkMode: isDark ? '#9C7EF1' : '#7E57C2',
  },
  divider: {
    backgroundColor: colors.border,
  },
  shadow: {
    shadowColor: isDark ? '#000' : '#666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
});
