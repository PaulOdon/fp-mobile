import React, { useState, Button } from 'react'
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { Avatar, Icon } from 'react-native-elements';
import Login from './../screens/Login'
import Dashbord from './../screens/Dashbord'
import Scan from './../screens/Scan';
import Profile from './../screens/Profile';
import ForgotPassword from '../screens/ForgotPassword';
import CourseEnCours from '../screens/CourseEnCours';
import CourseEffectue from '../screens/CourseEffectue';
import CreatePreuve from '../screens/CreatePreuve';
import CourseDetails from '../screens/CourseDetails';

const { Navigator, Screen } = createStackNavigator();

const MainNavigator = () => {

  return (
    <Navigator initialRouteName='Login'>
      <Screen name="Login" component={Login} options={() => { return { headerShown: false } }} />
      <Screen name="ForgotPassword" component={ForgotPassword} options={() => { return { headerShown: false } }} />
      <Screen name="Dashbord" component={Dashbord} />
      <Screen name="Scan" component={Scan}
        screenOptions={{ headerShown: true }}
        options={options => {
          return {
            title: "Scanner votre courrier",
            headerStyle: navbarStyles.headerStyle,
            headerTintColor: '#fff'
          };
        }}
      />
      <Screen name="Profile" component={Profile}
        options={options => {
          return {
            title: "Profile",
            headerStyle: navbarStyles.headerStyle,
            headerTintColor: '#fff'
          };
        }}
      />
      <Screen name="EnCours" component={CourseEnCours} />
      <Screen name="Effectue" component={CourseEffectue} />
      <Screen name="CreatePreuve" component={CreatePreuve} />
      <Screen name="CourseDetails" component={CourseDetails}
        options={options => {
          return {
            title: "Détails d'une course",
            headerStyle: navbarStyles.headerStyle,
            headerTintColor: '#fff'
          };
        }}
      />
    </Navigator>
  );
};

const navbarStyles = {
  headerStyle: {
    backgroundColor: "#276AB1",
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
    elevation: 0
  }
}

export default MainNavigator;
