import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const OrderCategoryModel = ({data, doAction}) => {
    return (
        <View style={styles.orderCategoryWrap}>
            <View style={styles.orderCategoryTitle}>
                <Text style={styles.orderCategoryTitleText}>Pinjaman saya</Text>
                <Text style={styles.orderCategoryTitleBtn} onPress={() => doAction([0])}>semua</Text>
            </View>
            <View style={styles.orderCategoryContent}>
                {
                    data.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={styles.orderCategoryItem} activeOpacity={1} onPress={() => doAction(item.status)}>
                                <Image style={styles.orderCategoryIcon} source={item.icon} />
                                <Text style={styles.orderCategoryText}>{item.text}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    orderCategoryWrap: {
        marginHorizontal: PR * 20,
    },
    orderCategoryTitleText: {
        fontSize: PR * 18,
        color: '#333',
        fontWeight: 'bold',
    },
    orderCategoryTitleBtn: {
        position: 'absolute',
        right: 0,
        marginTop: PR * 2,
        width: PR * 50,
        height: PR * 22,
        paddingTop: PR * 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: PR * 12,
        backgroundColor: '#ADD5C7',
        borderRadius: PR * 22,
    },
    orderCategoryContent: {
        flexDirection: 'row',
        paddingTop: PR * 20,
        paddingHorizontal: PR * 10,
        justifyContent: 'space-between',
    },
    orderCategoryItem: {
        alignItems: 'center',
    },
    orderCategoryIcon: {
        width: PR * 45,
        height: PR * 45,
        marginBottom: PR * 5,
    },
    orderCategoryText: {
        fontSize: PR * 12,
        color: '#666',
        textAlign: 'center',
    },
})

export default OrderCategoryModel;