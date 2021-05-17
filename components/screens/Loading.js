import React, {Component, useState, useEffect} from 'react';
import { StyleSheet, Text, Button, View, Dimensions, Animated, Easing} from 'react-native';
import EIcon from 'react-native-vector-icons/EvilIcons';

const {height} = Dimensions.get('window');

export default function Loading({}){

  const animation = useState(new Animated.Value(0))[0];

  const CallAnimation=()=>{
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver:false,
      easing: Easing.linear,
    }).start(() => CallAnimation());
  }

  useEffect(() => {
    CallAnimation();
  }, [])

  const RotateData = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[styles.spinnerContainer, {transform: [{rotate: RotateData}]}]}>
        <EIcon name="spinner" style={styles.spinner}/>
      </Animated.View>
      <Text>Loading</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  //Outer
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    fontSize: 40
  }
});