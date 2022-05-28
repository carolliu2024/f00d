import Photo from './photo.js';

import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
// import Photo from './photo';
// import NativeImagePickerIOS from 'react-native/Libraries/Image/NativeImagePickerIOS';


export default function App() {
  

  return(
      <View>
        <Photo>

        </Photo>
      </View>
  );
    
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },
});

// export default App;

