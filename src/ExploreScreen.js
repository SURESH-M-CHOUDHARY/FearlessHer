import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NavBar from './components/NavBar'; // Import the NavBar component

const ExploreScreen = ({ navigation, username }) => {
    return (
        <View style={styles.container}>
            <NavBar
                onNotificationPress={() => console.log('Notification pressed')}
                navigation={navigation}
            />
            <View style={styles.content}>
                <Text style={styles.greeting}>Good Afternoon,</Text>
                <Text style={styles.username}>{username}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('DistressAlert')} // Navigate to DistressAlert
                >
                    <Text style={styles.buttonText}>Distress Alert Signal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Chat')} // Navigate to ChatScreen
                >
                    <Text style={styles.buttonText}>CommUnity Support</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('SelfDefenseTutorials')} // Navigate to SelfDefenseTutorials
                >
                    <Text style={styles.buttonText}>Self Defense Tutorials</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>ManUp Tutorials</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Safety Ratings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Location History</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 30,
    },
    greeting: {
        fontSize: 24,
        color: '#555',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6A5ACD',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6A5ACD',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
});

export default ExploreScreen; 