import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = (props) => {

  const [user, setUser] = useState({});
  const [role, setRole] = useState("");

  const getUser = async () => {
    try {
      const userData = JSON.parse(await AsyncStorage.getItem("user"));
      setUser(userData);
      if (userData != null && userData.role != null) {
        setRole(userData.role.name)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollview}>
        <View style={styles.headerView}>
          <View style={styles.avatarContainer}>
            <Icon
              type="ionicon"
              color="#fff"
              name="person-outline"
              size={36}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>{user.firstName + " " + user.lastName}</Text>
            <Text style={styles.userFonction}>{role}</Text>
          </View>
          {/* <View style={styles.editButtonContainer}>
            <TouchableOpacity>
              <Icon
                type="ionicon"
                color="#276AB1"
                name="pencil-sharp"
                size={30}
                style={styles.editImage}
              />
            </TouchableOpacity>
          </View> */}
        </View>
        {/* <View style={styles.cardContainerView}>
          <TouchableOpacity style={[styles.cardView, styles.shadowStyles]}>
            <Text style={styles.countText}>140</Text>
            <Text style={styles.cardTitle}>Livrer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cardView, styles.shadowStyles]}>
            <Text style={styles.countText}>4</Text>
            <Text style={styles.cardTitle}>Urgence</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cardView, styles.shadowStyles]}>
            <Text style={styles.countText}>10</Text>
            <Text style={styles.cardTitle}>En attente</Text>
          </TouchableOpacity>
        </View> */}
        <View style={[styles.formView, styles.shadowStyles]}>
          <View style={styles.textInputContainer}>
            <Icon
              type="ionicon"
              color="#276AB1"
              name="person"
              size={20}
              style={styles.textInputImage}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Nom"
              value={user.lastName}
            />
          </View>
          <View style={styles.textInputContainer}>
            <Icon
              type="ionicon"
              color="#276AB1"
              name="person-outline"
              size={20}
              style={styles.textInputImage}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Prénom"
              value={user.firstName}
            />
          </View>
          {/* <View style={styles.textInputContainer}>
            <Icon
              type="ionicon"
              color="#276AB1"
              name="map-outline"
              size={20}
              style={styles.textInputImage}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Adresse"
            />
          </View> */}
          <View style={styles.textInputContainer}>
            <Icon
              type="ionicon"
              color="#276AB1"
              name="mail-outline"
              size={20}
              style={styles.textInputImage}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={user.email}
            />
          </View>
          {/* <View style={styles.textInputContainer}>
            <Icon
              type="ionicon"
              color="#276AB1"
              name="lock-closed-outline"
              size={20}
              style={styles.textInputImage}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Mot de passe"
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.shwoPwdTouchable}>
              <Icon
                type="ionicon"
                color="#276AB1"
                name="eye-outline"
                size={20}
                style={styles.shwoPwdIcon}
              />
            </TouchableOpacity>
          </View> */}
          {/* <View style={styles.textInputContainer}>
            <Icon
              type="ionicon"
              color="#276AB1"
              name="lock-closed-outline"
              size={20}
              style={styles.textInputImage}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Confirmer mot de passe"
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.shwoPwdTouchable}>
              <Icon
                type="ionicon"
                color="#276AB1"
                name="eye-outline"
                size={20}
                style={styles.shwoPwdIcon}
              />
            </TouchableOpacity>
          </View> */}
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
  },

  scrollview: {
    flex: 1
  },

  headerView: {
    flex: 1,
    // borderWidth: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "stretch",
    marginHorizontal: 20,
    marginVertical: 20,
  },

  avatarContainer: {
    height: 60,
    width: 60,
    backgroundColor: "#276AB1",
    borderRadius: 40,
    alignContent: "center",
    alignItems: "center",
    marginTop: 10
  },

  avatarImage: {
    marginTop: 8
  },

  userInfoContainer: {
    flex: 3,
    alignContent: "center",
    alignItems: "flex-start",
    marginHorizontal: 20,
    paddingTop: 15
  },

  userName: {
    color: "#276AB1",
    fontSize: 18,
    fontWeight: "bold"
  },

  userFonction: {
    color: "#276AB1"
  },

  editButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 5
  },

  editImage: {
    alignItems: "center",
    marginTop: 18,
  },

  cardContainerView: {
    flex: 2,
    // borderWidth: 1,
    flexDirection: "row",
    marginRight: 20
  },

  cardView: {
    flex: 1,
    // borderWidth: 1,
    backgroundColor: "#779FCD",
    marginLeft: 20,
    marginBottom: 30,
    marginTop: 20,
    borderRadius: 8,
    paddingTop: 30,
    paddingLeft: 20,
    height: 105
  },

  countText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },

  cardTitle: {
    color: "#fff",
    fontSize: 14,
  },

  formView: {
    flex: 7,
    // borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 30
  },

  textInputContainer: {
    // flex: 1,
    flexDirection: "row",
    alignContent: "stretch",
    borderBottomWidth: 2,
    borderBottomColor: "#779FCD",
    // height: 30,
    marginVertical: 10
  },

  textInputImage: {
    marginTop: 14,
    // flex: 1,
    height: 20,
    width: 20,

  },

  textInput: {
    flex: 6,
    fontSize: 16,
    marginLeft: 10,
    color: "#276AB1",
    marginBottom: -5
  },

  shwoPwdTouchable: {
    width: 20,
    height: 20,
    marginRight: 15,
    marginTop: 15
  },

  shwoPwdIcon: {
    height: 20,
    width: 20,
  },

  shadowStyles: {
    shadowColor: "#ddd",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1.41,
    elevation: 4,
    padding: 14
  }
});

export default Profile;
