import React from 'react';
import { Easing, StyleSheet } from 'react-native';
/* eslint-disable react/no-unstable-nested-components */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  SearchScreen,
  AddPostScreen,
  NotificationScreen,
  HomeScreen,
  ProfileScreen,
} from '../helper/screens';

import Add from '../assets/icons/add.svg';
import Home from '../assets/icons/home.svg';
import Notification from '../assets/icons/notification.svg';
import Search from '../assets/icons/search.svg';
import Profile from '../assets/icons/profile.svg';

const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ animation: 'fade', headerShown: false }}>
      <Tab.Screen
        name={'HomeScreen'}
        component={HomeScreen}
        options={{
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
            },
          },

          tabBarActiveTintColor: 'red',
          headerShown: false,

          tabBarIcon: ({}) => <Home />,
        }}
      />
      <Tab.Screen
        name={'SearchScreen'}
        component={SearchScreen}
        options={{
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
            },
          },

          tabBarActiveTintColor: 'red',
          tabBarIcon: ({}) => <Search />,
        }}
      />
      <Tab.Screen
        name={'AddPostScreen'}
        component={AddPostScreen}
        options={{
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
            },
          },

          tabBarActiveTintColor: 'red',

          tabBarIcon: ({}) => <Add />,
        }}
      />
      <Tab.Screen
        name={'NotificationScreen'}
        component={NotificationScreen}
        options={{
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
            },
          },
          tabBarActiveTintColor: 'red',

          tabBarIcon: ({}) => <Notification height={25} />,
        }}
      />
      <Tab.Screen
        name={'ProfileScreen'}
        component={ProfileScreen}
        options={{
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
            },
          },
          tabBarActiveTintColor: 'red',

          tabBarIcon: ({}) => <Profile height={25} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
const styles = StyleSheet.create({
  ImageStyle: { height: 30, width: 30 },
});
