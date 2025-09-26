import React, { useEffect, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  LoginScreen,
  SignupScreen,
  EditProfileScreen,
  UserDetailsScreeen,
  NotificationScreen,
} from '../helper/screens';

import DrawerNavigation from './DrawerNavigation';
import { useThemeColors } from '../hooks/useThemeColors';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../services/navigationService';

const Stack = createNativeStackNavigator();

GoogleSignin.configure({
  webClientId:
    '956857887247-jttn9l0vhgdgabp27o8634sg2uvmc0d0.apps.googleusercontent.com',
  iosClientId:
    '956857887247-fv38un1ht58puru0atl6vio70dabj7t6.apps.googleusercontent.com',
});

const RootStack = () => {
  const auth = getAuth();
  const colors = useThemeColors();
  const [initialScreen, setInitialScreen] = useState<string | null>(null);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const user = auth.currentUser;

    setInitialScreen(user ? 'DrawerNavigation' : 'loginScreen');

    const unsubscribeOpen = messaging().onNotificationOpenedApp(
      remoteMessage => {
        const screen = remoteMessage?.data?.screen.toString();
        if (screen) {
          navigate(screen);
        }
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        const screen = remoteMessage?.data?.screen.toString();
        if (screen) {
          navigate(screen);
        }
      });

    return unsubscribeOpen;
  }, [navigation]);

  if (!initialScreen) {
    return (
      <View style={styles.mainView}>
        <View style={styles.loaderView}>
          <ActivityIndicator
            color={colors.acceptBtnBorderStyle}
            size={'small'}
          />
        </View>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialScreen}
    >
      <Stack.Screen name="loginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="UserDetailsScreeen" component={UserDetailsScreeen} />
    </Stack.Navigator>
  );
};

export default RootStack;

const styles = StyleSheet.create({
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 100,
    alignContent: 'center',
  },
  mainView: {
    flex: 1,
  },
});
