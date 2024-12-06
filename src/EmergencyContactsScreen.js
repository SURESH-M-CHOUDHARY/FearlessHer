import React, { useState } from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
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
            <Text style={styles.heroText}>
                <Text style={styles.contactsText}>Emergency Contacts{"\n"}</Text>
                <Text style={styles.setupText}>Set up the contacts to be alerted during an emergency{"\n\n"}</Text>
            </Text>
            <Text style={styles.inputNameText}>Contact: 01</Text>
            <TextInput
                placeholder="Required*"
                value={contact1}
                onChangeText={setContact1}
                style={styles.input}
                keyboardType="phone-pad"
            />
            <Text style={styles.inputNameText}>Contact: 02</Text>
            <TextInput
                placeholder="Optional"
                value={contact2}
                onChangeText={setContact2}
                style={styles.input}
                keyboardType="phone-pad"
            />
            <Text style={styles.inputNameText}>Contact: 03</Text>
            <TextInput
                placeholder="Optional"
                value={contact3}
                onChangeText={setContact3}
                style={styles.input}
                keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.doneButton} onPress={handleNext}>
                <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>

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
        color: '#674188',
        marginBottom: 20,
        textAlign: 'center',
    },
    heroText:{
        display: 'flex',
        width: 268,
        height: 170,
        marginLeft: 12,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 21,
        flexShrink: 0,
    },
    contactsText:{
        color: '#674188',
        fontFamily: 'Inter',
        fontSize: 36,
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 40,
    },
    setupText:{
        color: '#000',
        fontFamily: 'Inter',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 400,
    },
    inputNameText: {
        fontSize: 14,
        //fontWeight: 'bold',
        //color: '#674188',
        marginLeft: 12,
        marginRight: 12,
        //marginTop: 32,
        marginBottom: 4,
        margintop: 16,
        //textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#674188',
        borderRadius: 7,
        padding: 10,
        marginLeft: 12,
        marginRight: 12,
        marginBottom: 20,
    },
    doneButton:{
        height: 50,
        marginTop: 12,
        marginLeft: 12,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#674188',
        borderRadius: 7,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#674188',
    },
    doneButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EmergencyContactsScreen; 