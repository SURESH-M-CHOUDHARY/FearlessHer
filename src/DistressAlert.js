
import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import NavBar from './components/NavBar';
import Footer from "./components/Footer";

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
            <Footer/>
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
                        <View style={styles.heroContent}>
                            <View style={styles.heroText}>
                                <Text style={styles.emergencyText}>Are you in an emergency?{"\n"}</Text>
                                <Text style={styles.instructionText}>
                                    {"\n"}Press and hold the SOS button for 3 seconds to send an emergency distress signal{"\n"}
                                </Text>
                            </View>
                            <View style={styles.emergencyImage}>
                                <Image source={require('../assets/Images/emergencyImage.png')} style={styles.emergencyImage} />
                            </View>
                        </View>
                        <View style={styles.sosRecBgContent}>
                            <View style={styles.sosCirBgContent}>
                                <View style={styles.content2}>
                                    <TouchableOpacity
                                        style={styles.sosButton}
                                        onLongPress={handleSOSPress}
                                        delayLongPress={2000}
                                    >
                                        <Text style={styles.sosButtonText}>SOS</Text>
                                        <Text style={styles.sosButtonInstruction}>Press 3 seconds</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.exploreButtonContent}>
                            <TouchableOpacity
                                style={styles.exploreButton}
                                onPress={() => navigation.navigate('Explore')}
                            >
                                <Text style={styles.exploreButtonText}>Explore FearlessHer</Text>
                            </TouchableOpacity>
                        </View>
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
        justifyContent: 'space-between',
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
        color: '#674188',
    },
    icon: {
        width: 40,
        height: 40,
    },
    heroContent: {
        //backgroundColor:"#688909",
        //w, h 93, 23
        width: 372,
        height: 210,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: -130,
    },
    heroText: {
        alignSelf: 'center',
        width: '55%',
        textAlign: 'left',
    },
    emergencyText: {
        width: 202,
        height: 56,
        lineHeight: 28,
        fontSize: 20,
        fontWeight: 600,
        color: '#313A51',
    },
    instructionText: {
        width: 226,
        height: 96,
        lineHeight: 24,
        fontSize: 13,
        fontweight: 400,
        color: '#313A51',
    },
    emergencyImage: {
        //width: 146,
        //height: 169,
        alignSelf: 'center',
    },
    sosRecBgContent: {
        alignSelf: 'center',
        flexDirection: 'row',
        marginRight: 15,
        marginLeft: 15,
        marginTop: 15,
        marginBottom: -100,
        //w, h 93, 33
        verticalAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5FA',
        width: 372,
        height: 253,
        borderRadius: 44,
    },
    sosCirBgContent: {
        marginRight: 20,
        marginLeft: 20,
        verticalAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e5e5ef',
        width: '55%',
        height: '83%',
        borderRadius: '100%',
        shadowColor: '#F5F5FA',
    },
    sosButton: {
        alignSelf: 'center',
        backgroundColor: '#674188',
        borderRadius: 100,
        width: 160,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sosButtonText: {
        fontSize: 32,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    sosButtonInstruction: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 500,
        color: '#fff',
        marginTop: 5,
    },
    exploreButtonContent:{
        //backgroundColor: 'lightgreen',
        marginTop: 15,
        marginBottom: 100,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    exploreButton: {
        elevation: 2,
        backgroundColor: '#fff',
        borderColor: '#674188',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    exploreButtonText: {
        fontSize: 18,
        color: '#674188',
        fontWeight: 'bold',
    },
});

export default DistressAlertScreen;
