import { StatusBar } from 'expo-status-bar';
import DropDownPicker from 'react-native-dropdown-picker'

import * as ImagePicker from 'expo-image-picker';

import {Picker} from '@react-native-picker/picker';
import { NavigationContainer, StackActions } from '@react-navigation/native';

import axios from 'axios';


import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, Image, Dimensions } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {PieChart} from 'react-native-chart-kit';

import * as Location from 'expo-location';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// const photoPage = createNativeStackNavigator();


const Stack = createNativeStackNavigator();

export default function App() {

  // REALLY ALL STATE VARS SHOULD BE AT THE TOP
  

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Photo'>
        <Stack.Screen
          name = "Photo"
          component = {photoPage}
        />
        <Stack.Screen
          name = "Graph"
          component = {graphPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
    
}

const graphPage = () => {
  return (
    <View>
      <Text>Your Nutrition Breakdown</Text>
      <PieChart
        data={[
          {
            name: 'Protein',
            population: 21500000,
            color: 'rgba(131, 167, 234, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Carbohydrates',
            population: 2800000,
            color: '#F00',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: 'Fat',
            population: 8538000,
            color: '#ffffff',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ]}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute //for the absolute number remove if you want percentage
      />
    </View>
  );
}

const photoPage = ({navigation}) => {
  const [selectedFood, setSelectedFood] = useState();
  const [selectedPortion, setSelectedPortion] = useState();
  const URL = "http://0.0.0.0:5000";
  const [location, setLocation] = useState(null);
  const [where, setWhere] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [dishPortions, setDishPortions] = useState([]);

  useEffect(() => {
    axios.get(`${URL}/dishPortions?meal=${meal}&hall=${hall}`).then(response => {
      setDishPortions(response.data.data);
    })
  }, [])

  useEffect(() => {
    console.log("dishPortions: ", dishPortions)
    if (dishPortions.length != 0) {
      console.log("DID THIS RUN, ", dishPortions.length)
      setSelectedFood(`${dishPortions[0]['dish']}`);
      setSelectedPortion(`[1] (${dishPortions[0]['portion']}) sized portion`)
    }
  }, [dishPortions])
  
  useEffect(() => {
    console.log("selectedPortion: ", selectedPortion);
  },[selectedPortion])

  // Changes page w/o re-rendering (reloading)
  const notificationListener = useRef();
  const responseListener = useRef();

  // TODO: REFACTOR THIS INTO LOCATION & NOTIFICATION CODE
  useEffect(() => {
    if (Device.brand != null) {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
      
      // Define function and call instantly
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync();
        let {coords} = await Location.getCurrentPositionAsync();
        // let lat = location.coords.latitude;
        // let lon = location.coords.longitude;
        // console.log("what even is lat: ",typeof(lat))
        // let sarge = await Location.geocodeAsync("Sargent Hall")
  
        // const {latitude, longitude} = location;
        // console.log("Longitude:",location.coords.longitude);
        // let coords = location.coords;
        const {latitude, longitude} = coords;
        address = await Location.reverseGeocodeAsync({
          latitude,longitude
        })
        // console.log("Address: ", address);
        setLocation(location);
        setWhere(address);
      })();

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
   
  }, []);

  // TODO: WHY ARE THESE AT THE GLOBAL LEVEL? REFACTOR WHERE POSSIBLE
  let text = 'Waiting..';
  let address = 'waiting.';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    address = JSON.stringify(where)
  }

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);

  const [meal, setMeal] = useState('Dinner');
  const [hall, setHall] = useState('Sargent');
  
  // LIST OF OPTIONS TO CHOOSE FROM, BASED ON MEAL/HALL
  const [items, setItems] = useState([]);
  
  // LOGIC FOR PICKER
  useEffect(() => {
    console.log("This Ran")
    axios.get(
      `${URL}/options?meal=${meal}&hall=${hall}`,
      {headers: {"Access-Control-Allow-Origin": "*"}}
      ).then((response) => {
        setItems(response.data.options);
      });
  }, [meal, hall]);

  useEffect(()=> {
    console.log("Items: ", items);
  }, [items])



  // REFACTOR SOMEWHERE
  const [pickedImagePath, setPickedImagePath] = useState('');
  const options1 = {
    title: 'Take Image',
    options: {
      saveToPhotos: true,
      mediaType: 'photo',
    },
  };
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

  return (
    <View style = {styles.container}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Button
              title="Press to Send Notification"
              onPress={async () => {
                await sendPushNotification(expoPushToken, text, address);
              }}
            />
        </View>
        <Button
          title = "Select from Image Gallery"
          onPress = {pickImage}
        />
        <View style={styles.imageContainer}>
          
        </View>

        <Text style={styles.reg}>Select what foods you got, and estimate your portion sizes:</Text>

        <View style={styles.entry}>
          <Picker
            style={styles.picker}
            selectedValue={selectedFood}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedFood(itemValue)    
            }     
            }>
            {items.map(item => {return <Picker.Item key={item.key} label={item.name} value={item.name}/>})}
          </Picker>
          {selectedFood ?
              <Picker
              style={styles.picker}
              selectedValue={selectedPortion}
              onValueChange={async (itemValue, itemIndex) =>
                setSelectedPortion(itemValue)
              }>

              {Array.from(Array(10).keys()).map(
                item => {
                  let myLabel = `[${item + 1}] ` + "(" + dishPortions.find(x => x['dish'] == selectedFood)['portion'] + ")" + " sized portion";
                  return  (
                    <Picker.Item key={item} 
                    label={myLabel} 
                    value={myLabel}/>
                    )
                })}
              </Picker>
           : 
           null }
          
        </View>
            
        <Text style = {styles.title}>Take a picture of your food, and tell us what you ate!</Text>
        <StatusBar style="auto" />
        <Button
              title = "Go to next page"
              onPress={() => navigation.navigate('Graph')}
            />
          <Button
              title = "Select from Image Gallery"
              onPress = {pickImage}
            />
            <View style={styles.imageContainer}>
              
            </View>
            <View style = {styles.imgBox}>
              {
                pickedImagePath == '' ? <Text>Upload your image here!</Text>:
                 <Image
                  source={{ uri: pickedImagePath }}
                  style={styles.image}
                />
              }
            </View>
      </View>
  );

    

            
            
    
  
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken, text, address) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'f00d',
    body: `Address: ${address}. Are you eating at ${text}?`,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  entry: {
    width: '70%',
    justifyContent: 'space-between',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    marginBottom: 10,
  },
  reg:{
    fontSize: 20,
    textAlign: 'center',
  },
  imgBox: {
    width: '80%',
    height: '10%',
    alignItems: 'center',
    backgroundColor: '#d4d4d4',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
    
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },

  picker: {
    margin: '0 auto',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  }
});

// export default App;

