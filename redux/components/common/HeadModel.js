import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { PR } from '../../../assets/css/AppStyles';

const HeadModel = ({data = {}, doAction = null}) => {
    return (
        <View style={styles.headWrap}>
            <TouchableOpacity activeOpacity={1} style={styles.headBtn} onPress={() => doAction()}>
                { data.showAvatar && <Image style={styles.avatarImg} source={require('../../../assets/img/icon_contactus.png')}></Image> }
                { data.showBack && <Image style={styles.backImg} source={require('../../../assets/img/mask/icon_arrow4.png')}></Image> }
            </TouchableOpacity>
            <Text style={styles.headTitle}>{data.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20 * PR,
        marginTop: 10 * PR,
    },
    headTitle: {
        fontSize: 18 * PR,
        color: '#333',
        fontWeight: 'bold',
    },
    headBtn: {
        position: 'absolute',
        left:0,
    },
    avatarImg: {
        width: 18 * PR,
        height: 18 * PR,
    },
    backImg: {
        width: 10 * PR,
        height: 15 * PR,
        transform: [{rotate:'180deg'}]
    },
})

export default  HeadModel;