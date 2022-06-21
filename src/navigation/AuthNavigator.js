import React, { useState, Button } from 'react'
import Login from './../screens/Login'
import ForgotPassword from './../screens/ForgotPassword'
import { createStackNavigator } from "@react-navigation/stack";
import Dashbord from '../screens/Dashbord';

const { Navigator, Screen } = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Navigator>
      <Screen name="Login" component={Login} options={options => { return { headerShown: false } }} />
      <Screen name="ForgotPassword" component={ForgotPassword} options={options => { return { headerShown: false } }} />
    </Navigator>
  );
};

export default AuthNavigator;
