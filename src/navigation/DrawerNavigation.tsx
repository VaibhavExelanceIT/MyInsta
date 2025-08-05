import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import BottomTabNavigation from './BottomTabNavigation';
import { showMessage } from 'react-native-flash-message';
import { LanguageConstant } from '../constants/language_constants';
import { t } from 'i18next';

const Drawer = createDrawerNavigator();

const DrawerNavigation = ({ navigation }: any) => {
  const [focused, setFocused] = useState('HomeScreen');
  const dimensions = useWindowDimensions();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const state = navigation.getState();
      // console.log('Navigation state:', JSON.stringify(state, null, 2));
      const drawerRoute = state?.routes.find(
        (r: { name: string }) => r.name === 'DrawerNavigation',
      );
      // console.log('drawerRoute', drawerRoute);
      const tabState = drawerRoute?.state?.routes.find(
        (r: { name: string }) => r.name === 'MyTab',
      )?.state;
      // console.log('tabState', tabState);
      const currentRoute = tabState?.routes?.[tabState.index]?.name;

      // console.log('Current route:', currentRoute);
      if (
        currentRoute &&
        [
          'HomeScreen',
          'SearchScreen',
          'AddPostScreen',
          'NotificationScreen',
          'ProfileScreen',
        ].includes(currentRoute)
      ) {
        setFocused(currentRoute);
      }
    });
    return unsubscribe;
  }, [navigation]);

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
      console.error('Error while signing out:', error);
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="MyTab"
      screenOptions={{
        headerShown: false,
        overlayColor: 'transparent',
        drawerStyle: {
          backgroundColor: '#FFFFFF',
        },
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
      }}
      drawerContent={props => {
        return (
          <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
              <View style={styles.container}>
                <View style={styles.imageView}>
                  {/* <Image source={images.userIcon} style={styles.HeaderImage} /> */}
                </View>
                {[
                  { name: 'HomeScreen', label: 'Home' },
                  { name: 'SearchScreen', label: 'Search' },
                  { name: 'AddPostScreen', label: 'Add Post' },
                  { name: 'NotificationScreen', label: 'Notifications' },
                  { name: 'ProfileScreen', label: 'Profile' },
                ].map(item => (
                  <DrawerItem
                    key={item.name}
                    label={item.label}
                    icon={() => (
                      <Image
                        // source={images.homeIcon} // Replace with actual image source
                        style={[
                          styles.DrawerImage,
                          {
                            tintColor: focused === item.name ? 'black' : 'red',
                          },
                        ]}
                      />
                    )}
                    onPress={() => {
                      setFocused(item.name);
                      props.navigation.navigate('MyTab', { screen: item.name });
                    }}
                    style={styles.MarginBottom}
                    focused={focused === item.name}
                    activeBackgroundColor="black"
                    activeTintColor="white"
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
                <Text
                  style={{
                    backgroundColor: 'red',
                    padding: 5,
                    borderRadius: 10,
                    color: '#FFFFFF',
                    elevation: 10,
                    fontWeight: '900',
                  }}
                >
                  Logout
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

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  imageView: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  HeaderImage: {
    height: 40,
    width: 40,
  },
  DrawerImage: {
    height: 20,
    width: 20,
  },
  MarginBottom: {
    marginBottom: 10,
  },
  logoutView: {
    flex: 0.1,
    margin: 20,
    flexDirection: 'row-reverse',
  },
});
