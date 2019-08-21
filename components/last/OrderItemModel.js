import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';
import { FormatNumber, FormatDate } from './../../assets/js/AppConfig';

const OrderItemModel = ({ item, statusConfig, doAction }) => {
    let loanTerm = item.loan_term;
    if (item.term_type === 2) {
        loanTerm = loanTerm * 30;
    }

    if (item.term_type === 3) {
        loanTerm = loanTerm * 360;
    }

    let statusText = '';
    statusConfig.map(value => {
        if (value.status === item.status) {
            statusText = value.text;
        }
    });

    return (
        <TouchableOpacity activeOpacity={1} style={styles.listItem} onPress={() => doAction(item)}>
            <Image style={styles.listIcon} source={{ uri: item.plate_icon }} />
            <View style={styles.listContent}>
                <Text numberOfLines={1} style={styles.listContentText}>{item.plate_name}</Text>
                <View style={styles.listContentItem}>
                    <Text style={styles.listItemName}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.listItemDot} /> Pinjaman</Text>
                    <Text style={[styles.listItemValue, styles.listItemValueHack]}>Rp {FormatNumber(item.loan_amount / 100)}</Text>
                </View>
                <View style={styles.listContentItem}>
                    <Text style={styles.listItemName}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.listItemDot} /> Tenggat pinjaman</Text>
                    <Text style={styles.listItemValue}>{loanTerm} Hari</Text>
                </View>
                <View style={styles.listContentItem}>
                    <Text style={styles.listItemName}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.listItemDot} /> Waktu penfajuan</Text>
                    <Text style={styles.listItemValue}>{FormatDate(new Date(item.created_at * 1000), 'yyyy/MM/dd')}</Text>
                </View>
            </View>
            <Text style={styles.listState}>{statusText}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        backgroundColor: '#EDF6F3',
        alignItems: 'center',
        borderRadius: PR * 6,
        marginBottom: PR * 10,
        paddingTop: PR * 15,
        paddingBottom: PR * 10,
        paddingRight: PR * 15,
        alignItems: 'flex-start',
    },
    listIcon: {
        width: PR * 33,
        height: PR * 33,
        marginLeft: PR * 15,
        marginRight: PR * 10,
        borderRadius: PR * 33,
    },
    listContent: {
        flex: 1,
    },
    listContentText: {
        lineHeight: PR * 33,
        fontSize: PR * 15,
        color: '#333',
        fontWeight: 'bold',
        marginRight: PR * 145,
    },
    listContentItem: {
        marginLeft: -PR * 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listItemName: {
        fontSize: PR * 12,
        color: '#ADD5C7',
    },
    listItemValueHack: {
        fontSize: PR * 15,
        fontWeight: 'bold',
    },
    listItemDot: {
        width: PR * 4,
        height: PR * 4,
    },
    listItemValue: {
        fontSize: PR * 12,
        color: '#24D29B',
        lineHeight: PR * 24,
    },
    listState: {
        position: 'absolute',
        top: PR * 22,
        right: PR * 15,
        width: PR * 140,
        height: PR * 20,
        borderWidth: PR * 0.5,
        borderColor: '#24D29B',
        borderRadius: PR * 20,
        textAlign: 'center',
        alignItems: 'center',
        fontSize: PR * 12,
        color: '#24D29B',
    },
})

export default OrderItemModel;