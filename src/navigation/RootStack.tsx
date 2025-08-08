import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  LoginScreen,
  SignupScreen,
  UserDetailsScreeen,
} from '../helper/screens';
import DrawerNavigation from './DrawerNavigation';

const Stack = createNativeStackNavigator();
const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="loginScreen"
    >
      <Stack.Screen name="loginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="UserDetailsScreeen" component={UserDetailsScreeen} />
    </Stack.Navigator>
  );
};

export default RootStack;
