import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, ImageBackground } from 'react-native';

import { PR } from './../../assets/css/AppStyles';
import { FormatNumber } from './../../assets/js/AppConfig';

const ProductItemModel = ({item, doAction}) => {
    // 已认证数量
    let authNumber = 0;
    item.auth_progress.map(item => {
        if (item.is_auth === 1) {
            authNumber++;
        }
    });

    return (
        <ImageBackground style={styles.bgImage} source={require('./../../assets/img/icon_hot_border.png')} resizeMode='contain'>
        <TouchableOpacity style={styles.itemModel} activeOpacity={1} onPress={() => doAction(item)}>
            <Image style={styles.itemIcon} source={{ uri: item.icon }} />
            <View style={styles.itemContainer}>
                <Text numberOfLines={1} style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemScore}>
                    {
                        item.evaluate.summary !== 0 &&
                        <Image style={styles.itemScoreIcon} source={require('./../../assets/img/icon_score.png')} />
                    }
                    {' '}
                    {
                        item.evaluate.summary !== 0 && item.evaluate.summary / 10
                    }
                    {' '}
                    {
                        item.jump_type === 2 &&
                        <Image style={styles.itemHotIcon} source={require('./../../assets/img/icon_hot.png')} />
                    }
                </Text>
                <Text style={styles.itemSection}>Nominal <Text style={styles.itemSectionValue}>Rp {FormatNumber(item.min_loan / 100)}-{FormatNumber(item.max_loan / 100)}</Text></Text>
                <View style={styles.itemOther}>
                    <Text style={styles.itemSection}>Bunga <Text style={[styles.itemSectionValue, styles.itemOtherSection]}>{item.day_rate}%/Hari</Text></Text>
                    <Text style={styles.itemSection}>Waktu
                        {
                            item.min_pay_time === item.max_pay_time &&
                            <Text style={[styles.itemSectionValue, styles.itemOtherSection]}> {item.min_pay_time} Hari</Text>
                        }
                        {
                            item.min_pay_time !== item.max_pay_time &&
                            <Text style={[styles.itemSectionValue, styles.itemOtherSection]}> {item.min_pay_time}-{item.max_pay_time} Hari</Text>
                        }
                    </Text>
                </View>
            </View>
            <View style={styles.itemSlogan}>
                <Image style={styles.itemSloganLeft} source={require('./../../assets/img/icon_symbol1.png')} />
                <Text style={styles.itemSloganValue} numberOfLines={1}>{item.slogan}</Text>
                <Image style={styles.itemSloganRight} source={require('./../../assets/img/icon_symbol2.png')} />
            </View>
            {
                (item.jump_type === 0 || item.jump_type === 1) &&
                <Text style={[styles.itemBtn, styles.itemBtn1]}>
                    <Text style={[styles.itemBtnText, styles.itemBtnText1]}>Pinjaman</Text>
                </Text>
            }
            {
                item.jump_type === 2 &&
                <Text style={[styles.itemBtn, styles.itemBtn2]}>
                    <Text style={[styles.itemBtnText, styles.itemBtnText2]}>Sertifikasi {authNumber}/{item.auth_progress.length}</Text>
                </Text>
            }
        </TouchableOpacity>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bgImage: {
        marginBottom: PR * 10,
    },
    itemModel: {
        flexDirection: 'row',
        // backgroundColor: '#EDF6F3',
        borderRadius: PR * 6,
        paddingHorizontal: PR * 15,
        paddingTop: PR * 15,
        paddingBottom: PR * 50,
        // marginBottom: PR * 10,
    },
    itemIcon: {
        width: PR * 33,
        height: PR * 33,
        borderRadius: PR * 33,
        marginRight: PR * 10,
        backgroundColor: '#fff',
    },
    itemContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: PR * 15,
        color: '#333',
        lineHeight: PR * 15,
        marginRight: PR * 100,
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
    itemHotIcon: {
        width: PR * 24,
        height: PR * 14,
    },
    itemSection: {
        flex: 1,
        color: '#999',
        fontSize: PR * 12,
    },
    itemSectionValue: {
        color: '#24D29B',
        fontSize: PR * 15,
        fontWeight: 'bold',
    },
    itemOther: {
        flexDirection: 'row',
        marginTop: PR * 5,
    },
    itemOtherSection: {
        fontSize: PR * 12,
        fontWeight: 'normal',
    },
    itemSlogan: {
        position: 'absolute',
        left: PR * 15,
        right: PR * 15,
        bottom: PR * 20,
        paddingHorizontal: PR * 10,
    },
    itemSloganValue: {
        color: '#ADD5C7',
        fontSize: PR * 12,
        textAlign: 'center',
    },
    itemSloganLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: PR * 7,
        height: PR * 5,
    },
    itemSloganRight: {
        position: 'absolute',
        bottom: -PR * 5,
        right: 0,
        width: PR * 7,
        height: PR * 5,
    },
    itemBtn: {
        position: 'absolute',
        top: PR * 15,
        right: PR * 15,
        width: PR * 90,
        height: PR * 20,
        borderRadius: PR * 20,
        textAlign: 'center',
        alignItems: 'center',
    },
    itemBtn1: {
        borderWidth: PR * 0.5,
        borderColor: '#24D29B',
    },
    itemBtn2: {
        backgroundColor: '#24D29B',
    },
    itemBtnText: {
        fontSize: PR * 12,
    },
    itemBtnText1: {
        color: '#24D29B',
    },
    itemBtnText2: {
        color: '#FFF',
    },
})

export default ProductItemModel;