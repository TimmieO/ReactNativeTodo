import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, Button, View, TextInput, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { ColorPicker, fromHsv  } from 'react-native-color-picker';
import FIcon from 'react-native-vector-icons/Feather';

/*TODO-
  Fixa profileModule submit, så det endast är klick på "Submit", inte hela raden
  Fixa bättre profile module
  Mer information i profile module
  Möjlighet att ändra data i profile module
 */

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ProfileModule({userInfo, logOut, handleModule}){

  const [username, setUsername] = useState();


  const changeUsername = (text) => { //grabs textinput value and puts it in state
    setUsername(text);
  }

  useEffect(() => {
    setUsername(userInfo.username)
  }, [])

  return (
    <View style={styles.moduleOuterContainer}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.moduleInnerContainer}>
          <View style={styles.moduleHeader}>
            <Pressable onPress={()=> handleModule('profile')}>
              <FIcon name="x" style={styles.closeModuleIcon}/>
            </Pressable>
            <Text style={styles.headerText}>Profile</Text>
          </View>
          <View style={styles.profileWelcome}>
            <Text style={styles.profileWelcomeText} >Hello </Text>
            <TextInput
              style={[styles.usernameInput, styles.profileWelcomeText]}
              onChangeText={(text) => {changeUsername(text)}}
              value={username}
            />
          </View>
          <View style={styles.profileId}>
            <Text style={styles.userIdText} >UserID - {JSON.stringify(userInfo.user_id)}</Text>
          </View>
          <View style={styles.profileSubmitContainer}>
            <Button title="Logout" style={styles.profileLogout} onPress={() => {logOut(); handleModule('profile') }}/>
            <Button title="Submit" style={styles.profileSubmit} />
          </View>
        </View>
      </Pressable >
    </View>
  )
}

const styles = StyleSheet.create({
  //Outer
  moduleOuterContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    //Align self on top
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 5,
    //Align inner container
    justifyContent: 'center',
    alignItems: 'center',
  },
  //Inner
  moduleInnerContainer: {
    backgroundColor: 'white',
    width: windowWidth * 0.8,
    height: windowHeight * 0.8,
  },
  profileWelcome:{
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20
  },
  usernameInput:{
    borderBottomWidth: 1,
    maxWidth: windowWidth * 0.5
  },
  profileWelcomeText:{
    fontSize: 25
  },
  //Module header text
  headerText:{
    fontSize: 25,
    marginTop: 15,
    marginBottom: "15%",
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeModuleIcon:{
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 15
  },
  userIdText: {
    textAlign: 'center',
    fontSize: 15,
  },
  profileSubmitContainer:{
    position: 'absolute',
    bottom: 0,
    width: '100%'
  }
});