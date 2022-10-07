import React from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';


export default function Chat(props) {
  let {name, color} = props.route.params;
  props.navigation.setOptions({title:name});

    return (
      <View style={[{backgroundColor:color}, styles.container]}>
        <Text style={styles.text}>Chat Screen!</Text>
        
      </View>
    
    )
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    color: '#ffffff',
  },

});
