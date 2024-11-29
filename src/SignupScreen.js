import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image, Pressable } from 'react-native';

const SignupScreen = ({ onSignup, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSignup = async () => {
        const signupResponse = await fetch('http://192.168.70.207:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email }),
        });

        if (!signupResponse.ok) {
            const error = await signupResponse.json();
            Alert.alert('Signup failed', error.message);
            return;
        }

        const { token } = await signupResponse.json();
        console.log('Token received:', token);
        Alert.alert('Signup successful', 'You have successfully created an account!', [
            {
                text: 'Login',
                onPress: () => {
                    onSignup(token); // Pass the token to the parent component
                    onSwitchToLogin(); // Switch to login screen
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heroText}>
                <Text style={styles.signUpText}>Sign Up{"\n"}</Text>
                <Text style={styles.createText}>Create an account to access all the features of FearlessHer!{"\n\n"}</Text>
            </Text>
            <Text style={styles.inputNameText}>Your Email</Text>
            <TextInput
                placeholder="Ex: abc@example.com"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />
            <Text style={styles.inputNameText}>Your Username</Text>
            <TextInput
                placeholder="Ex: User_name"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
            />
            <Text style={styles.inputNameText}>Your Password</Text>
            <TextInput
                placeholder=" • • • • • • • • "
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                autoCapitalize="none"
            />
            <Pressable style={styles.signUpButton} onPress={handleSignup}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </Pressable>
            <Text style={styles.switchText}>
                Already have an account? <Text style={styles.logInText} onPress={onSwitchToLogin}>Login</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    heroText: {
        marginLeft: 12,
        marginRight: 12,
        marginTop: 0,
        marginBottom: 52,
    },
    signUpText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#674188',
    },
    createText:{
        fontSize: 16,
    },
    logo: {
        width: 250, // Adjust the size as needed
        height: 250, // Adjust the size as needed
        alignSelf: 'center',
        marginBottom: 20,
    },
    inputNameText: {
        fontSize: 14,
        //fontWeight: 'bold',
        //color: '#674188',
        marginLeft: 12,
        marginRight: 12,
        //marginTop: 32,
        marginBottom: 4,
        margintop: 16,
        //textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#674188',
        borderRadius: 7,
        padding: 10,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 20,
    },
    signUpButton: {
        height: 50,
        marginTop: 12,
        marginLeft: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#674188',
        borderRadius: 7,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#674188', 
    },
    signUpButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchText: {
        textAlign: 'center',
        marginTop: 20,
    },
    logInText: {
        color: '#674188', 
        textDecorationLine: 'underline',
    },
});

export default SignupScreen;
