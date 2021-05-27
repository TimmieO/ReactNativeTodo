import React, {Component, useState, useCallback, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, Pressable, Keyboard, SafeAreaView, Alert, Dimensions, AsyncStorage, AlertIOS } from 'react-native';

import CreateTaskModule from './components/modules/CreateTaskModule';
import EditTaskModule from './components/modules/EditTaskModule';
import ProfileModule from './components/modules/ProfileModule';
import TaskInfoModule from './components/modules/TaskInfoModule';

import Loading from './components/screens/Loading';
import deviceStorage from './services/deviceStorage';
import DisplayTask from './components/tasks/DisplayTasks';
import DropDownNav from './components/extras/DropdownNav';

import RegisterForm from './components/screens/Register';
import LoginForm from './components/screens/Login';

import jwt_decode from "jwt-decode";

import SectionHeader from './components/SectionHeader';

/*DONE-
  Fixa ett bra sätt att stänga ner modulen på
  Fixa ett sätt att skapa components
  Fixa ett sätt att kalla funktioner rätt
  Fixa ett sätt att ändra states på
  Fixa ett sätt att öppna edit module
  Fixa 'create' på open module och 'edit'
  Fixa search
  Fixa cancel search
  Fixa search på button
  Fixa så att allt visas endast 1 gång när man avslutar sökning
  Fixa så att endast det som söks på visas
  Fixa ett sätt att skicka data till edit modulen
  Forska i hur React funkar mer djupgående
  Fixa ett sätt att ändra saker när du ändrar i modulen
  Fixa så att den tar bort all value från input när du klickar på cancel
  Fixa klart 'EditTaskModule.js'
  Fixa Edit till databasen
  Fixa insert i db vid register
  Fixa auth med hjälp av det som användaren skriver in i Auth fältet på register
  Login / Register
  Logged in check
  Lägg till lösenord check på register
  Fixa check på register input
  Fixa email korrekt form endast
  Fixa storage för inloggad (Håller sig inloggad)
  Fixa hämta kort för användaren
  Fixa så korten länkas till rätt användare
  Fixa registrering
  Fixa inloggning
  Fixa DBcheck vid inloggning
  Fixa removeItem på jwt
  Fixa ladda tasks direkt vid inloggning
  Fixa register laddas vid logout
  Lägg till säkerhets check på edit på alla färger, så den koppplar rätt, om man inte väljer ny
  Fixa hamburgar meny
  Flytta + för lägga till kort
  Fixa ansiktsikon för profil
  Fixa i SectionHeader.js

*/

/*TODO-
  -FÖRST-
  Fíxa i AllTask.js

  -SENARE-
  Fixa snyggare kod
  Fixa snyggare colorpicker
  Fixa så att alla funktioner ligger snyggare
  Fixa så att data man skickar från modulerna skickas i objekt, så det blir lättare
  Fixa en Auth komponent
  Fixa stylen på alla komponenter
  Fixa settings modul (Dark mode, och andra hjälp för döva, blinda etc )

  -SIST-
  Fixa prata för att lägga till text
  Fixa faceID inloggning
  Fixa finger för inloggning
  Fixa notifikationer

  Lägga till task_info i db
  Innehåll
  - Created date
  - Last edited date
  - Latest edit type
*/

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({username: null, user_id: null})

  const [display, setDisplay] = useState({login: true, register: false, dropDown: false});
  const [displayDropDown, setDisplayDropDown] = useState(false);
  const [moduleOpen, setModuleOpen] = useState({create:false, edit: false, profile: false, taskInfo: false});

  const [loadingTasks, setLoadingTasks] = useState();

  const checkLoggedIn = async(key) => {
    let tokenKey = await AsyncStorage.getItem(key);
    if(tokenKey){
      setLoggedIn(true);
      var decoded = jwt_decode(tokenKey)

      await setUser(user => ({...user, username: decoded.username}))
      await setUser(user => ({...user, user_id: decoded.id}))

      //Start loading tasks
      setLoadingTasks(true);
      loadTasks(decoded.id);
    }
    if(!tokenKey){
      setLoggedIn(false);
    }
  }
  //Task states
  const [taskList, setTaskList] = useState([]);
  const [doSearch, setDoSearch] = useState(false);
  const [searchedTask, setSearchedTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);

  //Stateless component, have to use useEffect
  useEffect(() => {
    //Check if logged in, set to state and load tasks
    checkLoggedIn('token');

  }, [])

  /*-Functions-*/

  //User
  const registerUser = async(regData) => {
    await fetch("http://192.168.10.198:5000/addUser", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname: regData.firstname,
        lastname: regData.lastname,
        email: regData.email,
        username: regData.username,
        password: regData.password,
        auth: regData.user_auth
      })
    }).then((res) => res.json())
      .then(result=>{
        display.login ? setDisplay(display => ({...display, login: false})) : [setDisplay(display => ({...display, login: true})), setDisplay(display => ({...display, register: false}))]
      })
  }
  const loginUser = async(loginData) => {
    await fetch("http://192.168.10.198:5000/loginUser", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username : loginData.username,
        password : loginData.password
      })
    }).then((res) => res.json())
      .then(result=>{
        if(result.auth == true){
          deviceStorage.saveItem("token", result.token);
          setDisplay(display => ({...display, login: false}));
          setLoggedIn(true);
        }
        if(result.auth == false){

        }
      })
  }
  const logOut = async() => {
    await deviceStorage.removeItem("token");
    setLoggedIn(false);
    setDisplay(display => ({...display, login: true}));
  }

  //Handling tasks
  const loadTasks = async(user_id) => {
    //Fetch all tasks
    await fetch("http://192.168.10.198:5000/getTask", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id
      })
    }).then((res) => res.json())
      .then(result=>{
        //Remove loading
        setLoadingTasks(false);
        setTaskList([]); //Empty array to ensure only 1 of everything
        //Loop through results and put into array
        for(let i = 0; i < result.length; i++){
          let data = {text: result[i].task_title, key: result[i].task_id, bgColor: result[i].bgColor, titleColor: result[i].titleColor}
          setTaskList(taskList => [...taskList, data])
        }
      })
  }
  const addTask = async(title, bgColor, titleColor) => {
    //Set default values
    if(bgColor == undefined){
      bgColor = 'white';
    }
    if(titleColor == undefined){
      titleColor = "black";
    }

    //Fetching post to rest api
    await fetch("http://192.168.10.198:5000/addTask", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.user_id,
        title: title,
        bgColor: bgColor,
        titleColor: titleColor
      })
    }).then((res) => res.json())
      .then(result=>{
        console.log(result);
        let data = {text: result.title, key: result.id, bgColor: result.bgColor, titleColor: result.titleColor}
        setTaskList(taskList => [...taskList, data])
      })

    //Closing the module on submit
    moduleStateHandler('create');
  }
  const editTask = async(key, title, bgColor, titleColor) => {
    if(bgColor == undefined){
      bgColor = selectedTask.bgColor;
    }
    if(titleColor == undefined){
      titleColor = selectedTask.titleColor
    }
    await fetch("http://192.168.10.198:5000/updateTask", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: key,
        title: title,
        bgColor: bgColor,
        titleColor: titleColor
      })
    }).then((res) => res.json())
      .then(result=>{
        //Get list
        let taskItem = [...taskList];
        //Create object with all parameters
        let data = {text: title, key: key, bgColor: bgColor, titleColor: titleColor}
        for(let i = 0; i< taskList.length; i++){
          if(taskList[i].key == key){
            //Splice to replace
            taskItem.splice(i, 1, data);
          }
        }
        //Insert list into taskList
        setTaskList(taskItem);
      })

    //Close edit module
    moduleStateHandler('edit');
  }
  const removeTask = async(key) => {
    await fetch("http://192.168.10.198:5000/removeTask", {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: key,
      })
    }).then((res) => res.json())
      .then(result=>{
        setTaskList((prevTodo) => {
          return prevTodo.filter(taskList => taskList.key != key )
        })
      })
  }

  const getSearchTask = (searchedLetters) => {
    setSearchedTask([])
    for(let i = 0; i < taskList.length; i++){
      if(taskList[i].text.startsWith(searchedLetters)){
        let task = taskList[i]
        setSearchedTask(searchedTask => [...searchedTask, task])
      }
    }
  }
  const performSearch = () => {
    setDoSearch(true);
  }
  const cancelSearch = () => {
    setDoSearch(false)
  }

  //Change state for displays
  const moduleStateHandler = (action, task) => {
    console.log("hey");
    if(action == 'create'){
      moduleOpen.create ? setModuleOpen(moduleOpen => ({...moduleOpen, create: false})): setModuleOpen(moduleOpen => ({...moduleOpen, create: true}))
    }
    if(action == 'edit'){
      setSelectedTask(task);
      moduleOpen.edit ? setModuleOpen(moduleOpen => ({...moduleOpen, edit: false})): setModuleOpen(moduleOpen => ({...moduleOpen, edit: true}))
    }
    if(action == 'taskInfo'){
      setSelectedTask(task);
      moduleOpen.taskInfo ? setModuleOpen(moduleOpen => ({...moduleOpen, taskInfo: false})) : setModuleOpen(moduleOpen => ({...moduleOpen, taskInfo: true}))
      console.log("hey");
    }
    if(action == 'profile'){
      moduleOpen.profile ? setModuleOpen(moduleOpen => ({...moduleOpen, profile: false})) : setModuleOpen(moduleOpen => ({...moduleOpen, profile: true}))
    }

    if(action == 'showLogin'){
      display.login ? setDisplay(display => ({...display, login: false})) : [setDisplay(display => ({...display, login: true})), setDisplay(display => ({...display, register: false}))]
    }
    if(action == 'showRegister'){
      display.register ? setDisplay(display => ({...display, register: false})) : [setDisplay(display => ({...display, register: true})), setDisplay(display => ({...display, login: false}))]
    }
    if(action == 'dropdown'){
      display.dropDown ? setDisplay(display => ({...display, dropDown: false})) : setDisplay(display => ({...display, dropDown: true}))
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={Keyboard.dismiss} accessible={false}>

        {moduleOpen.create ? <CreateTaskModule addTask={addTask} handleModule={moduleStateHandler} key={"createModule"}/> : !<CreateTaskModule/>}
        {moduleOpen.edit ? <EditTaskModule editTask={editTask} task={selectedTask} handleModule={moduleStateHandler} key={"editModule"}/> : !<EditTaskModule/>}
        {moduleOpen.profile ? <ProfileModule userInfo={user} logOut={logOut} handleModule={moduleStateHandler} key={"profileModule"}/> : !<EditTaskModule/>}
        {moduleOpen.taskInfo ? <TaskInfoModule item={selectedTask} handleModule={moduleStateHandler} key={"taskInfoModule"}/> : !<TaskInfoModule/>}


        <View style={styles.taskWrapper}>
          {loggedIn ?
            <SectionHeader handleModule={moduleStateHandler} searchTask={getSearchTask} performSearch={performSearch} cancelSearch={cancelSearch} dispDropDown={display.dropDown}/>
            :
            [
              display.register ? <RegisterForm register={registerUser} handleModule={moduleStateHandler} key={"register"}/> : null,
              display.login ? <LoginForm login={loginUser} handleModule={moduleStateHandler} key={"login"} /> : null
            ]
          }
          {display.dropDown ? <DropDownNav handleModule={moduleStateHandler} logOut={logOut}/> : !<DropDownNav/>}


          {loadingTasks ? <Loading /> : null}
          { loggedIn ?
            <DisplayTask doSearch={doSearch} handleModule={moduleStateHandler} removeTask={removeTask} searchedTask={searchedTask} taskList={taskList}/>
            :
            null
          }
        </View>


      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle:{
    fontSize: 24,
    fontWeight: 'bold',
  },
  addTask:{
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskWrapper: {
    width: "100%",
    height: "100%"
  },
  items:{
    marginTop: 30
  },

});