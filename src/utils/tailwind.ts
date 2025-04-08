const t = require('react-native-tailwindcss');

// Define custom colors to match GitHub's theme
const colors = {
  primary: '#0366d6',
  secondary: '#6f42c1',
  success: '#2cbe4e',
  danger: '#cb2431',
  warning: '#f66a0a',
  info: '#1b1f23',
  light: '#f6f8fa',
  dark: '#24292e',
  gray: '#586069',
  grayLight: '#e1e4e8',
};

// Extend the default tailwind theme
const theme = {
  colors: {
    ...t.theme.colors,
    ...colors,
  },
};

// Create the tailwind styles with our custom theme
const T = {
  ...t.create(theme),
  colors,
};

export default T;
