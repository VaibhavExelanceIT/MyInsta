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
import LoginScreen from './src/screens/LoginScreen';

const App = () => {
  const scheme = useColorScheme();
  const MyTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider>
      <NavigationContainer theme={MyTheme}>
        <FlashMessage position="top" />
        {/* <LoginScreen /> */}
        <RootStack />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;
