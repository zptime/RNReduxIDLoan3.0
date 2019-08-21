import React from 'react';
import { View, TouchableOpacity, Image, Text, StatusBar, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const HeaderModel = ({data = {}, doAction = null}) => {
    return (
        <View style={styles.headerModel}>
            <Text style={[styles.modelTitle, data.highlight && styles.highlight]}>{data.title}</Text>
            {
                data.showBack ?
                    <TouchableOpacity style={[styles.modelBtn, styles.modelBack]} onPress={() => doAction ? doAction('GoBack') : data.navigation.goBack()}>
                    <Image style={styles.modelBackIcon} source={require('./../../assets/img/icon_back.png')} />
                </TouchableOpacity>
                :
                null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    headerModel: {
        height: PR * 64,
        paddingTop: StatusBar.currentHeight,
        justifyContent: 'center',
    },
    modelTitle: {
        paddingHorizontal: PR * 84,
        fontSize: PR * 17,
        color: '#000',
        textAlign: 'center',
        textAlignVertical: 'center',
        overflow: 'hidden',
    },
    highlight: {
        color: '#fff',
    },
    modelBtn: {
        position: 'absolute',
        top: StatusBar.currentHeight,
        width: PR * 64 - StatusBar.currentHeight,
        height: PR * 64 - StatusBar.currentHeight,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modelBack: {
        left: PR * 10,
    },
    modelBackIcon: {
        width: PR * 18,
        height: PR * 16,
    },
})

export default HeaderModel;