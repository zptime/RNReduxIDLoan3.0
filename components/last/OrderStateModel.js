import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const OrderStateModel = ({data, activeIndex, doAction}) => {
    let stateData = [];
    for (const item of data) {
        if ((activeIndex <= 2 || activeIndex > 3) && item.status === 3) {
            continue;
        }

        if (activeIndex === 3 && item.status === 2) {
            continue;
        }

        if ((activeIndex <= 6 || activeIndex > 7) && item.status === 7) {
            continue;
        }

        if (activeIndex === 7 && item.status === 6) {
            continue;
        }

        stateData.push(item);
    }

    return (
        <View style={styles.orderStateWrap}>
            <View style={styles.orderStateContainer}>
                <Text style={styles.orderStateTitle}>Periksa rincian</Text>
                <View style={styles.orderStateContent}>
                    {
                        stateData.map((item, index) => {
                            return (
                                <View key={index} style={[
                                    styles.orderStateItem,
                                    activeIndex >= item.status && styles.orderStateItemOver,
                                    index === stateData.length - 1 && styles.orderStateItemHack
                                ]}>
                                    <Text style={styles.orderStateIcon}>
                                        {
                                            (item.status === 3 || item.status === 7) &&
                                            <Image style={styles.orderStateImg} source={require('./../../assets/img/icon_step4.png')} />
                                        }
                                        {
                                            activeIndex > item.status &&
                                            <Image style={styles.orderStateImg} source={require('./../../assets/img/icon_step3.png')} />
                                        }
                                        {
                                            activeIndex === item.status &&
                                            item.status === 9 &&
                                            <Image style={styles.orderStateImg} source={require('./../../assets/img/icon_step3.png')} />
                                        }
                                        {
                                            activeIndex === item.status &&
                                            item.status !== 3 &&
                                            item.status !== 7 &&
                                            item.status !== 9 &&
                                            <Image style={styles.orderStateImg} source={require('./../../assets/img/icon_step2.png')} />
                                        }
                                        {
                                            activeIndex < item.status &&
                                            <Image style={styles.orderStateImg} source={require('./../../assets/img/icon_step1.png')} />
                                        }
                                    </Text>
                                    <Text style={[
                                        styles.orderStateText,
                                        activeIndex > item.status && styles.orderStateTextOver,
                                        activeIndex === item.status && styles.orderStateTextActive,
                                        (item.status === 3 || item.status === 7) && styles.orderStateTextFail
                                    ]}>{item.text}</Text>
                                </View>
                            )
                        })
                    }
                    <Text style={styles.orderStateBtn} onPress={() => doAction(false)}>AKU TAHU</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    orderStateWrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0 ,0, 0, 0.7)',
        justifyContent: 'center',
    },
    orderStateContainer: {
        marginHorizontal: PR * 20,
        borderRadius: PR * 6,
        overflow: 'hidden',
    },
    orderStateTitle: {
        lineHeight: PR * 40,
        textAlign: 'center',
        backgroundColor: '#F2F2F2',
        fontSize: PR * 15,
        color: '#999',
        fontWeight: 'bold',
    },
    orderStateContent: {
        backgroundColor: '#FFF',
        paddingHorizontal: PR * 60,
        paddingTop: PR * 20,
        paddingBottom: PR * 30,
    },
    orderStateItem: {
        marginLeft: PR * 25,
        paddingLeft: PR * 20,
        borderLeftWidth: PR * 2,
        borderLeftColor: '#ADD5C7',
        height: PR * 44,
    },
    orderStateItemOver: {
        borderLeftColor: '#24D29B',
    },
    orderStateItemHack: {
        height: PR * 27,
    },
    orderStateIcon: {
        position: 'absolute',
        top: 0,
        left: -PR * 13.5,
        width: PR * 27,
        height: PR * 27,
        paddingVertical: PR * 3,
        borderRadius: PR * 27,
        backgroundColor: '#FFF',
        textAlign: 'center',
    },
    orderStateImg: {
        width: PR * 15,
        height: PR * 15,
    },
    orderStateText: {
        lineHeight: PR * 25,
        fontSize: PR * 15,
        color: '#ADD5C7',
    },
    orderStateTextOver: {
        color: 'rgba(36, 210, 155, 0.5)',
    },
    orderStateTextActive: {
        color: '#24D29B',
    },
    orderStateTextFail: {
        color: '#FCCF33',
    },
    orderStateBtn: {
        marginTop: PR * 20,
        lineHeight: PR * 48,
        borderRadius: PR * 48,
        borderWidth: PR * 1,
        textAlign: 'center',
        borderColor: '#24D29B',
        color: '#24D29B',
        fontSize: PR * 17,
        fontWeight: 'bold',
    },
})

export default OrderStateModel;