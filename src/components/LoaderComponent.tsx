import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { t } from 'i18next';
import { ActivityIndicator } from 'react-native-paper';

import { fs } from '../helper/fontSize';
import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';
import { LanguageConstant } from '../constants/language_constants';

interface LoaderProps {
  isLoading: boolean;
  isModalVisible: boolean;
}

const LoaderComponent: React.FC<LoaderProps> = ({
  isLoading,
  isModalVisible,
}) => {
  const colors = useThemeColors();

  const styles = loaderComponentStyle(colors);

  return (
    <Modal transparent={true} animationType="fade" visible={isModalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {isLoading && (
            <>
              <ActivityIndicator
                animating={true}
                color={colors.primaryblue}
                size={'large'}
              />
              <Text style={styles.textStyle}>
                {t(LanguageConstant.loaderMessage)}
              </Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LoaderComponent;

const loaderComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    textStyle: {
      textAlign: 'center',
      color: colors.text,
      marginTop: 20,
      fontSize: fs(15),
    },
    centeredView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'colors.backgroundtint',
    },
    modalView: {
      padding: 30,
      elevation: 5,
      width: '45%',
      shadowRadius: 4,
      borderRadius: 20,
      shadowOpacity: 0.25,
      shadowColor: colors.black,
      backgroundColor: colors.background,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
  });
