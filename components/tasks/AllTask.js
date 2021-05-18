import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';

/*TODO-
  Fixa så man får nya ikoner (Ta bort, cancel, done etc) när man håller in på kort

  Fixa något sätt att checka av de task man gjort och ha dem i någon sorts "Done" lista
  Fixa så man kan sätta timer
  Fixa möjlighet att flytta på alla task
  Fixa att man får olika ikoner (Ta bort, cancel och move) när man håller in, istället för att ta bort direkt

 */

export default function AllTask({item, removeTask, handleModule}) {

  return (
    <TouchableOpacity style={[styles.item, {backgroundColor: item.bgColor}]} onLongPress={() => removeTask(item.key)}>
      <Text style={[styles.itemText, {color: item.titleColor}]}>{item.text}</Text>
      <Pressable onPress={()=> handleModule('edit', item)}>
        <FIcon name="more-vertical" style={styles.taskOptionIcon} />
      </Pressable>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item:{
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  itemText:{
    maxWidth: '80%'
  },
  taskOptionIcon:{
    fontSize: 20,
  }
});