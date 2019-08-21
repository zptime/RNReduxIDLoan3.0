import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, StatusBar, Modal } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const UploadHintModel = ({ state, doAction }) => {
    const UploadModel = state &&
        <Modal
            animationType='fade'
            transparent={true}
            visible={state}
            onRequestClose={() => doAction(false)}
        >
            <StatusBar backgroundColor={'rgba(0, 0, 0, 0.7)'} barStyle='light-content' />
            <View style={styles.uploadModel}>
                <TouchableOpacity activeOpacity={1} style={styles.uploadMask} onPress={() => doAction(false)}></TouchableOpacity>
                <View style={styles.uploadContent}>
                    <Image source={require('./../../assets/img/icon_upload5.png')} style={styles.uploadImg} />
                    <TouchableOpacity activeOpacity={1} style={styles.submitAction} onPress={() => doAction(true)}>
                        <Text style={styles.submitText}>Berkutnya</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    return (
        UploadModel
    );
}

const styles = StyleSheet.create({
    uploadModel: {
        flex: 1,
        justifyContent: 'center',
    },
    uploadMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    uploadContent: {
        marginHorizontal: PR * 20,
        backgroundColor: '#FFF',
        borderRadius: PR * 6,
        overflow: 'hidden',
    },
    uploadImg: {
        width: PR * 320,
        height: PR * 416,
    },
    submitAction: {
        position: 'absolute',
        left: PR * 20,
        right: PR * 20,
        bottom: PR * 20,
        backgroundColor: '#24D29B',
        borderRadius: PR * 48,
    },
    submitText: {
        color: '#FFF',
        fontSize: PR * 17,
        textAlign: 'center',
        lineHeight: PR * 48,
    },
})

export default UploadHintModel;