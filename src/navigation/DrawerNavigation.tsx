import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';

import {
  DrawerItem,
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { t } from 'i18next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';

import BottomTabNavigation from './BottomTabNavigation';
import { LanguageConstant } from '../constants/language_constants';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation }: any) => {
  const [uri, setUri] = useState<string>();
  const [userEmail, setEmail] = useState<string>('');
  const [focused, setFocused] = useState('HomeScreen');
  const dimensions = useWindowDimensions();

  const colors = useThemeColors();
  const styles = drawerNavigationStyle(colors);

  const getData = async (email: string) => {
    const users = await firestore()
      .collection('UsersData')
      .where('email', '==', email)
      .get();

    setUri(users.docs[0].data().userImage);
  };

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user?.email) {
        setEmail(user.email);
        getData(user.email);
      }
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const state = navigation.getState();

      const drawerRoute = state?.routes.find(
        (r: { name: string }) => r.name === 'DrawerNavigation',
      );

      const tabState = drawerRoute?.state?.routes.find(
        (r: { name: string }) => r.name === 'MyTab',
      )?.state;

      const currentRoute = tabState?.routes?.[tabState.index]?.name;

      if (
        currentRoute &&
        [
          'HomeScreen',
          'SearchScreen',
          'ProfileScreen',
          'AddPostScreen',
          'NotificationScreen',
        ].includes(currentRoute)
      ) {
        setFocused(currentRoute);
      }
    });
    return unsubscribe;
  }, []);

  const signOutGoogle = async () => {
    try {
      const currentUser = GoogleSignin.getCurrentUser();
      if (currentUser) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        showMessage({
          message: t(LanguageConstant.success),
          description: t(LanguageConstant.user_signout_message),
          type: 'success',
        });
        navigation.popToTop();
      } else {
        await auth().signOut();
        showMessage({
          message: t(LanguageConstant.success),
          description: t(LanguageConstant.user_signout_message),
          type: 'success',
        });
        navigation.popToTop();
      }
    } catch (error) {
      showMessage({
        message: t(LanguageConstant.error),
        description: t(LanguageConstant.error_signin_out),
        type: 'danger',
      });
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="MyTab"
      screenOptions={{
        headerShown: false,
        overlayColor: 'transparent',
        drawerStyle: {
          backgroundColor: colors.background,
          borderRightWidth: 1,
          borderColor: colors.darwerTint,
        },
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
      }}
      drawerContent={props => {
        return (
          <View style={styles.mainLayout}>
            <View style={styles.imageView}>
              <Image src={uri} resizeMode="center" style={styles.headerImage} />
              <Text style={styles.userEmailStyle}>{userEmail}</Text>
            </View>
            <DrawerContentScrollView {...props}>
              <View style={styles.container}>
                {[
                  { name: 'HomeScreen', label: t(LanguageConstant.home) },
                  { name: 'SearchScreen', label: t(LanguageConstant.search) },
                  { name: 'AddPostScreen', label: t(LanguageConstant.addPost) },
                  {
                    name: 'NotificationScreen',
                    label: t(LanguageConstant.notification),
                  },
                  { name: 'ProfileScreen', label: t(LanguageConstant.profile) },
                ].map(item => (
                  <DrawerItem
                    key={item.name}
                    label={item.label}
                    icon={() => (
                      <Image
                        style={[
                          styles.drawerImage,
                          {
                            tintColor:
                              focused === item.name
                                ? colors.black
                                : colors.activityIndicatorStyle,
                          },
                        ]}
                      />
                    )}
                    onPress={() => {
                      setFocused(item.name);
                      props.navigation.navigate('MyTab', { screen: item.name });
                    }}
                    style={styles.bottomStyle}
                    focused={focused === item.name}
                    activeBackgroundColor={colors.darwerTintBackground}
                    activeTintColor={colors.darwerTint}
                  />
                ))}
              </View>
            </DrawerContentScrollView>
            <View style={styles.logoutView}>
              <TouchableOpacity
                onPress={() => {
                  signOutGoogle();
                  props.navigation.navigate('loginScreen');
                }}
              >
                <Text style={styles.textStyle}>
                  {t(LanguageConstant.logout)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    >
      <Drawer.Screen name="MyTab" component={BottomTabNavigation} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const drawerNavigationStyle = (colors: ColorProps) =>
  StyleSheet.create({
    mainLayout: {
      flex: 1,
    },
    textStyle: {
      padding: 5,
      elevation: 10,
      fontWeight: '700',
      borderRadius: 10,
      color: colors.white,
      backgroundColor: 'red',
    },
    container: {
      flex: 2,
      // borderWidth: 1,
      justifyContent: 'flex-end',
    },
    imageView: {
      marginVertical: 20,

      alignSelf: 'center',
    },
    headerImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignSelf: 'center',
      backgroundColor: 'black',
    },
    drawerImage: {
      width: 20,
      height: 20,
    },
    bottomStyle: {
      borderColor: colors.darwerTint,
      marginBottom: 10,
      borderRadius: 10,
      // borderBottomWidth: 0.5,
    },
    logoutView: {
      flex: 0.1,
      margin: 20,
      flexDirection: 'row-reverse',
    },
    userEmailStyle: { color: colors.text },
  });
