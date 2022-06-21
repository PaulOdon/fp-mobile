import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image, 
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

const ForgotPassword = (props) => {

  const sendRequestForgotPassword = () => {
    alert("Demande de réinitialisation de mot de passe envoyé, vous allez recevoir un email.")
  }

  const goToLogin = () => {
    props.navigation.navigate("Login");
  }

  return (
    <KeyboardAvoidingView style={styles.superContainer}>
      <ScrollView>  
        <View style={styles.container}>
            <View style={styles.logoView}>
                <Image source={require("./../assets/img/logo.png")} style={styles.logoImage}/>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Réinitialiser mot de passe</Text>
            </View>

            <View style={styles.formView}>
                <View style={styles.formRow}>
                  <View style={styles.emailView}>
                      <Text style={styles.inputlabel}>Email</Text>
                      <View style={styles.textInput}>
                      <TextInput 
                          placeholder="jean@gmail.com"
                          />
                      </View>
                  </View>
                  
                  <View style={styles.forgotPwdView}>
                      <TouchableOpacity onPress={goToLogin}>
                        <Text>Aller à la page de login</Text>
                      </TouchableOpacity>
                  </View>

                  <View style={styles.rectangleContainerView}>
                      <View style={styles.rectangleView}></View>
                  </View>

                  <View style={styles.submitContainerView}>
                      <TouchableOpacity 
                        onPress={sendRequestForgotPassword}
                        style={styles.submitTouchable}>
                        <Text style={styles.submitText}>Envoyer</Text>
                      </TouchableOpacity>
                  </View>
                </View>
            </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20
  },


  logoView: {
    flex:2,
    alignItems: "center",
    justifyContent: "center"
  },

  logoImage: {
    height: 156,
    width: 260
  },

  titleText: {
    textAlign: "center",
    fontSize: 20
  },

  formView: {
    flex: 4,
    padding: 10,
    marginTop: 10,
    shadowColor: "#ddd",
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
    margin: 10
  },

  inputlabel: {
    marginVertical: 10,
    fontSize: 14,
    fontFamily: "Arial",
    color: "#276AB1"
  },

  textInput: {
    borderWidth: 2,
    borderColor: "#276AB1",
    borderRadius: 30,
    height: 48,
    marginBottom: 16,
    paddingHorizontal: 20,
    fontSize: 14
  },

  forgotPwdView: {
    alignItems: "flex-end",
    marginBottom: 25,
    marginRight: 5
  },

  rectangleContainerView: {
    alignItems: "center",
    marginBottom: 25
  },

  rectangleView: {
    height: 4,
    width: 24,
    borderRadius: 2,
    backgroundColor: "#276AB1"
  },

  submitContainerView: {
    alignContent: "center",
  },

  submitTouchable: {
    height: 48,
    alignItems: "center",
    alignContent: "center",
    textAlignVertical: "center",
    backgroundColor: "#276AB1",
    borderRadius: 24,
    padding: 13
  },

  submitText: {
    color: "#fff",
    fontSize: 14
  }
});

export default ForgotPassword;
