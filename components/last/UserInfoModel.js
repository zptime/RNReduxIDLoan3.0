import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';
import Global from './../../assets/js/Global';

const UserInfoModel = ({data, doAction}) => {
    return (
        <TouchableOpacity style={styles.userInfoWrap} activeOpacity={1} onPress={() => doAction()}>
            <Image style={styles.userInfoIcon} source={data.avatar ? { uri: `https://${data.avatar}` } : require('./../../assets/img/user_default.png')} />
            {
                data.user_phone &&
                <Text style={styles.userInfoText}>{data.user_phone}</Text>
            }
            {
                Global.isLogin === 1 &&
                <Image style={styles.userInfoArrow} source={require('./../../assets/img/icon_arrow3.png')} />
            }
            {
                Global.isLogin !== 1 &&
                <Text style={styles.userInfoBtn}>Login</Text>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    userInfoWrap: {
        flexDirection: 'row',
        paddingHorizontal: PR * 20,
        height: PR * 91,
        alignItems: 'center',
    },
    userInfoIcon: {
        width: PR * 51,
        height: PR * 51,
        borderRadius: PR * 51,
        marginRight: PR * 10,
    },
    userInfoText: {
        fontSize: PR * 18,
        color: '#333',
        fontWeight: 'bold',
    },
    userInfoArrow: {
        width: PR * 6,
        height: PR * 9,
        position: 'absolute',
        top: '50%',
        right: PR * 35,
        marginTop: - PR * 4.5,
    },
    userInfoBtn: {
        position: 'absolute',
        top: '50%',
        right: PR * 20,
        marginTop: - PR * 17,
        borderRadius: PR * 2,
        width: PR * 110,
        height: PR * 34,
        backgroundColor: '#24D29B',
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: PR * 17,
    },
})

export default UserInfoModel;