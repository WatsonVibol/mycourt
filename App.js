import * as React from 'react';
import { Button, TouchableOpacity, StyleSheet, TextInput, Text, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import firestore from '@react-native-firebase/firestore';


export default function App() {
  const [username, setUsername] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const signUp = () => {
    // Handle the signup action
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: '11084186068-20caef2k04khqom4nlsg9lfr5naeh4a4.apps.googleusercontent.com',
      responseType: ResponseType.IdToken,
      expoClientId: '11084186068-20caef2k04khqom4nlsg9lfr5naeh4a4.apps.googleusercontent.com',
    },
    {
      useProxy: true,
    }
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      fetch('https://localhost:3000/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: id_token,
        }),
      })
      .then(response => response.json())
      .then(data => {
        // Add the user to Firestore
        firestore()
        .collection('users')
        .doc(data.userId) //Use the user's Google ID as the document ID
        .set({
          // Add any additional user data you want to store
        })
        .then(() => {
          console.log('User added!');
        });
      })
      ;
    }
  }, [response]);

  const signInAsync = async () => {
    try {
      const { type, params } = await promptAsync();
      if (type === 'success') {
        const { id_token } = params;
        // Then you can use the Google REST API
        console.log(id_token);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 10,
    },
  });
  
  return (
    
  <View style={{...styles.container, flexDirection: 'column'}}>
    <TextInput
      style={styles.input}
      placeholder="Username"
      onChangeText={text => setUsername(text)}
      value={username || 'Test'}
    />
    <TextInput
      style={styles.input}
      placeholder="Phone Number"
      onChangeText={text => setPhoneNumber(text)}
      value={phoneNumber}
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry={true}
      onChangeText={text => setPassword(text)}
      value={password}
    />
    <Button title="Sign Up" onPress={signUp} />
    <Text style={{ marginLeft: 10 }}>Login with your facebook account</Text>
    <TouchableOpacity style={{...styles.button, marginTop: 10}} onPress={signInAsync} disabled={!request}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    
  </View>
  );
}
