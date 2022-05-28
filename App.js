import { StatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker'
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';



export default function App() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    {label: 'Food1', value: 'f1'},
    {label: 'Food2', value: 'f2'},
    {label: 'Food3', value: 'f3'}
  ]);

  return(
    <View style={styles.container}>
    <Text style = {styles.title}>Take a picture of your food, and tell us what you ate!</Text>
    <StatusBar style="auto" />

    <View style = {styles.imgBox}>
      <Text>Tap here to select from your image gallery</Text>
    </View>

    <Text style={styles.reg}>Select what foods you got, and estimate your portion sizes:</Text>

    

    <DropDownPicker
      open = {open}
      items={items}
      value = {value}
      setOpen = {setOpen}
      setItems={setItems}
      setValue = {setValue}
      // containerStyle={{height: 40}}
      // defaultIndex={0}
      multiple = {true}
    />
  </View>
  );
    
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    // textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  reg:{
    fontSize: 20,
    textAlign: 'center',
  },
  imgBox: {
    width: '80%',
    height: '30%',
    alignItems: 'center',
    backgroundColor: '#d4d4d4',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    
  }
});

// export default App;