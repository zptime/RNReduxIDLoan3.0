import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const NoNetworkModel = () => {
    return (
        <View style={styles.noNetworkModel}>
            <Image style={styles.noNetworkIcon} source={require('./../../assets/img/icon_no_network.png')} />
            <Text style={styles.noNetworkText}>Koneksi jaringan gagal.{'\n'}Silahkan periksa pengaturan sambungan jaringan!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    noNetworkModel: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    noNetworkIcon: {
        width: PR * 175,
        height: PR * 135,
    },
    noNetworkText: {
        fontSize: PR * 15,
        color: '#999',
        textAlign: 'center',
        marginTop: PR * 10,
        paddingHorizontal: PR * 20,
        lineHeight: PR * 18,
    },
})

export default NoNetworkModel;