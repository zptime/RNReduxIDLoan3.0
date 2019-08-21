import React from 'react';
import { View, Text, StyleSheet, StatusBar, Modal } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const AlertModel = ({ data, type, state, doAction }) => {
    const AlertModel = state &&
        <Modal
            animationType='fade'
            transparent={true}
            visible={state}
            onRequestClose={() => {}}
        >
            <StatusBar backgroundColor='rgba(0, 0, 0, 0.7)' barStyle='light-content' />
            <View style={styles.alertModel}>
                <View style={styles.alertContent}>
                    {
                        data.title &&
                        <Text style={styles.alertTitle}>{data.title}</Text>
                    }
                    {
                        data.text &&
                        <Text style={styles.alertText}>{data.text}</Text>
                    }
                    <View style={styles.alertAction}>
                        {
                            type === 1 &&
                            <Text style={styles.alertActionBtn} onPress={() => doAction(false)}>{data.cancel}</Text>
                        }
                        <Text style={[styles.alertActionBtn, styles.alertActionConfirm]} onPress={() => doAction(true)}>{data.confirm}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    return (
        AlertModel
    );
}

const styles = StyleSheet.create({
    alertModel: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
    },
    alertContent: {
        marginHorizontal: PR * 20,
        backgroundColor: '#FFF',
        borderRadius: PR * 6,
        overflow: 'hidden',
    },
    alertTitle: {
        height: PR * 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: PR * 15,
        color: '#999',
        fontWeight: 'bold',
        backgroundColor: '#f2f2f2',
    },
    alertText: {
        paddingHorizontal: PR * 10,
        marginTop: PR * 20,
        textAlign: 'center',
        fontSize: PR * 12,
        color: '#999',
    },
    alertAction: {
        padding: PR * 20,
        flexDirection: 'row',
    },
    alertActionBtn: {
        flex: 1,
        marginHorizontal: PR * 5,
        fontSize: PR * 14,
        fontWeight: 'bold',
        color: '#24D29B',
        height: PR * 46,
        borderWidth: PR * 1,
        borderColor: '#24D29B',
        borderRadius: PR * 46,
        paddingHorizontal: PR * 10,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    alertActionConfirm: {
        color: '#FFF',
        backgroundColor: '#24D29B',
    },
})

export default AlertModel;