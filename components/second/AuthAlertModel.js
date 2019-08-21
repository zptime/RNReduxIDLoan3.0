import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Modal } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const AuthAlertModel = ({ data, state, doAction }) => {
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
                    <Text style={styles.alertTitle}>Konfirmasi Informasi KTP</Text>
                    <View style={styles.authWrap}>
                        <View style={styles.authItem}>
                            <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Nama Sesuai KTP</Text>
                            <Text style={styles.authItemValue}>{data.name}</Text>
                        </View>
                        <View style={styles.authItem}>
                            <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Nomor KTP</Text>
                            <Text style={styles.authItemValue}>{data.idcard}</Text>
                        </View>
                        <Text style={styles.authItemHint}>Pastikan informasi benar,setelah konfirmasi tidak dapat diubah lagi.</Text>
                    </View>
                    <View style={styles.alertAction}>
                        <Text style={[styles.alertActionBtn, styles.alertActionConfirm]} onPress={() => doAction(true)}>Yakin</Text>
                        <Text style={styles.alertActionBtn} onPress={() => doAction(false)}>Ubah</Text>
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
    authWrap: {
        marginHorizontal: PR * 20,
        marginTop: PR * 20,
    },
    authItem: {
        marginBottom: PR * 15,
    },
    authItemText: {
        color: '#ADD5C7',
        fontSize: PR * 15,
        fontWeight: 'bold',
    },
    authItemDot: {
        width: PR * 6,
        height: PR * 6,
    },
    authItemValue: {
        height: PR * 38,
        textAlignVertical: 'center',
        borderBottomWidth: PR * 1,
        borderBottomColor: '#F2F2F2',
        fontSize: PR * 15,
        color: '#999',
        paddingHorizontal: PR * 10,
    },
    authItemHint: {
        fontSize: PR * 12,
        color: '#FCCF33',
        lineHeight: PR * 15,
    },
})

export default AuthAlertModel;