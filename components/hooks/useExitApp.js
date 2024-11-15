import { useCallback } from 'react';  
import { BackHandler, Platform } from 'react-native';
import RNExitApp from 'react-native-exit-app';

function useExitApp() { 
  const exitApp = useCallback(() => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else if (Platform.OS === 'ios') {
      RNExitApp.exitApp();
    }
  }, []);  
   
  return {
    exitApp, 
  };
}

export default useExitApp;
