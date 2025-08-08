/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';

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

import BottomTabNavigation from './BottomTabNavigation';

const DrawerNavigation = (route: any) => {
  const Drawer = createDrawerNavigator();
  console.log(route);
  let [focused, setFocused] = useState('');

  const dimensions = useWindowDimensions();
  return (
    <Drawer.Navigator
      initialRouteName="MyTab"
      screenOptions={{
        headerShown: false,
        overlayColor: 'transparent',
        drawerStyle: {
          backgroundColor: '#c6cbef',
        },
        drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        // drawerPosition: 'right',
      }}
      drawerContent={props => {
        const tintColor = {
          tintColor: focused ? 'black' : 'red',
        };

        return (
          <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
              <View style={styles.container}>
                <View style={styles.imageView}>
                  {/* <Image source={images.userIcon} style={styles.HeaderImage} /> */}
                </View>
                <DrawerItem
                  label={'Home'}
                  icon={() => (
                    <Image
                      // source={images.homeIcon}
                      style={[styles.DrawerImage, tintColor]}
                    />
                  )}
                  onPress={() => {
                    // props.navigation.navigate('HomeScreen');
                    setFocused('HomeScreen');
                    props.navigation.navigate('MyTab', {
                      screen: 'HomeScreen',
                    });
                    console.log('=====>', focused);
                  }}
                  style={styles.MarginBottom}
                  focused={focused === 'HomeScreen'}
                  activeBackgroundColor="orangered"
                  activeTintColor="white"
                />
                <DrawerItem
                  label={'Whislist'}
                  icon={() => (
                    <Image
                      // source={images.whislistIcon}
                      style={[styles.DrawerImage, tintColor]}
                    />
                  )}
                  onPress={() => {
                    // focused = 'WhislistScreen';
                    setFocused('WhislistScreen');
                    props.navigation.navigate('MyTab', {
                      screen: 'WhislistScreen',
                    });
                    console.log('=====>', focused);
                  }}
                  focused={focused === 'WhislistScreen'}
                  activeBackgroundColor="orangered"
                  style={styles.MarginBottom}
                  activeTintColor="white"
                />

                <DrawerItem
                  label={'Profile'}
                  icon={() => <Image style={[styles.DrawerImage, tintColor]} />}
                  onPress={() => {
                    // focused = 'ProfileScreen';
                    setFocused('ProfileScreen');
                    props.navigation.navigate('MyTab', {
                      screen: 'ProfileScreen',
                    });
                    console.log('=====>', focused);
                  }}
                  focused={focused === 'ProfileScreen'}
                  activeBackgroundColor="orangered"
                  style={styles.MarginBottom}
                  activeTintColor="white"
                />
              </View>
            </DrawerContentScrollView>

            <View style={styles.logoutView}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('LoginScreen');
                }}
              >
                <Text>Logout</Text>
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
    marginBottom: 20,
    alignSelf: 'center',
  },
  HeaderImage: {
    width: 40,
    height: 40,
  },
  DrawerImage: {
    width: 20,
    height: 20,
  },
  MarginBottom: {
    marginBottom: 10,
  },
  logoutView: {
    flex: 0.1,
    margin: 20,
    flexDirection: 'row-reverse',
  },
  logoutImages: {
    width: 30,
    height: 30,
  },
});
