import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const HomeScreen = ({ route }: any) => {
  // const email = route.params.email;
  // console.log(route.params.email);

  return (
    <View style={styles.container}>
      <Text>{'hello in the home screen'}</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
