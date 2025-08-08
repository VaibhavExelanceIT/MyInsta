import React from 'react';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import FlashMessage from 'react-native-flash-message';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';

const App = () => {
  const scheme = useColorScheme();
  const MyTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={MyTheme}>
      <ThemeProvider>
        <FlashMessage position="top" />
        <RootStack />
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;
