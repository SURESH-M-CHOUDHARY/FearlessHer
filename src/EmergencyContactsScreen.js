import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EmergencyContactsScreen = ({ onSaveContacts }) => {
    const [contact1, setContact1] = useState('');
    const [contact2, setContact2] = useState('');
    const [contact3, setContact3] = useState('');
    const navigation = useNavigation();

    const handleNext = () => {
        if (!contact1) {
            Alert.alert('Error', 'At least one contact is required.');
            return;
        }

        onSaveContacts([contact1, contact2, contact3].filter(Boolean));
        navigation.navigate('DistressAlert');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Emergency Contacts</Text>
            <TextInput
                placeholder="Contact 1 (Required)"
                value={contact1}
                onChangeText={setContact1}
                style={styles.input}
                keyboardType="phone-pad"
            />
            <TextInput
                placeholder="Contact 2 (Optional)"
                value={contact2}
                onChangeText={setContact2}
                style={styles.input}
                keyboardType="phone-pad"
            />
            <TextInput
                placeholder="Contact 3 (Optional)"
                value={contact3}
                onChangeText={setContact3}
                style={styles.input}
                keyboardType="phone-pad"
            />
            <Button title="Next" onPress={handleNext} color="#6A5ACD" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6A5ACD',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default EmergencyContactsScreen; 