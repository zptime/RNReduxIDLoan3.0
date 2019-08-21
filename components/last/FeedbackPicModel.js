import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, StatusBar, Modal } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const FeedbackPicModel = ({ state, uri, doAction }) => {
    const PicModel = state &&
        <Modal
            animationType='fade'
            transparent={true}
            visible={state}
            onRequestClose={() => doAction(false)}
        >
            <StatusBar backgroundColor={'rgba(0, 0, 0, 1)'} barStyle='light-content' />
            <View style={styles.picModel}>
                <TouchableOpacity activeOpacity={1} style={styles.picMask} onPress={() => doAction(false)}></TouchableOpacity>
                <View style={styles.picContent}>
                    <Image source={{ uri }} style={styles.picImg} />
                    <TouchableOpacity activeOpacity={1} style={styles.submitAction} onPress={() => doAction(true)}>
                        <Image style={styles.submitIcon} source={require('./../../assets/img/icon_close2.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    return (
        PicModel
    );
}

const styles = StyleSheet.create({
    picModel: {
        flex: 1,
        justifyContent: 'center',
    },
    picMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    picContent: {
        backgroundColor: '#FFF',
    },
    picImg: {
        width: PR * 375,
        height: PR * 460,
    },
    submitAction: {
        position: 'absolute',
        left: PR * 20,
        top: -PR * 45,
    },
    submitIcon: {
        width: PR * 15,
        height: PR * 15,
    },
})

export default FeedbackPicModel;