import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from './../services/Auth.service';
import Loading from '../components/shared/Loading';

const Login = (props) => {

  const passwordRef = useRef()
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [isloading, setIsLoading] = useState(false);

  const togglePassword = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const goToForgotPassword = () => {
    props.navigation.navigate('ForgotPassword');
  };

  const storeUser = async (value) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (data) => {
    setIsLoading(true);
    try {
      const user = await authService.login(data)
      if (user) {
        storeUser(user)
        if (user.role.name === "Coursier" || user.role.name === "Admin") {
          props.navigation.navigate('Dashbord');
          setIsLoading(false);
        } else {
          Toast.show({
            type: 'error',
            text1: "Erreur!",
            text2: "Vérifiez votre compte!"
          })
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Login ou mot de passe incorrecte'
      })
    }
    setIsLoading(false);
  }

  return (
    <KeyboardAvoidingView style={styles.superContainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.logoView}>
            <Image
              source={require('./../assets/img/logo.png')}
              style={styles.logoImage}
            />
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={values => {
              login(values);
            }}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, resetForm }) => (
              <View style={styles.formView}>
                <View style={styles.formRow}>
                  <View style={styles.emailView}>
                    <Text style={styles.inputlabel}>Email</Text>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        name="email"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        placeholder="jean@gmail.com"
                        keyboardType='email-address'
                        returnKeyType='next'
                        returnKeyLabel='Suivant'
                        onSubmitEditing={() => {
                          passwordRef.current.focus();
                        }}
                        style={styles.textInput}
                        blurOnSubmit={false}
                      />
                    </View>
                    {errors.email && <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>}
                  </View>

                  <View style={styles.pwdView}>
                    <Text style={styles.inputlabel}>Mot de passe</Text>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        name="password"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        style={styles.textInput}
                        placeholder="Mot de passe"
                        secureTextEntry={secureTextEntry}
                        ref={passwordRef}
                        returnKeyType='done'
                        onSubmitEditing={handleSubmit}
                      />
                      <TouchableOpacity onPress={togglePassword} style={styles.showPasswordTouchable}>
                        <Icon
                          type="ionicon"
                          color="#276AB1"
                          name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                          size={26}
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={{ fontSize: 10, color: "red" }}>{errors.password}</Text>}
                  </View>

                  {/* <View style={styles.forgotPwdView}>
                    <TouchableOpacity onPress={goToForgotPassword}>
                      <Text>Mot de passe oublié</Text>
                    </TouchableOpacity>
                  </View> */}

                  <View style={styles.rectangleContainerView}>
                    <View style={styles.rectangleView}></View>
                  </View>

                  <View style={styles.submitContainerView}>
                    <TouchableOpacity
                      disabled={!isValid}
                      onPress={handleSubmit}
                      style={styles.submitTouchable}>
                      <Text style={styles.submitText}>Se connecter</Text>
                    </TouchableOpacity>
                  </View>
                  {isloading ? <Loading /> : null}
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Adresse email incorrecte').required('* Ce champ est obligatoire'),
  password: Yup.string().required('* Ce champ est obligatoire')
})

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20,
    paddingBottom: 200,
  },

  logoView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    height: 130,
    width: 260,
  },

  titleContainer: {},

  titleText: {
    textAlign: 'center',
    fontSize: 20,
  },

  formView: {
    flex: 4,
    padding: 10,
    marginTop: 10,
    shadowColor: '#ddd',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1.41,
    elevation: 4,
    // borderWidth: 1
  },

  formRow: {
    margin: 10,
  },

  inputlabel: {
    marginVertical: 10,
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#276AB1',
  },

  textInputContainer: {
    borderWidth: 2,
    borderColor: '#276AB1',
    borderRadius: 30,
    height: 48,
    marginBottom: 6,
    paddingHorizontal: 15,
    fontSize: 14,
    flexDirection: 'row',
  },

  textInput: {
    flex: 10,
  },

  showPasswordTouchable: {
    marginTop: 10,
    alignContent: 'center',
    alignItems: 'flex-end',
  },

  forgotPwdView: {
    alignItems: 'flex-end',
    marginBottom: 25,
    marginRight: 5,
  },

  rectangleContainerView: {
    alignItems: 'center',
    marginBottom: 25,
  },

  rectangleView: {
    height: 4,
    width: 24,
    borderRadius: 2,
    backgroundColor: '#276AB1',
  },

  submitContainerView: {
    alignContent: 'center',
  },

  submitTouchable: {
    height: 48,
    alignItems: 'center',
    alignContent: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#276AB1',
    borderRadius: 24,
    padding: 13,
  },

  submitText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Login;
