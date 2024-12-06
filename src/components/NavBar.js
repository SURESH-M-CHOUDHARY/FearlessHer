import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const NavBar = ({ onNotificationPress, navigation }) => {
    return (
        <View style={styles.navBar}>
            <Image source={require('../../assets/Images/Logo.png')} style={styles.logo} />
            <Text style={styles.title}>FearlessHer</Text>
            <View style={styles.icons}>
                <TouchableOpacity onPress={onNotificationPress}>
                    <Image source={require('../../assets/Images/notificationIcon.png')} style={styles.icon} />
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
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    logo: {
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 0,
        width: 40,
        height: 40,
    },
    title: {
        alignSelf: 'center',
        //marginLeft: 30,
        marginRight: 93,
        fontFamily: 'BriemHand-Regular',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        //fontStyle: 'italic',
        color: '#674188',
    },
    icons: {
        flexDirection: 'row',
    },
    icon: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: 24,
        height: 24,
        marginLeft: 15,
    },
});

export default NavBar; 