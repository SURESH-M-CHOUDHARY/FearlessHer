import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const NavBar = ({ onNotificationPress, navigation }) => {
    return (
        <View style={styles.navBar}>
            <Image source={require('../Images/Logo.png')} style={styles.logo} />
            <Text style={styles.title}>FearlessHer</Text>
            <View style={styles.icons}>
                <TouchableOpacity onPress={onNotificationPress}>
                    <Image source={require('../Images/notification.webp')} style={styles.icon1} />
                </TouchableOpacity>
            </View>
            <View style={styles.icons}>
                <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                    <Image source={require('../Images/account.png')} style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        marginTop: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    logo: {
        width: 40,
        height: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6A5ACD',
    },
    icons: {
        flexDirection: 'row',
    },
    icon: {
        width: 30,
        height: 30,
        marginLeft: 15,
    },
    icon1: {
        width: 40,
        height: 40,
        marginLeft: 15,
    },
});

export default NavBar; 