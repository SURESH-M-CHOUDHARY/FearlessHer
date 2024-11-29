import React, { useState } from 'react';
import { View, TextInput, Pressable, Button, Alert, StyleSheet, Text, Image } from 'react-native';

const LoginScreen = ({ onLogin, onSwitchToSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const loginResponse = await fetch('http://192.168.70.207:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!loginResponse.ok) {
            const error = await loginResponse.json();
            Alert.alert('Login failed', error.message);
            return;
        }

        const { token } = await loginResponse.json();
        console.log('Token received:', token);
        onLogin(token, username); // Pass the token and username to the parent component
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heroText}>
                <Text style={styles.welcomeText}>Welcome to{"\n"}</Text>
                <Text style={styles.fearlessherText}>FearlessHer{"\n"}</Text>
                <Text style={styles.safeText}>A place where you can feel safe and be fearless...{"\n\n"}</Text>
            </Text>
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
            <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
            <Text style={styles.switchText}>
                Don't have an account? <Text style={styles.signUpText} onPress={onSwitchToSignup}>Sign Up</Text>
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
    welcomeText: {
        fontSize: 20,
    },
    fearlessherText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#674188',
    },
    safeText:{
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
    loginButton: {
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
    loginButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchText: {
        textAlign: 'center',
        marginTop: 20,
    },
    signUpText: {
        color: '#674188', 
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
