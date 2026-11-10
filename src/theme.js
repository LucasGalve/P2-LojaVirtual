import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#17624E', primaryDark: '#104A3B', soft: '#EAF2ED',
  background: '#F6F7F4', surface: '#FFFFFF', line: '#DCE4DC',
  text: '#1F302B', muted: '#697B72', accent: '#B77B4E', danger: '#B83D3D'
};

export const theme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: '#FFFFFF',
    background: colors.background,
    surface: colors.surface,
    secondary: colors.accent,
    error: colors.danger,
    outline: colors.line,
  }
};
