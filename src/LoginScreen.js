import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image } from 'react-native';

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
            <Image source={require('./Images/Logo.png')} style={styles.logo} />
            <Text style={styles.header}>Login now to be Fearless!</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Your Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button title="Login" onPress={handleLogin} color="#6A5ACD" />
            <Text style={styles.switchText} onPress={onSwitchToSignup}>
                Don't have an account? Sign Up
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
    logo: {
        width: 250, // Adjust the size as needed
        height: 250, // Adjust the size as needed
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6A5ACD',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    switchText: {
        color: '#6A5ACD',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default LoginScreen;
