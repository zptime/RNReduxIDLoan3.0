import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const ApiAuthModel = ({ data, orderId, authTypeActive, doAction }) => {
    return (
        <View style={styles.authWrap}>
            {
                data.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.authItem} activeOpacity={1} onPress={() => doAction(index)}>
                            <Image style={styles.authItemIcon} source={item.icon} />
                            <Text style={styles.authItemText}>{item.text}</Text>
                            {
                                item.is_auth === 1 &&
                                <Text style={[styles.authItemBtn, styles.authItemBtnOver, orderId !== 0 && styles.authItemBtnStop]}><Image style={[styles.authItemBtnIcon, orderId !== 0 && styles.authItemBtnIconActive]} source={require('./../../assets/img/icon_auth5.png')} /> Selesai</Text>
                            }
                            {
                                item.is_auth === 0 &&
                                <Text style={[styles.authItemBtn, authTypeActive === item.auth_type && styles.authItemBtnActive]}>Sertifikasi</Text>
                            }
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    authWrap: {
        marginTop: PR * 10,
    },
    authItem: {
        backgroundColor: 'rgba(173, 213, 199, 0.2)',
        borderRadius: PR * 6,
        flexDirection: 'row',
        height: PR * 54,
        paddingHorizontal: PR * 10,
        marginBottom: PR * 5,
        alignItems: 'center',
    },
    authItemIcon: {
        marginRight: PR * 10,
        width: PR * 22,
        height: PR * 22,
    },
    authItemText: {
        flex: 1,
        color: '#ADD5C7',
        fontSize: PR * 15,
    },
    authItemBtn: {
        width: PR * 70,
        height: PR * 22,
        borderRadius: PR * 22,
        borderWidth: PR * 1,
        borderColor: 'rgba(173, 213, 199, 0.5)',
        color: '#FFF',
        fontSize: PR * 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: 'rgba(173, 213, 199, 0.5)',
    },
    authItemBtnOver: {
        backgroundColor: 'transparent',
        color: '#ADD5C7',
    },
    authItemBtnActive: {
        borderColor: '#ADD5C7',
        backgroundColor: '#ADD5C7',
    },
    authItemBtnStop: {
        borderColor: '#EEE',
        color: '#999',
    },
    authItemBtnIcon: {
        width: PR * 10,
        height: PR * 10,
    },
    authItemBtnIconActive: {
        tintColor: '#999',
    },
})

export default ApiAuthModel;