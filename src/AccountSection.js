import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const AccountSection = ({ username, email, token }) => {
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                console.log('Fetching profile image...');
                const response = await axios.get('http://192.168.70.207:5000/api/user-profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Profile image response:', response.data);
                setProfileImage({ uri: response.data.profileImage });
            } catch (error) {
                console.error('Error fetching profile image:', error);
            }
        };

        fetchProfileImage();
    }, [token]);

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.IMAGE,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage({ uri: result.assets[0].uri });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account</Text>
            <Image
                source={profileImage || require('./Images/account.png')}
                style={styles.profileImage}
            />
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
            <Button title="Upload Image" onPress={handleImagePick} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#6A5ACD',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    email: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
});

export default AccountSection;
