import { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export function useFCMToken() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        // ✅ iOS: Request permission
        if (Platform.OS === 'ios') {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (!enabled) {
            Alert.alert(
              'Permission Denied',
              'Enable notifications in Settings.',
            );
            return;
          }
        }

        // ✅ Android 13+: Request POST_NOTIFICATIONS permission
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Notification permission denied on Android.');
            return;
          }
        }

        // ✅ Get the token
        const token = await messaging().getToken();
        setFcmToken(token);

        // ✅ Listen for token refresh
        return messaging().onTokenRefresh(newToken => {
          console.log('FCM Token refreshed:', newToken);
          setFcmToken(newToken);
        });
      } catch (err) {
        console.error('Error fetching FCM token:', err);
      }
    };

    getToken().then(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        return () => unsubscribe();
      }
    });
  }, []);

  return fcmToken;
}
