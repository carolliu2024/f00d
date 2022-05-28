import { StatusBar } from 'expo-status-bar';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView } from 'react-native';
// import NativeImagePickerIOS from 'react-native/Libraries/Image/NativeImagePickerIOS';


export default function Photo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    {label: 'Food1', value: 'f1'},
    {label: 'Food2', value: 'f2'},
    {label: 'Food3', value: 'f3'}
  ]);
  const [pickedImagePath, setPickedImagePath] = useState('');

  // const options1 = {
  //   title: 'Take Image',
  //   options: {
  //     saveToPhotos: true,
  //     mediaType: 'photo',
  //   },
  // };

  const options2 = {
      title: 'Select Image',
      options: {
        maxHeight: 200,
        maxWidth: 200,
        selectionLimit: 0,
        mediaType: 'photo',
      },
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      // setImage(result.uri);
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  };

  return(
      <View style = {styles.container}>
        <Text style = {styles.title}>Take a picture of your food, and tell us what you ate!</Text>
        <StatusBar style="auto" />

        <View style = {styles.imgBox}>
          {
            pickedImagePath == '' ? <Text>Upload your image here!</Text>:
             <Image
              source={{ uri: pickedImagePath }}
              style={styles.image}
            />
          }
        </View>
        <Button
          title = "Select from Image Gallery"
          onPress = {pickImage}
        />
        <View style={styles.imageContainer}>
          
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
    
  },
  imageContainer:{
    padding:30,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  scrollView: {
    // backgroundColor: 'pink',
    marginHorizontal: 20,
  },
});

// export default App;

