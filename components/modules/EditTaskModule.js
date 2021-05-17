import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, Button, View, TextInput, Keyboard, Pressable, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { ColorPicker, fromHsv  } from 'react-native-color-picker';
import FIcon from 'react-native-vector-icons/Feather';

/*TODO-
  Fixa så man inte måste klicka i mitten på färgen för att välja den

 */

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function TaskModule({editTask, handleModule, task}){
  const [taskText, setTaskText] = useState();
  const [display, setDisplay] = useState({bgColorPicker: false, titleColorPicker: false});
  const [bgColor, setBgColor] = useState();
  const [titleColor, setTitleColor] = useState();

  const changeText = (text) => { //grabs textinput value and puts it in state
    setTaskText(text);
  }

  useEffect(() => {
    setTaskText(task.text);
  }, [])

  return (
    <View style={styles.moduleOuterContainer}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.moduleInnerContainer}>
          <View style={styles.moduleHeader}>
            <Pressable onPress={()=> handleModule('edit')}>
              <FIcon name="x" style={styles.closeModuleIcon}/>
            </Pressable>
            <Text style={styles.headerText}>EDIT TASK</Text>
          </View>
          <Text style={styles.taskInputLabel} >Task Title</Text>
          <TextInput
            style={styles.editTaskInput}
            value={taskText}
            onChangeText={(text) => {setTaskText(text); changeText(text)}}
          />

          <Text style={styles.taskInputLabel} >Background Color</Text>
          <Pressable onPress={() =>  {display.bgColorPicker ? setDisplay(display => ({...display, bgColorPicker: false})): setDisplay(display => ({...display, bgColorPicker: true})); display.titleColorPicker ? setDisplay(display => ({...display, titleColorPicker: false})) : null}}>
            <Text style={styles.openColorPicker}>{display.bgColorPicker ? "Hide color picker": "Show color picker"} </Text>
          </Pressable>
          {display.bgColorPicker ? <ColorPicker onColorSelected={color => setBgColor(color)} hideSliders style={{flex: 1}} /> : null}

          <Text style={styles.taskInputLabel} >Title Color</Text>
          <Pressable onPress={() => {display.titleColorPicker ? setDisplay(display => ({...display, titleColorPicker: false})): setDisplay(display => ({...display, titleColorPicker: true})); display.bgColorPicker ? setDisplay(display => ({...display, bgColorPicker: false})) : null}}>
            <Text style={styles.openColorPicker}>{display.titleColorPicker ? "Hide color picker": "Show color picker"}</Text>
          </Pressable>
          {display.titleColorPicker ? <ColorPicker onColorSelected={color => setTitleColor(color)} hideSliders style={{flex: 1}} /> : null}
          <View style={styles.moduleControllerContainer}>
            <Button title="Submit" onPress={() => editTask(task.key, taskText, bgColor, titleColor)}/>
            <Button title="Cancel" onPress={()=> handleModule('edit')}/>
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
  taskInputLabel: {
    textAlign: 'center',
    fontSize: 15,
  },
  editTaskInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    textAlign: 'center'
  },
  openColorPicker:{
    textAlign: 'center',
    padding: 5,
    borderWidth: 1,
    fontSize: 15
  },
  moduleControllerContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  }
});