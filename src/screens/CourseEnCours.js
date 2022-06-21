import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native';
import { ListItem, Avatar, Icon, Badge } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as courseService from "./../services/Course.service";
import moment from "moment";
import Loading from '../components/shared/Loading';

const CourseEnCours = ({ navigation }) => {

  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const apiOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getStoredUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      setToken(userData.access_token);
      apiOptions.headers.Authorization = `Bearer ${userData.access_token}`;
    } catch (error) {
      console.log(error);
    }
  };

  const goToProfile = () => {
    navigation.navigate("Profile");
  }

  const goToDetails = () => {
    navigation.navigate("CourseDetails");
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Course en cours",
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: "#276AB1",
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
        elevation: 0
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={goToProfile}
          style={{ marginRight: 20 }}>
          <Icon
            type="ionicon"
            color="#fff"
            name="person-circle-outline"
            size={36}
          />
        </TouchableOpacity>
      )
    });
  }, [navigation])

  useEffect(() => {
    getStoredUser();
    getCourses();
  }, [token])

  const getCourses = async () => {
    console.log("api options : ", apiOptions);
    setIsLoading(true);
    try {
      const data = await courseService.getAllCourse(apiOptions);
      console.log("courses : ", data[0].numero);
      setCourses(data)
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const convertNameToStyleName = nom => {
    const originaName = nom;
    if (originaName) {
      let nameModifier = originaName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      nameModifier = nameModifier.toLowerCase();
      nameModifier = nameModifier.replace(/ /g, '');
      switch (nameModifier) {
        case 'brouillon':
          return {
            backgroundColor: '#0d6efd',
            color: 'white',
          };
          break;
          case 'laposte':
            return {
              backgroundColor: '#fca920',
              color: 'black',
            };
            break;
        case 'npai':
          return {
            backgroundColor: '#20c997',
            color: 'black',
          };
          break;

        case 'enattente':
          return {
            backgroundColor: '#dc3545',
          };
          break;

        case 'livre':
          return {
            backgroundColor: '#198754',
          };
          break;

        default:
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      {isloading ? <Loading /> : null}
      <ScrollView>
        {
          courses.map((course, index) => (
            <TouchableOpacity onPress={() => {
              navigation.navigate("CourseDetails", course)
            }}>
              <ListItem key={index} bottomDivider topDivider>
                <Icon
                  type="ionicon"
                  color="#276AB1"
                  name="mail-outline"
                  size={36}
                />
                <ListItem.Content>
                  <ListItem.Title style={{ fontWeight: "800" }}>
                    <Text style={{ color: "#276AB1" }}>{course.numero} </Text>
                  </ListItem.Title>
                  <ListItem.Subtitle>Commencé le : {moment(course.createDate).format("DD/MM/YYYY")} <Badge value={course.status.name} badgeStyle={convertNameToStyleName(course.status.name)} /></ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    marginVertical: 20
  },

});

export default CourseEnCours;
