import React, {Component, useState} from 'react';
import { StyleSheet, Text, View, Pressable, Keyboard, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import TaskModule from './modules/CreateTaskModule';
import FIcon from 'react-native-vector-icons/Feather';


/*TODO-
  Fixa dropdown menu på ett snyggt sätt
 */

//Do if on search and show remove
export default function SectionHeader({handleModule, searchTask,performSearch,cancelSearch,dispDropDown}){
  const [inputValue, setInputValue] = useState()

  const emptySearchBox = () => {
    setInputValue('');
  }
  const changeHandler = (value) => { //grabs textinput value and puts it in state
    setInputValue(value);
  }

  return (
    <SafeAreaView  style={styles.sectionHeader}>
      <View style={styles.headerTop}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        <FIcon name={dispDropDown ? "x" : "menu"} style={styles.headerHamburgerMenu} onPress={()=> {handleModule('dropdown')}}/>
      </View>
      <View style={styles.headerSearch}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for task"
            onChangeText={(text) => {searchTask(text); changeHandler(text)}}
            value={inputValue}
          />
          <Pressable onPress={() => {cancelSearch(); emptySearchBox(); Keyboard.dismiss()}}>
            <FIcon name="x-circle" style={styles.cancelSearchBtn}/>
          </Pressable>
        </View>
        <View style={styles.buttonHolder}>
          <Pressable onPress={performSearch}>
            <FIcon name="search" style={styles.searchButton} />
          </Pressable>
        </View>
      </View>
      <View style={styles.newCardIconContainer}>
        <Text style={styles.newCardText}>New Card <FIcon name="plus-circle" style={styles.newCardIcon} onPress={()=> {handleModule('create')}}/></Text>

      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  headerTop:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle:{
    fontSize: 30,
    fontWeight: 'bold',
  },
  headerHamburgerMenu:{
    fontSize: 25,
    fontWeight: 'bold',
    marginRight: 5,
    zIndex: 10
  },

  /*Search bar*/
  headerSearch:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
  },
  /*Search bar container*/
  searchBarContainer:{
    width: "90%",
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelSearchBtn:{
    position: 'absolute',
    fontSize: 20,
    right: 5,
  },
  searchBar:{
    width: "100%",
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderRightWidth: 0,
    fontSize: 20,
  },
  /*Search button container*/
  buttonHolder:{
    width: "10%",
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  searchButton:{
    fontSize: 25,
    fontWeight: 'bold'
  },
  newCardIconContainer:{
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 10,
  },
  newCardText:{
    fontSize: 15
  },
  newCardIcon:{
    fontSize: 15
  }
});
