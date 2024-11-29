import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NearbyUsersScreen = ({ nearbyUsers }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nearby Users</Text>
            <FlatList
                data={nearbyUsers}
                keyExtractor={(item) => item.userId}
                renderItem={({ item }) => (
                    <View style={styles.userContainer}>
                        <Text style={styles.userName}>{item.userId}</Text>
                        <Text style={styles.userLocation}>{item.location}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    userContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userLocation: {
        fontSize: 14,
        color: '#555',
    },
});

export default NearbyUsersScreen;
