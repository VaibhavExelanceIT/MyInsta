import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  I18nManager,
  Alert,
} from 'react-native';

import {
  DrawerItem,
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import RNRestart from 'react-native-restart';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { ColorProps } from '../constants/color';
import ThemeSwitch from '../components/ThemeSwitch';
import BottomTabNavigation from './BottomTabNavigation';
import { useThemeColors } from '../hooks/useThemeColors';

import { useTheme } from '../hooks/useTheme';
import { getText } from '../constants/language/i18next';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation }: any) => {
  const [items, setItems] = useState([
    { label: getText('english'), value: 'en' },
    { label: getText('hindi'), value: 'hi' },
    { label: getText('urdu'), value: 'ar' },
  ]);

  const [uri, setUri] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<string>('en');
  const [userEmail, setEmail] = useState<string>('');
  const [focused, setFocused] = useState('HomeScreen');

  const { i18n } = useTranslation();
  const colors = useThemeColors();
  const dimensions = useWindowDimensions();
  const styles = drawerNavigationStyle(colors);
  const { isDarkMode } = useTheme();
  isDarkMode
    ? DropDownPicker.setTheme('DARK')
    : DropDownPicker.setTheme('LIGHT');
  const navigationData = [
    { name: 'HomeScreen', label: getText('home') },
    { name: 'SearchScreen', label: getText('search') },
    { name: 'AddPostScreen', label: getText('addPost') },
    {
      name: 'NotificationScreen',
      label: getText('notification'),
    },
    { name: 'ProfileScreen', label: getText('profile') },
  ];
  const user = auth().currentUser;

  const getData = (email: string) => {
    firestore()
      .collection('UsersData')
      .where('email', '==', email)
      .onSnapshot(documentSnapshot => {
        documentSnapshot.forEach(doc => {
          console.log('User data: ', doc.data());
          setUri(doc.data().userImage);
        });
      });
  };

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user?.email) {
        setEmail(user.email);
        getData(user.email);
      }
    });

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

    return unsubscribe && unsubscribeAuth;
  }, []);

  const signOutGoogle = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      const providerId = user.providerData[0]?.providerId;

      if (providerId === 'google.com') {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut(); // Google SDK sign out
      }

      await auth().signOut();
      showMessage({
        message: getText('success'),
        description: getText('user_signout_message'),
        type: 'success',
      });

      navigation.reset({ index: 0, routes: [{ name: 'loginScreen' }] });
    } catch (error) {
      showMessage({
        message: getText('error'),
        description: getText('error_signin_out'),
        type: 'danger',
      });
    }
  };

  const changeLanguage = async (language: string) => {
    console.log('🚀 ~ changeLanguage ~ language:', language);

    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem('user-language', language);

      const isRTL = language === 'ar';
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        RNRestart.Restart();
      }
    } catch (error) {
      Alert.alert('Error while changing language');
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="MyTab"
      screenOptions={{
        headerShown: false,
        overlayColor: 'transparent',
        drawerStyle: {
          borderRightWidth: 1,
          borderColor: colors.darwerTint,
          backgroundColor: colors.background,
        },
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
      }}
      drawerContent={props => {
        return (
          <SafeAreaView style={styles.mainLayout}>
            <View style={styles.viewContainer}>
              <DropDownPicker
                open={isOpen}
                value={value}
                items={items}
                setOpen={setIsOpen}
                setValue={setValue}
                setItems={setItems}
                showBadgeDot={true}
                itemSeparator={true}
                placeholder={getText('selectedLanguage')}
                style={styles.dropDownStyle}
                onChangeValue={e => e && changeLanguage(e)}
                containerStyle={[styles.dropDownContainer]}
              />
              <>
                <ThemeSwitch />
              </>
            </View>

            <View style={styles.imageView}>
              <Image src={uri} resizeMode="center" style={styles.headerImage} />
              <Text style={styles.userEmailStyle}>{userEmail}</Text>
            </View>

            <DrawerContentScrollView {...props}>
              <View style={styles.container}>
                {navigationData.map(item => {
                  const isFocused = focused === item.name;
                  return (
                    <DrawerItem
                      key={item.name}
                      label={item.label}
                      icon={() => (
                        <Image
                          style={[
                            styles.drawerImage,
                            {
                              tintColor: isFocused
                                ? colors.black
                                : colors.acceptBtnBorderStyle,
                            },
                          ]}
                        />
                      )}
                      onPress={() => {
                        setFocused(item.name);
                        props.navigation.navigate('MyTab', {
                          screen: item.name,
                        });
                      }}
                      style={styles.bottomStyle}
                      focused={isFocused}
                      activeBackgroundColor={colors.darwerTintBackground}
                      activeTintColor={colors.darwerTint}
                      inactiveTintColor={colors.commentTextStyle}
                    />
                  );
                })}
              </View>
            </DrawerContentScrollView>

            <View style={styles.logoutView}>
              <TouchableOpacity
                onPress={() => {
                  const providerIds = user?.providerData.map(p => p.providerId);
                  console.log('🚀 ~ providerIds:', providerIds);
                  signOutGoogle();
                }}
              >
                <Text style={styles.textStyle}>{getText('logout')}</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
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
    viewContainer: {
      justifyContent: 'space-between',
      padding: 20,
      flexDirection: 'row',
    },
    dropDownContainer: {
      width: '35%',
      borderWidth: 0,
      alignSelf: 'center',
    },

    dropDownStyle: { borderWidth: 1 },
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
      justifyContent: 'flex-end',
    },
    imageView: {
      marginBottom: 20,
      alignSelf: 'center',
    },
    headerImage: {
      marginTop: 20,
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
    },
    logoutView: {
      flex: 0.1,
      margin: 20,
      flexDirection: 'row-reverse',
    },
    userEmailStyle: { color: colors.text },
  });
