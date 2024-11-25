import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image } from 'react-native';

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
            <Image source={require('./Images/Logo.png')} style={styles.logo} />
            <Text style={styles.header}>Create Your Account</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />
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
            <Button title="Sign Up" onPress={handleSignup} color="#6A5ACD" />
            <Text style={styles.switchText} onPress={onSwitchToLogin}>
                Already an existing user? Login
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

export default SignupScreen;
