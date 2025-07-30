import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen, SignupScreen } from '../helper/screens';
import { useTranslation } from 'react-i18next';
import { LanguageConstant } from '../constants/language_constants';
import DrawerNavigation from './DrawerNavigation';
// import BottomTabNavigation from './BottomTabNavigation';

const Stack = createNativeStackNavigator();
const RootStack = () => {
  const { t } = useTranslation();

  console.log('t(LanguageConstant.login)', t(LanguageConstant.login));

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="loginScreen"
    >
      <Stack.Screen name="loginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
    </Stack.Navigator>
  );
};

export default RootStack;
