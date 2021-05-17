import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, Button, View, TextInput, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { ColorPicker, fromHsv  } from 'react-native-color-picker';
import FIcon from 'react-native-vector-icons/Feather';
import FormErrorMessage from '../../functions/message/FormError';

/*TODO-
  Fixa finare färg på rutorna
  Fixa bättre "error" meddelande, exempelvis att emailen redan finns
  Fixa password length

*/

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function RegisterForm({register, handleModule}){

  const [formData, setFormData] = useState({firstname: null, lastname: null, username: null, email: null, password: null, confirmPassword: null, user_auth: null});
  const [formValid, setFormValid] = useState({usernameFree: null, emailFree: null, passwordsMatch: null, emailValid: null})

  const [showMessage, setShowMessage] = useState(false);

  //Create auth string
  const createAuthString = () => {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let string_length = 64;
    let auth_str = '';
    for (let i=0; i<string_length; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      auth_str += chars.substring(rnum,rnum+1);
    }
    setFormData(formData => ({...formData, user_auth: auth_str}))
  }

  //Stateless component, have to use useEffect
  useEffect(() => {
    createAuthString();
  }, [])

  //Validation of form(Make sure every field is filled in)
  const formValidation = async(formData, action) => {

    //Check if email and username is free
    if(action == 'checkEmail' || action == 'checkUsername'){
      //Check if email is valid
      if(action == 'checkEmail'){
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let emailFormatValid = re.test(String(formData.email).toLowerCase());
        setFormValid(formValid => ({...formValid, emailValid: emailFormatValid}))
      }

      let url;
      let inputVal = '';
      switch (action) {
        case "checkEmail":
        {
          url = "http://192.168.10.198:5000/checkEmail";
          inputVal = formData.email;
          break;
        }
        case "checkUsername":
        {
          url = "http://192.168.10.198:5000/checkUsername";
          inputVal = formData.username;
          break;
        }
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: inputVal })
      };
      const uniqueCheck = await fetch(url, requestOptions)
      const checkResponse = await uniqueCheck.json();
      console.log(checkResponse);
      if(checkResponse[0].userCount > 0){
        if(action == 'checkEmail'){setFormValid(formValid => ({...formValid, emailFree: false})); }
        if(action == 'checkUsername'){setFormValid(formValid => ({...formValid, usernameFree: false}))}
      }
      if(checkResponse[0].userCount < 1){
        if(action == 'checkEmail'){setFormValid(formValid => ({...formValid, emailFree: true}))}
        if(action == 'checkUsername'){setFormValid(formValid => ({...formValid, usernameFree: true}))}
      }
    }
    if(action == 'passwordMatch'){
      if(formData.password == formData.confirmPassword){
        setFormValid(formValid => ({...formValid, passwordsMatch: true}))
      }
      if(formData.password != formData.confirmPassword){
        setFormValid(formValid => ({...formValid, passwordsMatch: false}))
      }
    }

    //On Submit
    if(action == 'submit'){
      //Form not filled correctly
      if(Object.keys(formValid).every(function(k){ return formValid[k]}) == false){
        setShowMessage(true);
      }
      //Form filled
      if(Object.keys(formValid).every(function(k){ return formValid[k]}) == true){
        setShowMessage(false);
        register(formData)
      }
    }

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.regOuterContainer}
    >
      <View style={styles.regContainer}>
        <Pressable onPress={Keyboard.dismiss} accessible={false}>

          <View style={styles.registerHeaderContainer}>
            <Text style={styles.registerHeader} >Register</Text>
            <View>
              {showMessage ? <FormErrorMessage type={'register'} /> : null}
            </View>
          </View>

          <View>
            <Text style={styles.taskInputLabel} >First name <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.formInput}
                onChangeText={text => setFormData(formData => ({...formData, firstname: text}))}
              />
            <Text style={styles.taskInputLabel} >Last name <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.formInput}
                onChangeText={text => setFormData(formData => ({...formData, lastname: text}))}
              />
            <Text style={styles.taskInputLabel} >Username <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.formInput}
                onChangeText={text => setFormData(formData => ({...formData, username: text}))}
                onEndEditing={() => formValidation(formData, 'checkUsername')}
              />
            <Text style={styles.taskInputLabel} >Email <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.formInput}
                onChangeText={text => setFormData(formData => ({...formData, email: text}))}
                onEndEditing={() => formValidation(formData, 'checkEmail')}
              />
            <Text style={styles.taskInputLabel} >Password <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={styles.formInput}
                onChangeText={text => setFormData(formData => ({...formData, password: text}))}
                onEndEditing={() => formValidation(formData, 'passwordMatch')}
              />
            <Text style={styles.taskInputLabel} >Confirm Password <Text style={styles.requiredStar}>*</Text></Text>
            <TextInput
              style={styles.formInput}
              onChangeText={text => setFormData(formData => ({...formData, confirmPassword: text}))}
              onEndEditing={() => formValidation(formData, 'passwordMatch')}
            />
            <Text style={styles.taskInputLabel} >Auth</Text>
              <TextInput
                style={[styles.formInput, styles.formAuthInput]}
                value={formData.user_auth}
                editable={false}
              />
            <View>
              <Pressable onPress={() => {handleModule('showLogin')}}>
                <Text style={styles.signInButton}>Sign In</Text>
              </Pressable>
              <Pressable onPress={() => createAuthString()}>
                <Text style={styles.newAuthButton}>New Auth</Text>
              </Pressable>
            </View>
            <View style={styles.submitButton}>
              <Button title="Submit"  onPress={() => formValidation(formData, 'submit')}/>
            </View>
          </View>
        </Pressable >
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  //Outer
  regOuterContainer:{
    flex: 1,
    height: windowHeight,
    width: windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regContainer: {
    backgroundColor: 'white',
    height: windowHeight * 0.5,
    width: windowWidth * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1
  },
  requiredStar:{
    color:'red'
  },
  formInput:{
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    width: windowWidth * 0.5
  },
  formAuthInput:{
    backgroundColor: 'grey',

  },
  newAuthButton:{
    fontSize: 10,
    position: 'absolute',
    borderWidth: 1,
    right: 0,
  },
  registerHeaderContainer:{

  },
  registerHeader:{
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10
  },
  submitButton: {
    marginTop: 20,
  },
  signInButton:{
    fontSize: 10,
    position: 'absolute',
    borderWidth: 1,
    left: 0,
  }

});