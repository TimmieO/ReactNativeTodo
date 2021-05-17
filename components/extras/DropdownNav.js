import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, Button, View, TextInput, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function DropDownNav({userInfo, logOut, handleModule}){


  return (
    <View style={styles.moduleOuterContainer}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.moduleInnerContainer}>
          <View style={styles.dropDownHeader}>
            <Text style={styles.headerText}>Nav</Text>
          </View>
          <View style={styles.dropDownItems}>
            <Text style={styles.itemText} onPress={() => {handleModule("profile"); handleModule("dropdown")}}><FIcon name="user" style={styles.itemIcon}/>Profile</Text>
            <Text style={styles.itemText} onPress={() => {handleModule("create"); handleModule("dropdown")}}><FIcon name="plus" style={styles.itemIcon}/>New Card</Text>
            <Text style={styles.itemText} onPress={() => {logOut(); handleModule("dropdown")}}><FIcon name="log-out" style={styles.itemIcon}/>Log Out</Text>
          </View>
        </View>
      </Pressable >
    </View>
  )
}

const styles = StyleSheet.create({
  //Outer
  moduleOuterContainer: {
    backgroundColor: 'grey',
    //Align self on top
    flex: 1,
    position: 'absolute',
    zIndex: 10,
    //Align inner container
    height: windowHeight * 0.2,
    width: windowWidth * 0.4,
    marginTop: windowHeight * 0.05,
    right: 0,
    top: 0,
    borderWidth: 2
  },
  dropDownHeader:{
    marginBottom: 15,
    borderBottomWidth: 1,
  },
  headerText:{
    textAlign: 'center',
    fontSize: 25,
  },
  dropDownItems:{

  },
  itemText:{
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10
  },
  itemIcon:{
    fontSize:20,
    textAlign: 'left',
  }
});