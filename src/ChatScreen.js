import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import NavBar from './components/NavBar';
import io from 'socket.io-client';

const ChatScreen = ({ navigation, token }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socket = io('https://fearlessher-backend.onrender.com');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('https://fearlessher-backend.onrender.com/api/messages', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error.message);
                console.error('Error details:', error);
            }
        };

        fetchMessages();

        socket.on('newMessage', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.disconnect();
        };
    }, [token]);

    const sendMessage = async () => {
        if (message.trim()) {
            try {
                const response = await axios.post('https://fearlessher-backend.onrender.com/api/messages', { text: message }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Message sent:', response.data);
                socket.emit('sendMessage', response.data);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <NavBar onNotificationPress={() => console.log('Notification pressed')} navigation={navigation} />

            <View style={styles.container1}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Community Chat</Text>
                    <Text style={styles.subHeaderText}>Share your incidents and experiences</Text>
                </View>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.messageContainer}>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.message}>{item.text}</Text>
                            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
                        </View>
                    )}
                />

                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage} />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Be respectful! This is a community chat.</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        marginHorizontal: 0,
    },
    container1: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subHeaderText: {
        fontSize: 16,
        color: '#666',
    },
    messageContainer: {
        marginVertical: 5,
    },
    username: {
        fontWeight: 'bold',
        color: '#333',
    },
    message: {
        padding: 10,
        backgroundColor: '#e1f5fe',
        borderRadius: 5,
        marginTop: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    footer: {
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
});

export default ChatScreen; 