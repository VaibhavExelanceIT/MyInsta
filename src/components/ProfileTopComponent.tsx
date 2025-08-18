import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { colors } from '../hooks/useThemeColors';
import ButtonComponent from './ButtonComponent';

interface ComponentProp {
  follower: number;
  following: number;
  totalPost: number;
  userName: string;
  ProfilePhoto: string;
}

const ProfileTopComponent: React.FC<ComponentProp> = props => {
  const { follower, following, totalPost, userName, ProfilePhoto } =
    props || {};
  return (
    <View
      style={[styles.container, { backgroundColor: colors.profileBackground }]}
    >
      <View style={styles.mainLayout}>
        <Image
          src={ProfilePhoto}
          style={[styles.imageStyle, { borderColor: colors.inputTextBorder }]}
        />

        <View style={styles.textStyle}>
          <Text style={[styles.textcolor, { color: colors.text }]}>
            {totalPost}
          </Text>
          <Text style={[styles.TextView, { color: colors.text }]}>
            {'Posts'}
          </Text>
        </View>
        <View style={styles.textStyle}>
          <Text style={[styles.textcolor, { color: colors.text }]}>
            {follower}
          </Text>
          <Text style={[styles.TextView, { color: colors.text }]}>
            {'Followers'}
          </Text>
        </View>
        <View style={styles.textStyle}>
          <Text style={[styles.textcolor, { color: colors.text }]}>
            {following}
          </Text>
          <Text style={[styles.TextView, { color: colors.text }]}>
            {'Following'}
          </Text>
        </View>
      </View>
      <View
        style={[styles.TextView, { alignSelf: 'flex-start', marginLeft: 30 }]}
      >
        <Text style={[styles.textcolor, { color: colors.text }]}>
          {userName}
        </Text>
      </View>
      <View style={styles.btnView}>
        <ButtonComponent
          title="Edit Profile"
          onclick={() => {}}
          imageStyle={{
            backgroundColor: colors.background,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.inputTextBorder,
          }}
          textStyle={{ color: colors.text }}
        />
      </View>
    </View>
  );
};

export default ProfileTopComponent;

const styles = StyleSheet.create({
  btnView: { alignSelf: 'stretch', marginHorizontal: 20 },
  container: {
    flex: 1,
  },
  mainLayout: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 5,
    marginLeft: 20,
  },
  textStyle: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
  },
  TextView: { alignSelf: 'center' },
  textcolor: {
    fontWeight: '600',
  },
});
