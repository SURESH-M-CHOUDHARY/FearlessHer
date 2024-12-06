import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const Footer = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('Home'); // Tracks the currently selected tab

    const handleNavigate = (tabName) => {
        setSelectedTab(tabName);
        navigation.navigate(tabName);
    };

    return (
        <View style={styles.footer}>
            <View style={styles.sectionContent}>
                <TouchableOpacity onPress={() => handleNavigate('Home')}>
                    <Image
                        source={
                            selectedTab === 'Home'
                                ? require('../../assets/Images/homeIconPurple.png')
                                : require('../../assets/Images/homeIcon.png')
                        }
                        style={styles.sectionIcon}
                    />
                </TouchableOpacity>
                <Text style={[styles.sectionName, selectedTab === 'Home' && styles.selectedText]}>Home</Text>
            </View>
            <View style={styles.sectionContent}>
                <TouchableOpacity onPress={() => handleNavigate('Explore')}>
                    <Image
                        source={
                            selectedTab === 'Explore'
                                ? require('../../assets/Images/exploreIconPurple.png')
                                : require('../../assets/Images/exploreIcon.png')
                        }
                        style={styles.sectionIcon}
                    />
                </TouchableOpacity>
                <Text style={[styles.sectionName, selectedTab === 'Explore' && styles.selectedText]}>Explore</Text>
            </View>
            <View style={styles.sectionContent}>
                <TouchableOpacity onPress={() => handleNavigate('Profile')}>
                    <Image
                        source={
                            selectedTab === 'Profile'
                                ? require('../../assets/Images/profileIconPurple.png')
                                : require('../../assets/Images/profileIcon.png')
                        }
                        style={styles.sectionIcon}
                    />
                </TouchableOpacity>
                <Text style={[styles.sectionName, selectedTab === 'Profile' && styles.selectedText]}>Profile</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 74,
        backgroundColor: '#F5F5FA',
        elevation: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sectionContent: {
        width: 54,
        height: 72,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionName: {
        fontSize: 9,
        fontWeight: 'semibold',
        textAlign: 'center',
        marginTop: 6,
        color: '#000',
    },
    selectedText: {
        color: '#674188',
        fontWeight: 'bold',
    },
    sectionIcon: {
        width: 24,
        height: 24,
    },
});

export default Footer;