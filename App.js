import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from './src/navigation/MainNavigator';
import Toast from 'react-native-toast-message'

const App = () => {
  return (
    <>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
      <Toast />
    </>
  );
}
export default App;
