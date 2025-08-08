import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigation/RootStack';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <NavigationContainer>
      <FlashMessage position="top" /> {/* Global instance */}
      <RootStack />
    </NavigationContainer>
  );
};

export default App;
