import React, {Component, useState} from 'react';
import { StyleSheet, Text, Button, View, TextInput, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { ColorPicker } from 'react-native-color-picker'
import FIcon from 'react-native-vector-icons/Feather';

/*TODO-
  Build menu to select functions (Picture, edit, etc)
  Add audio recorder for function
  Add photo taking for function

*/

export default function TaskInfoModule({item, handleModule}){

  return (
    <View style={styles.moduleOuterContainer}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.moduleInnerContainer}>
          <View style={styles.moduleHeader}>
            <Pressable onPress={() => handleModule('taskInfo')}>
              <FIcon name="x" style={styles.closeModuleIcon}/>
            </Pressable>
          </View>
            <View style={styles.infoHeader}>
              <Text style={styles.infoHeaderText} >Hello </Text>
              <TextInput
                style={[styles.taskInput, styles.infoHeaderText]}
                value={item.text}
              />
            </View>

        </View>
      </Pressable >
    </View>
  )
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  //Module header text
  moduleHeader:{
    marginTop: 5,
    zIndex: 5
  },
  headerText:{
    fontSize: 25,
    marginTop: 15,
    marginBottom: '15%',
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 1
  },
  infoHeader:{
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20
  },
  taskInput:{
    borderBottomWidth: 1,
    maxWidth: windowWidth * 0.5
  },
  infoHeaderText:{
    fontSize: 25
  },
  closeModuleIcon:{
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 20
  },
  openColorPicker:{
    textAlign: 'center',
    padding: 5,
    borderWidth: 1,
  },
  moduleControllerContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  }
});