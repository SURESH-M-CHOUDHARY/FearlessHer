import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, {Marker} from 'react-native-maps'; // Ensure you have this package installed

const MapScreen = ({ currentLocation, nearbyUsers }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Map Screen</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: currentLocation ? currentLocation.latitude : 0,
                    longitude: currentLocation ? currentLocation.longitude : 0,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {/* Add markers for nearby users */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default MapScreen;