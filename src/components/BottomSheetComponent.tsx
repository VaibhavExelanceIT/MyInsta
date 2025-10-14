import React, {
  memo,
  useRef,
  useMemo,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';

import { fs } from '../helper/fontSize';
import { useTheme } from '../hooks/useTheme';
import ButtonComponent from './ButtonComponent';
import { ColorProps } from '../constants/color';
import CommentComponent from './CommentComponent';
import { Message, MessageDark } from '../helper/icon';
import { getText } from '../constants/language/i18next';
import { useThemeColors } from '../hooks/useThemeColors';

export interface BottomSheetHandler {
  open: () => void;
  close: () => void;
}

export interface CommentType {
  userID: string;
  comment: string;
}

interface BottomSheetComponentProps {
  userId: string;
  postID: string;
  postUserID: string;
  currentUserImage: string;
  comments: Array<CommentType>;
}

const BottomSheetComponent = forwardRef<
  BottomSheetHandler,
  BottomSheetComponentProps
>(({ comments, currentUserImage, postUserID, postID, userId }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImage, setIsImage] = useState(currentUserImage);
  const [textInputValue, setTextInputValue] = useState('');

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['70%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    setIsOpen(index !== -1);
  }, []);
  const colors = useThemeColors();
  const { isDarkMode } = useTheme();
  const styles = BottomSheetComponentStyle(colors);

  useImperativeHandle(ref, () => ({
    open: () => {
      sheetRef.current?.expand();
    },
    close: () => sheetRef.current?.close(),
  }));

  useEffect(() => {
    setIsImage(currentUserImage);
  }, [currentUserImage]);

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
        message: `${getText('commentSuccess')}`,
        type: 'success',
      });
    } catch (error) {
      showMessage({
        message: `${getText('commentError')}`,
        type: 'danger',
      });
    }
  };

  const handleCloseModalPress = () => {
    if (textInputValue.trim() === '') {
      showMessage({
        message: `${getText('commentNotEmpty')}`,
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
            placeholder={getText('enterComment')}
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
      enablePanDownToClose
      snapPoints={snapPoints}
      handleStyle={styles.handle}
      enableDynamicSizing={false}
      keyboardBlurBehavior="none"
      onChange={handleSheetChanges}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior={'close'}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetScrollView style={styles.content}>
        <View style={{ flex: 1 }}>
          <View style={styles.viewStyle}>
            <View style={styles.headerView}>
              <Text style={styles.headerTextStyle}>{getText('comment')}</Text>
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
                {`${getText('emptyCommentMessage')}`}
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
      left: 0,
      right: 0,
      height: 80,
      alignItems: 'center',
      position: 'relative',
      flexDirection: 'row',
      backgroundColor: 'green',
    },

    handle: {
      height: 30,
      borderTopEndRadius: 15,
      borderTopStartRadius: 15,
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
