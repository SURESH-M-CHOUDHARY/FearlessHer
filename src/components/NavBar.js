import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const NavBar = ({ onNotificationPress, navigation }) => {
    return (
        <View style={styles.navBar}>
            <Image source={require('../../assets/Images/Logo.png')} style={styles.logo} />
            <Text style={styles.title}>FearlessHer</Text>
            <View style={styles.icons}>
                <TouchableOpacity onPress={onNotificationPress}>
                    <Image source={require('../../assets/Images/notification.webp')} style={styles.icon1} />
                </TouchableOpacity>
            </View>
            <View style={styles.icons}>
                <TouchableOpacity onPress={() => navigation.navigate('Account')}>
                    <Image source={require('../../assets/Images/account.png')} style={styles.icon} />
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
        height: '80px',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F5F5FA',
        //elevation: 5,
        //shadowColor: '#000',
        //shadowOffset: { width: 0, height: 2 },
        //shadowOpacity: 0.3,
        //shadowRadius: 4,
    },
    logo: {
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 0,
        width: 40,
        height: 40,
    },
    title: {
        fontFamily: 'Dancing Script',
        fontSize: 24,
        fontWeight: 'bold',
        //fontStyle: 'italic',
        color: '#674188',
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