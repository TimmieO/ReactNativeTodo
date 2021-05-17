import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, Button, View, TextInput, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { ColorPicker, fromHsv  } from 'react-native-color-picker';
import FIcon from 'react-native-vector-icons/Feather';
import FormErrorMessage from '../../functions/message/FormError';

/*TODO-
  Fixa finare färg på rutorna
  Fixa så meddelande skickas när inloggning misslyckas

 */

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LoginForm({login, handleModule}){

  const [formData, setFormData] = useState({username: null, password: null,});

  const [showMessage, setShowMessage] = useState(false);

  //Stateless component, have to use useEffect
  useEffect(() => {
  }, [])

  const formValidation = (formData) => {
    //Form not filled correctly
    if(Object.keys(formData).every(function(k){ return formData[k]}) == false){
      setShowMessage(true);
    }
    //Form filled
    if(Object.keys(formData).every(function(k){ return formData[k]}) == true){
      login(formData)
      setShowMessage(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.loginOuterContainer}
    >
      <View style={styles.loginContainer}>
        <Pressable onPress={Keyboard.dismiss} accessible={false}>

          <View style={styles.loginHeaderContainer}>
            <Text style={styles.loginHeader} >Login</Text>

            <View>
              {showMessage ? <FormErrorMessage type={'login'} /> : null}
            </View>

          </View>

          <View>
            <Text style={styles.taskInputLabel} >Username</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={text => setFormData(formData => ({...formData, username: text}))}
            />
            <Text style={styles.taskInputLabel} >Password</Text>
            <TextInput
              style={styles.formInput}
              onChangeText={text => setFormData(formData => ({...formData, password: text}))}
            />
            <View>
              <Pressable onPress={() => handleModule('showRegister')}>
                <Text style={styles.signUpButton}>Sign Up</Text>
              </Pressable>
            </View>
            <View style={styles.submitButton}>
              <Button title="Submit"  onPress={() => formValidation(formData)}/>
            </View>
          </View>
        </Pressable >
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  //Outer
  loginOuterContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    backgroundColor: 'white',
    height: windowHeight * 0.5,
    width: windowWidth * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
  loginHeaderContainer:{

  },
  formInput:{
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    width: windowWidth * 0.5
  },

  loginHeader:{
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10
  },
  submitButton: {
    marginTop: 20,
  },
  signUpButton:{
    fontSize: 10,
    position: 'absolute',
    borderWidth: 1,
    left: 0,
  }

});