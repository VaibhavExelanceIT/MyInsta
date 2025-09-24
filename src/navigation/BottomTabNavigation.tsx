import React from 'react';
import { Easing } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions } from '@react-navigation/native';

import {
  HomeScreen,
  SearchScreen,
  AddPostScreen,
  ProfileScreen,
  NotificationScreen,
} from '../helper/screens';
import {
  AddDark,
  HomeFill,
  SearchFill,
  AddOutline,
  HomeOutline,
  HomeFillDark,
  BellFillDark,
  UserFillDark,
  SearchOutline,
  UserFillLight,
  BellFillLight,
  SearchFillDark,
  BellOutlineDark,
  HomeOutlineDark,
  UserOutlineDark,
  UserOutlineLight,
  BellOutlineLight,
  SearchOutlineDark,
} from '../helper/icon';
import { useThemeColors } from '../hooks/useThemeColors';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {
  const { isDarkMode } = useTheme();
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarVariant: 'uikit',
        tabBarStyle: {
          height: '10%',
          paddingTop: 10,
          paddingHorizontal: 10,
          backgroundColor: colors.background,
        },
      }}
    >
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

          headerShown: false,
          tabBarActiveTintColor: colors.activityIndicatorStyle,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <>{isDarkMode ? <HomeFillDark /> : <HomeFill />}</>
            ) : isDarkMode ? (
              <HomeOutlineDark />
            ) : (
              <HomeOutline />
            ),
        }}
      />
      <Tab.Screen
        name={'SearchScreen'}
        component={SearchScreen}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.dispatch(DrawerActions.jumpTo('SearchScreen'));
          },
        })}
        options={{
          transitionSpec: {
            animation: 'timing',
            config: {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
            },
          },

          tabBarActiveTintColor: colors.activityIndicatorStyle,

          tabBarIcon: ({ focused }) =>
            focused ? (
              <>{isDarkMode ? <SearchFillDark /> : <SearchFill />}</>
            ) : (
              <>{isDarkMode ? <SearchOutlineDark /> : <SearchOutline />}</>
            ),
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

          tabBarActiveTintColor: colors.activityIndicatorStyle,

          tabBarIcon: ({ focused }) =>
            focused ? (
              isDarkMode ? (
                <AddDark />
              ) : (
                <AddOutline />
              )
            ) : isDarkMode ? (
              <AddDark />
            ) : (
              <AddOutline />
            ),
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
          tabBarActiveTintColor: colors.activityIndicatorStyle,

          tabBarIcon: ({ focused }) =>
            focused ? (
              <>
                {isDarkMode ? (
                  <BellFillLight height={25} width={25} />
                ) : (
                  <BellFillDark height={25} width={25} />
                )}
              </>
            ) : (
              <>
                {isDarkMode ? (
                  <BellOutlineLight height={25} width={25} />
                ) : (
                  <BellOutlineDark height={25} width={25} />
                )}
              </>
            ),
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
          tabBarActiveTintColor: colors.activityIndicatorStyle,

          tabBarIcon: ({ focused }) =>
            focused ? (
              <>
                {isDarkMode ? (
                  <UserFillLight height={25} width={25} />
                ) : (
                  <UserFillDark height={25} width={25} />
                )}
              </>
            ) : (
              <>
                {isDarkMode ? (
                  <UserOutlineLight height={25} width={25} />
                ) : (
                  <UserOutlineDark height={25} width={25} />
                )}
              </>
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
