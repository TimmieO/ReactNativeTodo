import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, Button, View, ScrollView, FlatList, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';

import AllTask from './AllTask';
import SearchedTask from './SearchedTask';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function DisplayTask({doSearch, handleModule, removeTask, searchedTask, taskList}){

  useEffect(() => {
  }, [])

  return (

    <SafeAreaView style={styles.items}>
      {doSearch ?
        <FlatList
          data={searchedTask}
          renderItem={({item}) => (
            <SearchedTask item={item} removeTask={removeTask} handleModule={handleModule}/>
          )}
        />
        :
        <FlatList
          data={taskList}
          renderItem={({item}) => (
            <AllTask item={item} removeTask={removeTask} handleModule={handleModule}/>
          )}
        />
      }
    </SafeAreaView>
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