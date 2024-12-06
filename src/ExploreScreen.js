import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import NavBar from './components/NavBar';
import Footer from "./components/Footer"; // Import the NavBar component

const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
        return 'Good Morning,';
    } else if (currentHour < 18) {
        return 'Good Afternoon,';
    } else {
        return 'Good Evening,';
    }
};
const greeting = getCurrentGreeting();

const ExploreScreen = ({ navigation, username }) => {
    return (

        <View style={styles.container}>
            <NavBar
                onNotificationPress={() => console.log('Notification pressed')}
                navigation={navigation}
            />
            <Footer/>
            <View style={styles.content}>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.username}>{username}</Text>

                <View style={styles.sections}>
                    <TouchableOpacity
                        style={[styles.button, styles.button1]}
                        onPress={() => navigation.navigate('Chat')} // Navigate to ChatScreen
                    >
                        <View style={styles.iconArea}>
                            <Image source={require('../assets/Images/communityIcon.png')} style={styles.icons} />
                        </View>
                        <View style={[styles.textArea, styles.textArea1]}>
                            <Text style={styles.iconText}>CommUnity Chat</Text>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.button2]}
                        onPress={() => navigation.navigate('SelfDefenseTutorials')} // Navigate to SelfDefenseTutorials
                    >
                        <View style={styles.iconArea}>
                            <Image source={require('../assets/Images/selfdefenseIcon.png')} style={styles.icons} />
                        </View>
                        <View style={[styles.textArea, styles.textArea2]}>
                            <Text style={styles.iconText}>Self Defense</Text>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.button3]}>
                        <View style={styles.iconArea}>
                            <Image source={require('../assets/Images/manupIcon.png')} style={styles.icons} />
                        </View>
                        <View style={[styles.textArea, styles.textArea3]}>
                            <Text style={styles.iconText}>ManUp</Text>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.button4]}>
                        <View style={styles.iconArea}>
                            <Image source={require('../assets/Images/safetyratingsIcon.png')} style={styles.icons} />
                        </View>
                        <View style={[styles.textArea, styles.textArea4]}>
                            <Text style={styles.iconText}>Safety Ratings</Text>
                        </View>

                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 30,
    },
    greeting: {
        fontSize: 22,
        fontWeight: 400,
        lineHeight: 35,
        color: '#313A51',
    },
    username: {
        fontSize: 26,
        fontWeight: 600,
        color: '#313A51',
        //color: '#674188',
        marginBottom: 20,
        lineHeight: 35,
    },
    sections:{
        flexDirection: 'row',
        flexShrink: 0,
        flexWrap: 'wrap',
        width: '100%',
        height: 500,
        //borderWidth: 1,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        width: '42%',
        aspectRatio: 1,
        //height: 150,
        //margin: 10,
        marginBottom: 50,
        borderWidth: 1,
        borderColor: '#674188',
        borderRadius: 10,
        backgroundColor: '#F5F5FA',
        //paddingVertical: 15,
        //paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconArea:{
        width: '100%',
        height: '80%',
        //borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textArea:{
        backgroundColor: '#674188',
        //marginBottom: 20,
        //alignSelf: 'flex-end',
        width: '100%',
        height: '20%',
        //borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icons:{
        width: 50,
        height: 50,
    },
    iconText:{
        color: 'white',
        textAlign: 'center',
    },
    button1:{
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    textArea1:{
        borderBottomRightRadius: 10,
    },
    button2:{
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    textArea2:{
        borderBottomLeftRadius: 10,
    },
    button3:{
        borderTopLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    textArea3:{
        borderBottomLeftRadius: 10,
    },
    button4:{
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    textArea4:{
        borderBottomRightRadius: 10,
    },
});

export default ExploreScreen; 