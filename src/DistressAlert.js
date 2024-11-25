// src/DistressAlertScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import NavBar from './components/NavBar';

const DistressAlertScreen = ({ token, username, navigation }) => {
    const [location, setLocation] = useState('Fetching location...');
    const [nearbyUsers, setNearbyUsers] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(`${currentLocation.coords.latitude},${currentLocation.coords.longitude}`);
            setCurrentLocation(currentLocation.coords);
        };

        getLocation();
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            // Reset showMap to false when the screen is focused
            setShowMap(false);
        }, [])
    );

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const filterActiveUsers = (users, currentLocation) => {
        return users.filter(user => {
            const [lat, lon] = user.location.latitude.split(',').map(Number);
            const distance = calculateDistance(currentLocation.latitude, currentLocation.longitude, lat, lon);
            return distance <= 2; // Within 2 km
        });
    };

    const sendAlert = async () => {
        console.log('Sending alert...');
        try {
            const alertResponse = await fetch('http://192.168.70.207:5000/api/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },//Phone num, Local auth...Nearbyusers---Userid.,location----currentnav
                body: JSON.stringify({ username, location }),
            });

            console.log('Response status:', alertResponse.status);

            if (!alertResponse.ok) {
                const error = await alertResponse.json();
                console.error('Error response:', error);
                Alert.alert('Error sending alert', error.message);
                return;
            }

            const alertData = await alertResponse.json();
            console.log('Alert data:', alertData);
            Alert.alert('Alert sent successfully', alertData.message);
            setNearbyUsers(alertData.nearbyUsers); // Set nearby users
            setShowMap(true); // Show the map
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error sending alert', 'Network error or server not reachable.');
        }
    };

    const handleSOSPress = async () => {
        await sendAlert();
    };

    return (
        <View style={styles.container}>
            <NavBar
                onNotificationPress={() => console.log('Notification pressed')}
                navigation={navigation}
            />
            <View style={styles.content1}>
                {showMap ? (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: currentLocation ? currentLocation.latitude : 0,
                            longitude: currentLocation ? currentLocation.longitude : 0,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        }}
                    >
                        {currentLocation && (
                            <Marker
                                coordinate={{
                                    latitude: currentLocation.latitude,
                                    longitude: currentLocation.longitude,
                                }}
                                title="You are here"
                                pinColor="blue"
                            />
                        )}
                        {nearbyUsers.map(user => (
                            <Marker
                                key={user.userId}
                                coordinate={{
                                    latitude: parseFloat(user.location.latitude.split(',')[0]),
                                    longitude: parseFloat(user.location.latitude.split(',')[1]),
                                }}
                                title={`User: ${user.userId}`}
                            />
                        ))}
                    </MapView>
                ) : (
                    <>
                        
                        <Text style={styles.emergencyText}>Are you in an emergency?</Text>
                        <Text style={styles.instructionText}>
                            Press and hold the SOS button for 3 seconds to send a distress signal.
                        </Text>
                        <TouchableOpacity
                            style={styles.sosButton}
                            onLongPress={handleSOSPress}
                            delayLongPress={2000}
                        >
                            <Text style={styles.sosButtonText}>SOS</Text>
                            <Text style={styles.sosButtonInstruction}>Press 3 seconds</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => navigation.navigate('Explore')}
                        >
                            <Text style={styles.exploreButtonText}>Explore FearlessHer</Text>
                        </TouchableOpacity>
                    </>
                )}
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    header: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        top: 40,
        paddingHorizontal: 20,
    },
    appTitle: {
        marginLeft: 25,
        fontSize: 35,
        fontWeight: 'bold',
        color: '#6A5ACD',
    },
    icon: {
        width: 40,
        height: 40,
    },
    emergencyText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6A5ACD',
        marginBottom: 10,
        textAlign: 'center',
    },
    instructionText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    sosButton: {
        backgroundColor: '#6A5ACD',
        borderRadius: 100,
        width: 160,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sosButtonText: {
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
    },
    sosButtonInstruction: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
    },
    exploreButton: {
        backgroundColor: '#6A5ACD',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 20,
        alignItems: 'center',
    },
    exploreButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default DistressAlertScreen;