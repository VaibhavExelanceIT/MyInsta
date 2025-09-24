import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

import FlashMessage from 'react-native-flash-message';

import { useColorScheme } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootStack from './src/navigation/RootStack';
import { ThemeProvider } from './src/context/ThemeContext';
import i18n from './src/constants/language/i18next';
import {
  navigationRef,
  processPendingActions,
} from './src/services/navigationService';

export let pendingAction: { screen: string } | null = null;
const App = () => {
  const scheme = useColorScheme();
  const MyTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                processPendingActions();
              }}
              theme={MyTheme}
            >
              <FlashMessage position="top" />
              <RootStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </I18nextProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
