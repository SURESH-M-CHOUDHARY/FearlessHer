import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const DistressAnimation = ({ coordinate }) => {
    const scale = new Animated.Value(1);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.5,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scale]);

    return (
        <Animated.View style={{
            position: 'absolute',
            transform: [{ scale }],
            left: coordinate.longitude,
            top: coordinate.latitude,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View style={styles.distressCircle} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    distressCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red color with transparency
        position: 'absolute',
    },
});

export default DistressAnimation;
