import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import {
  // Header,
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {Badge, Button} from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import Loading from './../components/shared/Loading';
import * as courseService from './../services/Course.service';
import {getAllStatus} from '../services/Status.service';
import {putCourse} from './../services/Course.service';
import mime from 'mime';
import {getMailByCourseId} from '../services/Mail.service';
import {putMail} from '../services/Mail.service';

const Scan = props => {
  let buttonScanTitle = '';
  let messageTitle = '';
  let isToDeliver = props.route.params.isToDeliver;
  let toFinishingCourse = props.route.params.toFinish;

  const [image, setImage] = useState([]);
  const [imageFile, setImageFile] = useState([]);
  const [imgf, setImagef] = useState([]);
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState();
  const [course, setCourse] = useState({});
  const [courseStatusId, setCourseStatusId] = useState(0);
  const [token, setToken] = useState([]);
  const [user, setUser] = useState(null);
  const [courseId, setCourseId] = useState();
  const [isloading, setIsLoading] = useState(false);
  const WINDOW_HEIGHT = Dimensions.get('screen').height;
  const WINDOW_WIDTH = Dimensions.get('screen').width;
  const [allStatus, setAllStatus] = useState([]);
  const [mailDetails, setMailDetails] = useState({});

  const courseStatus = [
    {
      statusId: 1,
      status: 'Livré',
    },
    {
      statusId: 2,
      status: 'En attente',
    },
    {
      statusId: 3,
      status: 'La Poste',
    },
    {
      statusId: 4,
      status: 'Brouillon',
    },
    {
      statusId: 5,
      status: 'NPAI',
    },
  ];

  const apiOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const apiFormDataOption = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data; charset=utf-8; boundary="file"',
    },
  };

  buttonScanTitle = isToDeliver
    ? 'Scanner un code QR'
    : 'Scanner un code QR';
  messageTitle = isToDeliver
    ? 'Commencer la livraison du colis'
    : "Commencer l'enlèvement du colis";

  if (toFinishingCourse) {
    buttonScanTitle = 'Scanner un code QR';
    messageTitle = 'Ajoutez des preuves';
  }

  const fetchAllStatus = async headerOption => {
    const res = await getAllStatus(headerOption);
    setAllStatus(res);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const onSuccess = e => {
    setResult(e.data);
    getScannedCourse(`${e.data}`);
    setScan(false);
  };

  const startScan = () => {
    setScan(true);
    setResult();
  };

  const openCamera = () => {
    let options = {
      title: 'Prendre une photo',
      maxWidth: 1000,
      maxHeight: 1000,
      storageOptions: {
        skipBackup: false,
      },
    };
    if (requestCameraPermission && requestExternalWritePermission) {
      launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          if (response != null && response.assets.length > 0) {
            setImage(image => [...image, response.assets[0].uri]);
            setImageFile([...imageFile, ...response.assets]);
          }
        }
      });
    }
  };

  const openGallerie = () => {
    let options = {
      title: 'Choisir dans le gallérie',
      maxWidth: 1000,
      maxHeight: 1000,
      storageOptions: {
        skipBackup: false,
      },
    };
    if (requestCameraPermission && requestExternalWritePermission) {
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User can celled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          if (response != null && response.assets[0] != undefined) {
            setImage(image => [...image, response.assets[0].uri]);
            setImageFile([...imageFile, ...response.assets]);
          }
        }
      });
    }
  };

  const envoyerPreuve = () => {
    let formData = new FormData();
    setIsLoading(true)
    imageFile.forEach((item, i) => {
      const newImageUri =
        Platform.OS === 'android' ? item.uri : item.uri.replace('file://', '');

      formData.append('files', {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split('/').pop(),
      });
    });
    postProofFileImage(formData);
  };

  const getStoredUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem('user'));
      setToken(userData.access_token);
      setUser(userData);
      apiOptions.headers.Authorization = `Bearer ${userData.access_token}`;
      apiFormDataOption.headers.Authorization = `Bearer ${userData.access_token}`;
    } catch (error) {
      console.log(error);
    }
  };

  const beginDelivery = async () => {
    // si colis scanné est déjà en Attente, on ne doit plus le mettre à jour
    if (courseStatusId == 2 && isToDeliver == true) {
      Toast.show({
        type: 'error',
        text1: 'Erreur!',
        text2: 'Cette course est déjà en cours de livraison',
      });
    } else if (courseStatusId == 2 && isToDeliver == false) {
      Toast.show({
        type: 'error',
        text1: 'Erreur!',
        text2: "Cette course est déjà en cours d'enlèvement",
      });
    } else {
      updateCourse(2, 'EnCours');
    }
  };

  const changeStatus = (id, name) => {
    if (name === "Livré" || name === "En attente") {
      if (name === "Livré") {
        setIsLoading(true)
        updateStatutCourse(id, course);
        updateMail(name, apiOptions);
      }if (name != "Livré"){
        setIsLoading(true)
        updateStatutCourse(id, course);
        updateMail(name, apiOptions);
        setIsLoading(false)
      }
    }if (name != "Livré" && name != "En attente"){
      setIsLoading(true)
      updateStatutCourse(id, course);
      setIsLoading(false)
    }
  };

  const updateMail = (dateNeedUpdate, headerOption) => {
    const mailvalue = mailDetails;
    if (dateNeedUpdate === 'En attente') {
      mailDetails.pickupDate = new Date().toISOString();
     
      putMail(mailvalue.id, mailvalue, headerOption)
        .then(res => {
          console.log(res);
          // setIsLoading(false)
          
        })
        .catch(err => {
          console.log(err);
          // setIsLoading(false)
        });
    }
    if (dateNeedUpdate === 'Livré') {
      mailDetails.deliveryDate = new Date().toISOString();
   
      putMail(mailvalue.id, mailvalue, headerOption)
        .then(res => {
          console.log(res);
          // setIsLoading(false)
        })
        .catch(err => {
          console.log(err);
          // setIsLoading(false)
        });
    }
  };

  const getAllInfoMail = (num, headerOption) => {
    getMailByCourseId(num, headerOption)
      .then(res => {
        setMailDetails(res[0]);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const updateStatutCourse = async (id, courseUpdate) => {
    try {
      const coursNewVal = {};
     
      coursNewVal.comment = courseUpdate.comment;
      coursNewVal.numero = courseUpdate.numero;
      coursNewVal.createDate = courseUpdate.createDate;
      coursNewVal.deliveryManId = user.id;
      coursNewVal.creatorId = courseUpdate.creatorId;
      coursNewVal.statusId = parseInt(id);

      const response = await courseService.putCourse(
        courseUpdate.id,
        coursNewVal,
        apiOptions,
      );

      if (response) {
        console.log('response : ', response);
        setCourse(response);
        // props.navigation.navigate(routeToRedirect);
        switch (response.status.name) {
          case 'Livré':
            Toast.show({
              type: 'info',
              text1: 'Succès',
              text2: 'Veuillez ajoutez le(s) preuves',
            });
            setIsLoading(false);
            break;
          case 'NPAI':
            Toast.show({
              type: 'info',
              text1: 'Succès',
              text2: 'Course NPAI',
            });
            setIsLoading(false);
            break;
          case 'La Poste':
            Toast.show({
              type: 'info',
              text1: 'Succès',
              text2: 'Course livrée à la poste',
            });
            setIsLoading(false);
            break;
          default:
            break;
        }
        
      } else {
        console.log('erreur sur la mise à jour');
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: "Erreur, veuillez signaler l'admin",
        });
       
      }
    } catch (error) {
      console.log('Erreur MAJ ', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: "Erreur, veuillez signaler l'admin",
      });
    }
  };

  const updateCourse = async (courseStatusId, routeToRedirect) => {
    try {
      const updatedCourseData = {
        comment: course.comment,
        numero: course.numero,
        createDate: course.createDate,
        deliveryManId: user.id,
        creatorId: course.creatorId,
        receiverId: course.receiverId,
        customerId: course.customerId,
        statusId: courseStatusId,
      };

      const response = courseService.putCourse(
        course.id,
        updatedCourseData,
        apiOptions,
      );
      if (response) {
        console.log('response : ', response);
        console.log(
          'course status : ',
          courseStatus.find(status => status.statusId == courseStatusId).status,
        );
        setCourse(updatedCourseData);
        props.navigation.navigate(routeToRedirect);
        if (courseStatusId == 2 && isToDeliver == true) {
          Toast.show({
            type: 'info',
            text1: 'Succès',
            text2: 'Livraison en cours',
          });
        } else if (courseStatusId == 2 && isToDeliver == false) {
          Toast.show({
            type: 'info',
            text1: 'Succès',
            text2: 'Enlèvement constaté',
          });
        } else if (courseStatusId == 1 && toFinishingCourse == true) {
          // update the state of the to show image picker
          Toast.show({
            type: 'info',
            text1: 'Succès',
            text2: 'Veuillez ajoutez le(s) preuves',
          });
        } else if (courseStatusId == 3 && toFinishingCourse == true) {
          Toast.show({
            type: 'info',
            text1: 'Succès',
            text2: 'Course livrée à la poste',
          });
        } else if (courseStatusId == 5 && toFinishingCourse == true) {
          Toast.show({
            type: 'info',
            text1: 'Succès',
            text2: 'Course NPAI',
          });
        }
      } else {
        console.log('erreur sur la mise à jour');
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: "Erreur, veuillez signaler l'admin",
        });
      }
    } catch (error) {
      console.log('Erreur MAJ ', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: "Erreur, veuillez signaler l'admin",
      });
    }
  };

  const getScannedCourseStatic = async () => {
    setIsLoading(true);
    const course = await courseService.getCourseById('/course/26', apiOptions);
    if (course != null) {
      setCourse(course);
      getAllInfoMail(course.id, apiOptions);
      setCourseId(course.id);
      setCourseStatusId(course.status.id);
      setResult(true);
      setIsLoading(false);
    } else {
      console.log('Error when getting course');
    }
    setIsLoading(false);
  };

  const getScannedCourse = async courseURL => {
    setIsLoading(true);
    const course = await courseService.getCourseById(courseURL, apiOptions);
    if (course != null) {
      setCourse(course);
      getAllInfoMail(course.id, apiOptions);
      setCourseId(course.id);
      setCourseStatusId(course.status.id);
      setIsLoading(false);
    } else {
      console.log('Error when getting course');
    }
    setIsLoading(false);
  };

  const postProofFileImage = async file => {
    try {
      const res = await courseService.postFileImage(
        file,
        apiFormDataOption,
        courseId,
      );
      if (res.value) {
        props.navigation.navigate('Effectue');
        setIsLoading(false);
      } else {
        console.log("Erreur lors de l'upload", res);
        setIsLoading(false);
      }
    } catch (error) {
      console.log('file upload error, ', "upload");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStoredUser();
    fetchAllStatus(apiOptions);
  }, [token]);

  useEffect(() => {}, [courseId, allStatus, course, mailDetails]);

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
            elevation: 4,
            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 12,
            flex: 1,
            margin: 2,
          };
          break;
          case 'laposte':
            return {
              backgroundColor: '#fca920',
              color: 'black',
              elevation: 4,
              borderRadius: 4,
              paddingVertical: 10,
              paddingHorizontal: 12,
              flex: 1,
              margin: 2,
            };
            break;
        case 'npai':
          return {
            backgroundColor: '#20c997',
            color: 'black',
            elevation: 4,
            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 12,
            flex: 1,
            margin: 2,
          };
          break;

        case 'enattente':
          return {
            backgroundColor: '#dc3545',
            elevation: 4,
            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 12,
            flex: 1,
            margin: 2,
          };
          break;

        case 'livre':
          return {
            backgroundColor: '#198754',
            elevation: 4,
            borderRadius: 4,
            paddingVertical: 10,
            paddingHorizontal: 12,
            flex: 1,
            margin: 2,
          };
          break;

        default:
          break;
      }
    }
  };

  const convertNameToStyleNameBadge = nom => {
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
    <>
      {isloading ? <Loading /> :
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.body}>
          {!scan && (
            <View style={styles.sectionContainer}>
              <Button
                title={buttonScanTitle}
                color="#276AB1"
                // onPress={getScannedCourseStatic}
                onPress={startScan}
                type="outline"
              />
            </View>
          )}
          {result && (
            <View style={styles.sectionContainer}>
              <Text style={styles.photoManagerTitle}>Courrier Scanné</Text>
              <View style={styles.resultView}>
                <Text>Numéro : {course.numero}</Text>
                <Text>Commentaire : {course.comment}</Text>
                <Text>
                  Date de création :{' '}
                  {moment(course.createDate).format('DD/MM/YYYY')}
                </Text>
                <Text>
                  Status :{' '}
                  <Badge 
                    value={course?.status?.name}
                    badgeStyle={convertNameToStyleNameBadge(course?.status?.name)}
                  />
                </Text>
              </View>
              {!toFinishingCourse && (
                <Button
                  title={messageTitle}
                  color="#276AB1"
                  onPress={beginDelivery}
                />
              )}
              {(course?.status?.name === 'En attente') &&
                toFinishingCourse && (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                    }}>
                    {allStatus.map((oneStatus, index) =>
                      oneStatus.name === 'Brouillon' || oneStatus.name === 'En attente'  ? (
                        <View style={{display: 'none'}}></View>
                      ) : (
                        <TouchableOpacity
                          disabled={(course?.status?.name === oneStatus.name) ? true : false}
                          onPress={() => {
                            changeStatus(oneStatus.id, oneStatus.name);
                          }}
                          style={convertNameToStyleName(oneStatus.name)}>
                          <Text style={styles.appButtonText}>
                            {oneStatus.name}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                )}
                {(course?.status?.name === 'Brouillon')   &&
                toFinishingCourse && (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                    }}>
                    {allStatus.map((oneStatus, index) =>
                      oneStatus.name != 'En attente' ? (
                        <View style={{display: 'none'}}></View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            changeStatus(oneStatus.id, oneStatus.name);
                          }}
                          style={convertNameToStyleName(oneStatus.name)}>
                          <Text style={styles.appButtonText}>
                            {oneStatus.name}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                )}
              {course?.status?.name === 'Livré' && (
                <View style={styles.photoManager}>
                  <Text style={styles.photoManagerTitle}>
                    Ajouter des preuves
                  </Text>
                  <View>
                    <View style={styles.preuveContainer}>
                      <View style={styles.imageContainer}>
                        {image.map((uri, index) => (
                          <View key={index} style={styles.imageView}>
                            <TouchableOpacity
                              style={styles.resetProofTouchable}
                              onPress={() => {
                                setImage(
                                  image.filter((item, i) => i !== index),
                                );
                              }}>
                              <Icon
                                type="ionicon"
                                color="#000"
                                name="close-circle-outline"
                                size={20}
                                style={styles.resetProofIcon}
                              />
                            </TouchableOpacity>
                            <Image source={{uri}} style={styles.preuve} />
                          </View>
                        ))}
                        <View style={styles.takePhotoView}>
                          <TouchableOpacity
                            onPress={openCamera}
                            style={styles.takePhotoButton}>
                            <Icon
                              type="materialicons"
                              color="#276AB1"
                              name="add-a-photo"
                              size={30}
                            />
                            <Text style={styles.pickImageText}>Caméra</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={openGallerie}
                            style={styles.takePhotoButton}>
                            <Icon
                              type="materialicons"
                              color="#276AB1"
                              name="add-photo-alternate"
                              size={30}
                            />
                            <Text style={styles.pickImageText}>Gallérie</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    {image.length > 0 && (
                      <Button
                        style={styles.sendProofButton}
                        title="Envoyer"
                        color="#276AB1"
                        type="solid"
                        onPress={envoyerPreuve}
                      />
                    )}
                  </View>
                </View>
              )}
            </View>
          )}
          {scan && (
            <View style={styles.section}>
              <QRCodeScanner
                style={styles.sectionQRCode}
                reactivate={true}
                showMarker={true}
                onRead={onSuccess}
                cameraStyle={{width: WINDOW_WIDTH}}
                topContent={
                  <Text style={styles.centerText}>Scanner votre Code QR</Text>
                }
                bottomContent={
                  <TouchableOpacity
                    style={styles.buttonTouchable}
                    onPress={() => setScan(false)}>
                    {/* <Icon           
                      type="ionicon"
                      color="#000"
                      name="close-circle-outline"
                      size={50}
                      style={styles.buttonText}
                    /> */}
                    <Text style={styles.buttonText}>Annuler le scan</Text>
                  </TouchableOpacity>
                }
              />
            </View>
          )}
        </View>
      </ScrollView>
      }
    </>
  );
};

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 4,
    backgroundColor: '#009688',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 12,
    flex: 1,
    margin: 2,
  },
  appButtonText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  scrollView: {
    backgroundColor: Colors.white,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionQRCode: {
    // flex: 1
  },
  sectionContainer: {
    margin: 10,
  },
  resultView: {
    backgroundColor: '#EBEBEB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  centerText: {
    flex: 1,
    fontSize: 14,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  imageStyle: {
    height: 100,
    width: 100,
    borderColor: '#000000',
    borderWidth: 1,
  },
  photoManager: {
    textAlign: 'center',
    flex: 1,
    // backgroundColor: "#EBEBEB",
    marginTop: 10,
    borderRadius: 10,
    paddingBottom: 10,
  },
  photoManagerTitle: {
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 4,
    fontSize: 16,
  },
  takePhotoButton: {
    height: 40,
    width: 100,
    margin: 3,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 4,
    justifyContent: 'center',
  },
  pickImageText: {
    marginTop: 5,
    marginLeft: 5,
  },
  preuveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#EBEBEB',
    marginBottom: 10,
    borderRadius: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preuve: {
    height: 100,
    width: 100,
    borderRadius: 5,
    alignContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 5,
    flexWrap: 'wrap',
  },
  resetProofTouchable: {
    height: 19.5,
    width: 19,
    position: 'absolute',
    borderRadius: 10,
    margin: 2,
    zIndex: 99,
    backgroundColor: '#fff',
  },
  resetProofIcon: {
    marginTop: -1,
  },
  takePhotoView: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#fff',
    height: 95,
    marginTop: 7,
    margin: 5,
  },
});

export default Scan;
