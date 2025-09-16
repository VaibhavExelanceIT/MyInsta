import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
  memo,
} from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import { t } from 'i18next';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

import { ColorProps } from '../constants/color';
import { useThemeColors } from '../hooks/useThemeColors';
import { fs } from '../helper/fontSize';
import CommentComponent from './CommentComponent';
import ButtonComponent from './ButtonComponent';
import { Message, MessageDark } from '../helper/icon';
import { useTheme } from '../hooks/useTheme';
import { LanguageConstant } from '../constants/language_constants';

export interface BottomSheetHandler {
  open: () => void;
  close: () => void;
}

export interface CommentType {
  userID: string;
  comment: string;
}

interface BottomSheetComponentProps {
  comments: Array<CommentType>;
  currentUserImage: string;
  postUserID: string;
  postID: string;
  userId: string;
}

const BottomSheetComponent = forwardRef<
  BottomSheetHandler,
  BottomSheetComponentProps
>(({ comments, currentUserImage, postUserID, postID, userId }, ref) => {
  const [isImage, setIsImage] = useState(currentUserImage);

  const [isOpen, setIsOpen] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');

  const { isDarkMode } = useTheme();

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '70%'], []);

  useImperativeHandle(ref, () => ({
    open: () => {
      sheetRef.current?.expand();
    },
    close: () => sheetRef.current?.close(),
  }));

  useEffect(() => {
    setIsImage(currentUserImage);
  }, [currentUserImage]);
  const colors = useThemeColors();

  const styles = BottomSheetComponentStyle(colors);

  const handleSheetChanges = useCallback((index: number) => {
    setIsOpen(index !== -1);
  }, []);

  const addComment = async (comment: string) => {
    try {
      await firestore()
        .collection('UsersData')
        .doc(postUserID)
        .collection('PostData')
        .doc(postID)
        .update({
          comment: firestore.FieldValue.arrayUnion({
            userID: userId,
            comment: comment,
          }),
        })
        .catch(err => {
          throw err;
        });
      showMessage({
        message: `${t(LanguageConstant.commentSuccess)}`,
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: `${t(LanguageConstant.commentError)}`,
        type: 'danger',
      });
    }
  };

  const handleCloseModalPress = () => {
    if (textInputValue.trim() === '') {
      showMessage({
        message: `${t(LanguageConstant.commentNotEmpty)}`,
        type: 'danger',
      });
      return;
    }
    addComment(textInputValue);
    sheetRef.current?.close();

    setTextInputValue('');
  };

  const renderFooter = () => {
    const image = { uri: isImage };

    return (
      <View style={styles.contentContainer}>
        <Image source={image} style={styles.imageStyle} />

        <View style={styles.commentInputView}>
          <BottomSheetTextInput
            value={textInputValue}
            onChangeText={setTextInputValue}
            multiline
            placeholder={t(LanguageConstant.enterComment)}
            placeholderTextColor={colors.text}
            style={styles.commentTextInputStyle}
            maxLength={150}
          />
        </View>

        <View>
          <ButtonComponent
            onClick={handleCloseModalPress}
            btnStyle={styles.btnStyle}
            textStyle={styles.textStyle}
            title=""
            IconComponent={isDarkMode ? MessageDark : Message}
          />
        </View>
      </View>
    );
  };

  return (
    <BottomSheet
      index={-1}
      ref={sheetRef}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.handleIndicator}
      containerStyle={styles.sheetContainer}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="none"
      enablePanDownToClose
      android_keyboardInputMode="adjustResize"
      backdropComponent={BottomSheetBackdrop}
      enableDynamicSizing={false}
    >
      <BottomSheetScrollView style={styles.content}>
        <View style={{ flex: 1 }}>
          <View style={styles.viewStyle}>
            <View style={styles.headerView}>
              <Text style={styles.headerTextStyle}>
                {t(LanguageConstant.comment)}
              </Text>
            </View>
            {comments.length > 0 ? (
              comments.map((item, index) => (
                <View key={index} style={styles.commentView}>
                  <CommentComponent
                    comment={item.comment}
                    userID={item.userID}
                  />
                </View>
              ))
            ) : (
              <Text style={styles.noCommentStyle}>
                `${t(LanguageConstant.emptyCommentMessage)}`,
              </Text>
            )}
          </View>
        </View>
      </BottomSheetScrollView>
      <View style={styles.fotter}>{renderFooter()}</View>
    </BottomSheet>
  );
});

export default memo(BottomSheetComponent);

const BottomSheetComponentStyle = (colors: ColorProps) =>
  StyleSheet.create({
    fotter: {
      position: 'relative',
      left: 0,
      right: 0,
      backgroundColor: 'green',
      flexDirection: 'row',
      height: 80,
      alignItems: 'center',
    },
    sheetContainer: {
      // backgroundColor: isOpen ? colors.backgroundtint : 'transparent',
    },
    handle: {
      borderTopEndRadius: 15,
      borderTopStartRadius: 15,
      height: 30,
      backgroundColor: colors.background,
    },
    handleIndicator: {
      backgroundColor: colors.darwerTint,
    },
    content: {
      backgroundColor: colors.background,
    },
    commentView: {
      padding: 10,
      borderColor: colors.modalBorderStyle,
    },
    headerTextStyle: {
      fontSize: fs(15),
      fontWeight: 'bold',
      paddingBottom: 20,
      color: colors.text,
    },
    headerView: { alignItems: 'center' },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      backgroundColor: colors.background,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      paddingHorizontal: 10,
      borderTopColor: colors.modalBorderStyle,
    },
    btnStyle: {
      marginTop: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderColor: colors.inputTextBorder,
    },
    textStyle: {
      textAlign: 'center',
      flex: 1,
      padding: 5,
      fontSize: fs(12),
      fontWeight: '700',
      textTransform: 'uppercase',
      color: colors.text,
    },
    viewStyle: {
      flex: 1,
      paddingHorizontal: 10,
      marginBottom: 70,
    },
    imageStyle: { marginVertical: 10, borderRadius: 30, height: 50, width: 50 },
    commentInputView: { flex: 1, marginHorizontal: 5 },
    noCommentStyle: { textAlign: 'center', color: colors.text },
    commentTextInputStyle: {
      borderBottomWidth: 1,
      borderColor: colors.inputTextBorder,
      borderRadius: 10,
      paddingHorizontal: 10,
      color: colors.text,
    },
  });
