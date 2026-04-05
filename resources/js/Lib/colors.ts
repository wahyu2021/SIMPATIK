// Bank Sumsel Babel Color Palette
export const BSBColors = {
  // Primary Colors
  primary: {
    dark: '#003366',    // Navy blue (main brand)
    main: '#0052A3',    // Professional blue
    light: '#3399FF',   // Light blue
  },
  
  // Secondary Colors
  secondary: {
    gold: '#FFB81C',    // Gold accent
    darkGold: '#DAA520', // Dark gold
  },
  
  // Status Colors
  success: '#28A745',
  warning: '#FFC107',
  danger: '#DC3545',
  info: '#17A2B8',
  
  // Neutral
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  gray: '#6C757D',
  darkGray: '#333333',
  
  // Backgrounds
  background: '#F8F9FA',
  cardBg: '#FFFFFF',
};

// Tailwind color classes for BSB theme
export const BSBTailwind = {
  button: {
    primary: 'bg-blue-900 hover:bg-blue-950 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  },
  text: {
    primary: 'text-blue-900',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
  },
  border: {
    primary: 'border-blue-200',
    focus: 'focus:ring-blue-600 focus:border-blue-600',
  },
};
