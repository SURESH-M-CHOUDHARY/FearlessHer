import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const SelfDefenseTutorials = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);

    const videos = [
        {
            id: 1,
            title: 'Self Defense Tutorial 1',
            thumbnail: "https://i.ytimg.com/vi/ERMZRMqQmVI/maxresdefault.jpg",
            url: 'https://youtu.be/ERMZRMqQmVI?si=IFAZcBnUgvvDj6DI',
        },
        {
            id: 2,
            title: 'Self Defense Tutorial 2',
            thumbnail: 'https://i.ytimg.com/vi/B725c7vi1xk/maxresdefault.jpg',
            url: 'https://youtu.be/B725c7vi1xk?si=NJtNUOvOMeqHuKC_',
        },
        {
            id: 3,
            title: 'Self Defense Tutorial 3',
            thumbnail: 'https://i.ytimg.com/vi/M4_8PoRQP8w/maxresdefault.jpg',
            url: 'https://youtu.be/M4_8PoRQP8w?si=TZ4ni2C-P_d2AKw-',
        },
    ];

    const renderVideoThumbnails = () => {
        return videos.map(video => (
            <TouchableOpacity
                key={video.id}
                onPress={() => setSelectedVideo(video.url)}
                style={styles.thumbnailContainer}
            >
                <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.Heading}>Videos on self defence</Text>
            </View>
            {selectedVideo ? (
                <WebView
                    source={{ uri: selectedVideo }}
                    style={styles.webview}
                    onNavigationStateChange={(navState) => {
                        if (!navState.canGoBack) {
                            setSelectedVideo(null); // Go back to thumbnails
                        }
                    }}
                />
            ) : (
                <View style={styles.thumbnails}>
                    {renderVideoThumbnails()}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    Heading: {
        textAlign:"center",
        marginTop: 30,
        fontSize: 28,
        color: '#6A5ACD',
    },
    container: {
        marginTop: 20,
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    thumbnails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 10,
    },
    thumbnailContainer: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    thumbnail: {
        width: 300,
        height: 200,
        borderRadius: 10,
    },
    webview: {
        flex: 1,
    },
});

export default SelfDefenseTutorials; 