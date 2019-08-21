import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';
import { FormatNumber } from './../../assets/js/AppConfig';

const RecommendModel = ({ data, doAction }) => {
    return (
        <TouchableOpacity style={styles.itemModel} activeOpacity={1} onPress={() => doAction(data.platform_info, 'recommend')}>
            <Text numberOfLines={1} style={styles.itemTitle}>{data.platform_info.name}</Text>
            <View style={styles.itemSlogan}>
                <Image style={styles.itemSloganLeft} source={require('./../../assets/img/icon_symbol3.png')} />
                <Text style={styles.itemSloganValue} numberOfLines={1}>{data.platform_info.slogan}</Text>
                <Image style={styles.itemSloganRight} source={require('./../../assets/img/icon_symbol4.png')} />
                <View style={styles.itemSloganArrow}></View>
            </View>
            <View style={styles.itemSection}>
                <Text style={styles.itemSectionValue}>Komentar <Text style={styles.itemSectionColor}>{data.platform_info.evaluate.summary/10}</Text></Text>
                <Text style={[styles.itemSectionValue, styles.itemSectionHack]}>Tingkat lulus <Text style={styles.itemSectionColor}>{data.platform_info.success_rate}%</Text></Text>
            </View>
            <Text style={styles.itemMaxLoan}>Rp {FormatNumber(data.platform_info.max_loan / 100)}</Text>
            <Text style={styles.itemBtn}>
                <Text style={styles.itemBtnText}>Segera Ambil</Text>
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemModel: {
        borderWidth: PR * 2,
        borderColor: '#F2F2F2',
        borderRadius: PR * 6,
        marginHorizontal: PR * 20,
        marginTop: PR * 20,
        marginBottom: PR * 20,
        paddingTop: PR * 20,
        paddingBottom: PR * 20,
    },
    itemTitle: {
        position: 'absolute',
        top: -PR * 15,
        alignSelf: 'center',
        paddingHorizontal: PR * 10,
        backgroundColor: '#FFF',
        fontSize: PR * 20,
        color: '#000',
        lineHeight: PR * 30,
    },
    itemScore: {
        fontSize: PR * 15,
        color: '#FCCF33',
        lineHeight: PR * 24,
        alignItems: 'center',
    },
    itemScoreIcon: {
        width: PR * 16,
        height: PR * 15,
    },
    itemSection: {
        flexDirection: 'row',
        marginHorizontal: PR * 30,
        marginTop: PR * 15,
    },
    itemSectionValue: {
        flex: 1,
        color: '#999',
        fontSize: PR * 15,
    },
    itemSectionColor: {
        color: '#FCCF33',
    },
    itemSectionHack: {
        textAlign: 'right',
    },
    itemMaxLoan: {
        paddingVertical: PR * 10,
        color: '#24D29B',
        fontSize: PR * 21,
        textAlign: 'center',
    },
    itemSlogan: {
        marginHorizontal: PR * 30,
        paddingHorizontal: PR * 25,
        backgroundColor: '#FFF8E0',
        borderRadius: PR * 6,
    },
    itemSloganValue: {
        color: '#FCCF33',
        fontSize: PR * 12,
        textAlign: 'center',
        lineHeight: PR * 30,
    },
    itemSloganLeft: {
        position: 'absolute',
        top: PR * 5,
        left: PR * 15,
        width: PR * 7,
        height: PR * 5,
    },
    itemSloganRight: {
        position: 'absolute',
        bottom: PR * 5,
        right: PR * 15,
        width: PR * 7,
        height: PR * 5,
    },
    itemSloganArrow: {
        position: 'absolute',
        bottom: - PR * 15,
        right: PR * 10,
        width: 0,
        height: 0,
        borderWidth: PR * 7.5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: '#FFF8E0',
    },
    itemBtn: {
        marginHorizontal: PR * 20,
        height: PR * 48,
        borderRadius: PR * 48,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: '#24D29B',
    },
    itemBtnText: {
        fontSize: PR * 17,
        color: '#FFF',
    },
})

export default RecommendModel;