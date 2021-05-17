import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, Button, View, TextInput, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { ColorPicker, fromHsv  } from 'react-native-color-picker';
import FIcon from 'react-native-vector-icons/Feather';

export default function FormErrorMessage({type, message}){
  if(type == 'register'){
    return (
      <View style={styles.messageContainer}>
       <Text style={styles.errorMessage}>Required fields not filled! (*)</Text>
      </View>
    )
  }

  if(type == 'login'){
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.errorMessage}>Make sure filled the form correctly!</Text>
      </View>
    )
  }

  if(type == 'other'){
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  //Outer
  messageContainer:{
  },
  errorMessage:{
    fontSize: 10,
    color: 'red'
  }
});
