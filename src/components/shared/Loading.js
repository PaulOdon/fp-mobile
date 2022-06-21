import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loading = () => {
    return (
        <View style={[styles.container]}>
            <Text style={{ color: "#0000ff" }}>Chargement ...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        opacity: 0.6,
        position: "absolute",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
})