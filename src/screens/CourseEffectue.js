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

const CourseEffectue = ({ navigation }) => {

  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const apiOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const goToProfile = () => {
    navigation.navigate("Profile");
  }

  const getStoredUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      setToken(userData.access_token);
      apiOptions.headers.Authorization = `Bearer ${userData.access_token}`;
    } catch (error) {
      console.log(error);
    }
  };

  const getCourses = async () => {
    console.log("api options : ", apiOptions);
    setIsLoading(true);
    try {
      const data = await courseService.getAllCourse(apiOptions);
      console.log("courses : ", data);
      const courseEffectue = data.filter(course => course.status.name === "En attente")
      setCourses(courseEffectue)
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getStoredUser()
    getCourses()
  }, [token])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Courses en attente",
      headerStyle: {
        backgroundColor: "#276AB1",
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
        elevation: 0
      },
      headerTintColor: '#fff',
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
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      {isloading ? <Loading /> : null}
      <ScrollView>
        <View>
          {
            courses.map((course, index) => (
              <TouchableOpacity onPress={() => navigation.navigate("CourseDetails", course)}>
                <ListItem key={index} bottomDivider topDivider>
                  <Icon
                    type="ionicon"
                    color="#276AB1"
                    name="mail-open-outline"
                    size={36}
                  />
                  <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: "800" }}>
                      <Text style={{ color: "#276AB1" }}>{course.numero} </Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>Commencé le : {moment(course.createDate).format("DD/MM/YYYY")} <Badge value={course.status.name} badgeStyle={{backgroundColor: "#198754"}} /></ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            ))
          }
        </View>
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

export default CourseEffectue;
