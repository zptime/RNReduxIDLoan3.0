import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

let stepIcon = [
    require('./../../assets/img/icon_step1.png'),
    require('./../../assets/img/icon_step2.png'),
    require('./../../assets/img/icon_step3.png')
];

const AuthStepModel = ({ data, authTypeActive }) => {
    return (
        <View style={styles.authWrap}>
            {
                data.map((item, index) => {
                    return (
                        <View key={index} style={styles.authItem}>
                            {
                                item.is_auth === 0 &&
                                authTypeActive !== item.auth_type &&
                                <Image style={styles.authItemIcon} source={stepIcon[0]} />
                            }
                            {
                                item.is_auth === 0 &&
                                authTypeActive === item.auth_type &&
                                <Image style={styles.authItemIcon} source={stepIcon[1]} />
                            }
                            {
                                item.is_auth === 1 &&
                                <Image style={styles.authItemIcon} source={stepIcon[2]} />
                            }
                            <Text style={styles.authItemText}>{item.text}</Text>
                            {
                                index !== data.length - 1 &&
                                <View style={[styles.authItemLine, item.is_auth === 1 && styles.authItemLineOver, authTypeActive === item.auth_type && styles.authItemLineActive]}></View>
                            }
                        </View>
                    )
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    authWrap: {
        flexDirection: 'row',
        marginHorizontal: PR * 20,
        marginBottom: PR * 10,
        paddingVertical: PR * 30,
        backgroundColor: '#F2F2F2',
        borderRadius: PR * 6,
    },
    authItem: {
        flex: 1,
        alignItems: 'center',
    },
    authItemIcon: {
        marginBottom: PR * 10,
        width: PR * 15,
        height: PR * 15,
    },
    authItemText: {
        color: '#ADD5C7',
        fontSize: PR * 12,
        textAlign: 'center',
    },
    authItemLine: {
        position: 'absolute',
        top: PR * 6,
        left: '50%',
        width: '50%',
        height: PR * 2,
        marginLeft: '23%',
        backgroundColor: '#ADD5C7',
    },
    authItemLineOver: {
        backgroundColor: 'rgba(36, 210, 155, 0.6)',
    },
    authItemLineActive: {
        backgroundColor: '#24D29B',
    },
})

export default AuthStepModel;