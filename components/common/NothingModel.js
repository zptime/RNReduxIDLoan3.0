import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const NothingModel = () => {
    return (
        <View style={styles.nothingModel}>
            <Image style={styles.nothingIcon} source={require('./../../assets/img/icon_nothing.png')} />
            <Text style={styles.nothingText}>Tidak ada lagi konten</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    nothingModel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nothingIcon: {
        width: PR * 175,
        height: PR * 135,
    },
    nothingText: {
        fontSize: PR * 15,
        color: '#999',
        textAlign: 'center',
        marginTop: PR * 10,
        paddingHorizontal: PR * 20,
        lineHeight: PR * 18,
    },
})

export default NothingModel;