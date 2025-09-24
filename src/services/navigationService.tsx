import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// Store pending navigation actions if the app isn't ready yet
let pendingActions: (() => void)[] = [];

export const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate('DrawerNavigation', {
      screen: 'MyTab',
      params: { screen: name },
    });
  } else {
    pendingActions.push(() => navigate(name, params));
  }
};

export const processPendingActions = () => {
  pendingActions.forEach(action => action());
  pendingActions = [];
};
