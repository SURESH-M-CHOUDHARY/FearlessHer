import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

const LoadingScreen = ({ onLoadingComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value
    const scaleAnim = useRef(new Animated.Value(0.5)).current; // Initial scale value

    useEffect(() => {
        // Start the animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Set a timer to complete loading after 4 seconds
        const timer = setTimeout(() => {
            onLoadingComplete();
        }, 2000);

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [fadeAnim, scaleAnim, onLoadingComplete]);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('./Images/Logo.png')} // Path to your logo
                style={[
                    styles.logo,
                    {
                        opacity: fadeAnim, // Bind opacity to animated value
                        transform: [{ scale: scaleAnim }], // Bind scale to animated value
                    },
                ]}
                resizeMode="contain" // Ensure the image maintains its aspect ratio
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Light background for a modern look
    },
    logo: {
        width: 350, // Adjust the size as needed
        height: 350, // Adjust the size as needed
    },
});

export default LoadingScreen; 