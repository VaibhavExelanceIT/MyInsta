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
import i18n from './src/constants/language/i18next';
import { I18nextProvider } from 'react-i18next';

const App = () => {
  const scheme = useColorScheme();
  const MyTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer theme={MyTheme}>
          <FlashMessage position="top" />
          {/* <LoginScreen /> */}
          <RootStack />
        </NavigationContainer>
      </I18nextProvider>
    </ThemeProvider>
  );
};

export default App;
