import React from 'react';
import { Easing, StyleSheet, useColorScheme } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  SearchScreen,
  AddPostScreen,
  NotificationScreen,
  HomeScreen,
  ProfileScreen,
} from '../helper/screens';

import {
  HomeFill,
  SearchOutline,
  AddOutline,
  NotificationOutline,
  ProfileOutline,
  HomeOutline,
  SearchFill,
  AddDark,
  HomeFillDark,
  SearchFillDark,
  HomeOutlineDark,
  SearchOutlineDark,
  ProfileOutlineDark,
} from '../helper/icon';
import { darkTheme } from '../theme/darkTheme';
import { lightTheme } from '../theme/lightTheme';
import { DrawerActions } from '@react-navigation/native';
import { useThemeColors } from '../hooks/useThemeColors';

const Tab = createBottomTabNavigator();
const BottomTabNavigation = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
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
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
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

          tabBarIcon: ({ focused }) =>
            focused ? (
              <>{colorScheme == 'dark' ? <HomeFillDark /> : <HomeFill />}</>
            ) : colorScheme == 'dark' ? (
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

          tabBarActiveTintColor: 'red',

          tabBarIcon: ({ focused }) =>
            focused ? (
              <>{colorScheme == 'dark' ? <SearchFillDark /> : <SearchFill />}</>
            ) : (
              <>
                {colorScheme == 'dark' ? (
                  <SearchOutlineDark />
                ) : (
                  <SearchOutline />
                )}
              </>
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

          tabBarActiveTintColor: 'red',

          tabBarIcon: ({ focused }) =>
            focused ? (
              <>{colorScheme == 'dark' ? <AddDark /> : <AddOutline />}</>
            ) : (
              <>{colorScheme == 'dark' ? <AddDark /> : <AddOutline />}</>
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
          tabBarActiveTintColor: 'red',

          tabBarIcon: ({ focused }) =>
            focused ? (
              <>
                <NotificationOutline
                  stroke={colors.background}
                  fill={colors.text}
                  height={25}
                  width={25}
                />
              </>
            ) : (
              <NotificationOutline
                stroke={colors.white}
                height={25}
                width={25}
              />
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
          tabBarActiveTintColor: 'red',

          tabBarIcon: ({ focused }) =>
            focused ? (
              <>
                {colorScheme == 'dark' ? (
                  <ProfileOutlineDark height={30} width={30} />
                ) : (
                  <ProfileOutline height={25} width={25} />
                )}
              </>
            ) : (
              <>
                {colorScheme == 'dark' ? (
                  <ProfileOutlineDark height={30} width={30} />
                ) : (
                  <ProfileOutline height={25} width={25} />
                )}
              </>
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
const styles = StyleSheet.create({
  ImageStyle: { height: 30, width: 30 },
});
