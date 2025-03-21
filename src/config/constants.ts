export const colors = {
  primary: '#2196f3',
  border: '#565656',
  red: '#EF5350',
  pink: '#EC407A',
  teal: '#26A69A',
  grey: '#BDBDBD',
  white: '#FFFFFF',
  black: '#333333',

  // Adding missing theme values
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#333333',
  textSecondary: '#787878',
  notification: '#FF3B30',
  inputBackground: '#F7F7F7',
  inputBorder: '#F0F0F0',
  buttonText: '#FFFFFF',

  // Dark mode colors
  dark: {
    primary: '#53A0F4',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#2C2C2C',
    notification: '#FF453A',
    red: '#FF5252',
    pink: '#FF4081',
    teal: '#4DB6AC',
    grey: '#757575',
    inputBackground: '#2C2C2C',
    inputBorder: '#3D3D3D',
    buttonText: '#FFFFFF',
  },
};

// Add global constants for app configuration
export const appConfig = {
  name: 'GoGoTalk',
  version: '1.0.0',
  maxMessageLength: 1000,
  maxGroupNameLength: 30,
  maxBioLength: 150,
  contactBatchSize: 20, // For pagination
  imageQuality: 0.7, // For image compression
  defaultUserAvatar: 'https://example.com/default-avatar.png', // Replace with your default avatar URL
};

// Add reusable shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Add spacing constants for consistent UI
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Add animation durations
export const animations = {
  short: 200,
  medium: 300,
  long: 500,
};
