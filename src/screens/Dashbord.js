import React, {useState, useLayoutEffect, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/shared/Loading';
import * as courseService from './../services/Course.service';
import { getDashboard } from '../services/Dashboard.service';

const Dashbord = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [countCourseEffectue, setCountCourseEffectue] = useState(0);
  const [dashboard, setDashboard] = useState();
  const WINDOW_WIDTH = Dimensions.get('screen').width;
  const apiOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getStoredUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('user'));
      setUser(userData);
      setToken(userData.access_token);
      apiOptions.headers.Authorization = `Bearer ${userData.access_token}`;
    } catch (error) {
      console.log(error);
    }
  };

  const getCountAll = (headerOption) => {
    getDashboard(headerOption)
      .then((res) => {
        setDashboard(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCourses = async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getAllCourse(apiOptions);
      console.log(data)
      setCountCourseEffectue(
        data.filter(course => course.status.name === "En attente").length,
      );
      setCourses(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.log(error);
    }
  };

  const goToProfile = () => {
    getStoredUser();
    console.log('in dash : ', user);
    navigation.navigate('Profile', user);
  };

  const disconnect = () => {
    Alert.alert('Attention', 'Voulez-vous vraiment vous deconnectez?', [
      {
        text: 'Annuler',
        onPress: () => console.log('Annulation'),
        style: 'cancel',
      },
      {
        text: 'Oui',
        onPress: () => {
          deleteUser();
          navigation.navigate('Login');
        },
      },
    ]);
  };

  useEffect(() => {
    getStoredUser();
    getCourses();
    getCountAll(apiOptions)
  }, [token]);

  useEffect(() => {
   
  }, [dashboard])
  

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Tableau de bord',
      headerStyle: {
        backgroundColor: '#276AB1',
        shadowOpacity: 0,
        shadowOffset: {
          height: 0,
        },
        shadowRadius: 0,
        elevation: 0,
      },
      headerTintColor: '#fff',
      headerLeft: () => (
        <TouchableOpacity onPress={goToProfile} style={{marginLeft: 10}}>
          <Icon
            type="ionicon"
            color="#fff"
            name="person-circle-outline"
            size={30}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={disconnect} style={{marginRight: 10}}>
          <Icon type="antDesign" color="#fff" name="logout" size={25} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const courseEnCours = () => {
    navigation.navigate('EnCours');
  };

  const courseEffectue = () => {
    navigation.navigate('Effectue');
  };

  const scanPacketToDeliver = () => {
    navigation.navigate('Scan', {isToDeliver: true});
  };

  const scanPacketToTakein = () => {
    navigation.navigate('Scan', {isToDeliver: false});
  };

  const scanPacketToFinishCourse = () => {
    navigation.navigate('Scan', {toFinish: true});
  };

  return (
    <ScrollView>
      {isloading ? <Loading /> : null}
      <View style={styles.container}>
        <View style={styles.contentDash}>
          <TouchableOpacity style={styles.coursePoste}>
            <View>
                <Text style={styles.textLivre}>Poste</Text>
            </View>
            <View style={{marginVertical: 5}}>
                <Text style={[styles.textLivre, styles.nombre]}>
                    {dashboard?.demandeHorsPerimetre}
                </Text>
            </View>
            <View>
            <Icon
                  type="material-community"
                  color="#fff"
                  name="mailbox"
                  size={24}
                />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseRetard}>
            <View>
                <Text style={styles.textLivre}>Retard</Text>
            </View>
            <View style={{marginVertical: 5}}>
                <Text style={[styles.textLivre, styles.nombre]}>
                    {dashboard?.demandeEnRetard}
                </Text>
            </View>
            <View>
            <Icon
                  type="material-community"
                  color="#fff"
                  name="email-alert"
                  size={24}
                />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.courseNpai}>
            <View>
                <Text style={styles.textLivre}>NPAI</Text>
            </View>
            <View style={{marginVertical: 5}}>
                <Text style={[styles.textLivre, styles.nombre]}>
                    {dashboard?.demandeNPAI}
                </Text>
            </View>
            <View>
            <Icon
                  type="font-awesome"
                  color="#fff"
                  name="exclamation-triangle"
                  size={24}
                />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.raceContainerView}>
          <TouchableOpacity
            onPress={courseEffectue}
            style={[styles.completedRaceViewLivre, styles.shadowStyles]}>
            <View style={styles.raceTitleView}>
              <Text style={styles.raceTitleTextLivre}>Course en attente</Text>
            </View>
            <View style={styles.countRaceView}>
              <Text style={styles.countRaceTextLivre}>{countCourseEffectue}</Text>
            </View>
            <View style={styles.raceIllustrationRowView}>
              <View style={styles.raceIllustrationViewLivre}>
                <Icon
                  type="material"
                  color="#fff"
                  name="pending"
                  size={36}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={courseEnCours}
            style={[styles.inprogressView, styles.shadowStyles]}>
            <View style={styles.raceTitleView}>
              <Text style={styles.raceTitleText}>Toutes les courses</Text>
            </View>
            <View style={styles.countRaceView}>
              <Text style={styles.countRaceText}>{courses.length}</Text>
            </View>
            <View style={styles.raceIllustrationRowView}>
              <View style={styles.raceIllustrationView}>
                <Icon
                  type="material"
                  color="#fff"
                  name="delivery-dining"
                  size={36}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainerView}>
          {/* <View style={styles.deliverButtonContainerView}>
                        <TouchableOpacity
                            onPress={scanPacketToDeliver}
                            style={[styles.scanButtonTouchable, styles.shadowStyles]}>
                            <Icon
                                type="ionicon"
                                color="#276AB1"
                                name="exit-outline"
                                size={46}
                            />
                            <Text style={[styles.scanText, styles.blueColor]}>Livrer un courrier</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.deliverButtonContainerView}>
                        <TouchableOpacity
                            onPress={scanPacketToTakein}
                            style={[styles.scanButtonTouchable, styles.shadowStyles]}>
                            <Icon
                                type="ionicon"
                                color="#276AB1"
                                name="enter-outline"
                                size={46}
                            />
                            <Text style={[styles.scanText, styles.blueColor]}>Enlever un courrier</Text>
                        </TouchableOpacity>
                    </View> */}
          <View style={styles.deliverButtonContainerView}>
            <TouchableOpacity
              onPress={scanPacketToFinishCourse}
              style={[
                styles.scanButtonTouchable,
                styles.shadowStyles,
                {backgroundColor: '#276AB1'},
              ]}>
              <Icon
                type="material-community"
                color="#fff"
                name="qrcode-scan"
                size={46}
              />
              <Text style={[styles.scanText, styles.whiteColor]}>
                Scanner une course
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 15,
    minHeight: Dimensions.get('window').height
  },

  raceContainerView: {
    marginVertical: 10,
    flexDirection: 'row',
    paddingVertical: 10,
    alignContent: 'space-between',
    height: 200,
  },

  completedRaceView: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#276AB1',
    alignItems: 'center',
    height: 200,
  },

  completedRaceViewLivre: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgba(25, 135, 84, 0.8)',
    alignItems: 'center',
    height: 200,
  },

  inprogressView: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#276AB1',
    alignItems: 'center',
    height: 200,
  },

  raceTitleText: {
    color: '#276AB1',
    fontSize: 14,
    fontWeight: '500',
  },

  raceTitleTextLivre: {
    color: 'rgba(25, 135, 84, 0.8)',
    fontSize: 14,
    fontWeight: '500',
  },

  countRaceText: {
    color: '#276AB1',
    fontSize: 34,
    marginTop: 12,
  },

  countRaceTextLivre: {
    color: 'rgba(25, 135, 84, 0.8)',
    fontSize: 34,
    marginTop: 12,
  },

  raceIllustrationRowView: {
    alignItems: 'center',
    marginTop: 10,
  },

  raceIllustrationView: {
    width: 70,
    height: 70,
    backgroundColor: '#276AB1',
    borderRadius: 40,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  raceIllustrationViewLivre: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(25, 135, 84, 0.8)',
    borderRadius: 40,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  raceIllustrationBadgeImage: {
    width: 33,
    height: 40,
  },

  raceIllustrationCarImage: {
    width: 35,
    height: 25,
  },

  buttonContainerView: {
    borderRadius: 5,
    borderColor: '#276AB1',
  },

  scanButtonContainerView: {
    height: 100,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#276AB1',
    alignContent: 'center',
  },

  scanButtonTouchable: {
    height: 100,
    flexDirection: 'row',
    alignContent: 'stretch',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#276AB1',
    paddingHorizontal: 30,
  },

  scanText: {
    flex: 2,
    fontSize: 28,
    fontFamily: 'Regular',
    marginLeft: 15,
    textAlign: 'center',
  },

  whiteColor: {
    color: '#ffffff',
  },

  blueColor: {
    color: '#276AB1',
  },

  scanPicture: {
    height: 50,
    width: 60,
  },

  personPicture: {
    height: 65,
    width: 50,
  },
  deliverButtonContainerView: {
    height: 100,
    marginVertical: 10,
    // borderWidth: 1,
    borderRadius: 5,
    borderColor: '#276AB1',
  },
  shadowStyles: {
    shadowColor: '#ddd',
    // shadowOffset: {
    //     width: 0,
    //     height: 1,
    // },
    // shadowOpacity: 0.4,
    // shadowRadius: 1.41,
    // elevation: 4,
    padding: 14,
  },
  contentDash: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  courseLivre: {
    backgroundColor: 'rgba(25, 135, 84, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    width: "30%"
  },
  courseNpai: {
    backgroundColor: 'rgba(32, 201, 150, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    width: "30%",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  coursePoste: {
    backgroundColor: 'rgba(252, 169, 32, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: "30%",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  courseRetard: {
    backgroundColor: 'rgba(220, 53, 69, 0.8);',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: "30%",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  textLivre:{
    color: "white"
  },
  nombre:{
      fontWeight: "bold"
  }
});

export default Dashbord;
