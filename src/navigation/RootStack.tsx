import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  LoginScreen,
  SignupScreen,
  UserDetailsScreeen,
} from '../helper/screens';
import { useTranslation } from 'react-i18next';
import { LanguageConstant } from '../constants/language_constants';

const Stack = createNativeStackNavigator();
const RootStack = () => {
  const { t } = useTranslation();

  console.log('t(LanguageConstant.login)', t(LanguageConstant.login));

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="loginScreen"
    >
      <Stack.Screen
        name="loginScreen"
        component={LoginScreen}
        options={{ title: t(LanguageConstant.login) }}
      />
      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ title: t(LanguageConstant.login) }}
      />
      <Stack.Screen
        name="UserDetailsScreeen"
        component={UserDetailsScreeen}
        options={{ title: t(LanguageConstant.login) }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
