import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/LoginScreen';
import DistressAlert from './src/DistressAlert';
import SignupScreen from './src/SignupScreen';
import NearbyUsersScreen from './src/NearbyUsersScreen';
import LoadingScreen from './src/LoadingScreen';
import EmergencyContactsScreen from './src/EmergencyContactsScreen';
import ExploreScreen from './src/ExploreScreen';
import AccountSection from './src/AccountSection';
import ChatScreen from './src/ChatScreen';
import SelfDefenseTutorials from './src/SelfDefenseTutorials';

const Stack = createNativeStackNavigator();

export default function App() {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [nearbyUsers, setNearbyUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const handleLogin = (token, username) => {
        setToken(token);
        setUsername(username);
    };

    const handleSignup = (receivedToken) => {
        setToken(receivedToken);
    };

    const switchToSignup = () => {
        setIsSignup(true);
    };

    const switchToLogin = () => {
        setIsSignup(false);
    };

    const handleSaveContacts = async (contacts) => {
        console.log('Contacts to save:', contacts);

        try {
            const response = await fetch('http://192.168.109.134:5000/api/save-contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ contacts }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error saving contacts:', error);
                Alert.alert('Error', 'Failed to save contacts');
                return;
            }

            const result = await response.json();
            console.log('Contacts saved successfully:', result);
        } catch (error) {
            console.error('Network error:', error);
            Alert.alert('Error', 'Network error or server not reachable.');
        }
    };

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoading ? (
                    <Stack.Screen name="Loading">
                        {(props) => <LoadingScreen {...props} onLoadingComplete={() => setIsLoading(false)} />}
                    </Stack.Screen>
                ) : token ? (
                    <Stack.Screen name="EmergencyContacts">
                        {(props) => <EmergencyContactsScreen {...props} onSaveContacts={handleSaveContacts} />}
                    </Stack.Screen>
                ) : isSignup ? (
                    <Stack.Screen name="Signup">
                        {(props) => <SignupScreen {...props} onSignup={handleSignup} onSwitchToLogin={switchToLogin} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="Login">
                        {(props) => <LoginScreen {...props} onLogin={handleLogin} onSwitchToSignup={switchToSignup} />}
                    </Stack.Screen>
                )}
                <Stack.Screen name="DistressAlert">
                    {(props) => <DistressAlert {...props} token={token} setNearbyUsers={setNearbyUsers} />}
                </Stack.Screen>
                <Stack.Screen name="Explore">
                    {(props) => <ExploreScreen {...props} username={username} />}
                </Stack.Screen>
                <Stack.Screen name="Chat">
                    {(props) => <ChatScreen {...props} token={token} />}
                </Stack.Screen>
                <Stack.Screen name="SelfDefenseTutorials" component={SelfDefenseTutorials} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC9gZrXVvdMPyhqVxTWXFIgs5KhGUmqOUk",
//   authDomain: "notification-8f388.firebaseapp.com",
//   projectId: "notification-8f388",
//   storageBucket: "notification-8f388.firebasestorage.app",
//   messagingSenderId: "736394516255",
//   appId: "1:736394516255:web:ccb1048c5661406144822a",
//   measurementId: "G-Y3TVFRCBPB"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);