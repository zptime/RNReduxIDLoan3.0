import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const AppListModel = ({item, doAction}) => {
    return (
        <View style={styles.listItem}>
            <Image style={styles.listIcon} source={{ uri: item.icon }} />
            <View style={styles.listContent}>
                <Text style={styles.listContentText}>{item.name}</Text>
                {
                    item.evaluate.summary !== 0 &&
                    <Text style={styles.listContentScore}><Image style={styles.listContentIcon} source={require('./../../assets/img/icon_score.png')} /> {item.evaluate.summary / 10}</Text>
                }
            </View>
            <TouchableOpacity activeOpacity={1} style={styles.listBtn} onPress={() => doAction(item)}>
                <Text style={styles.listBtnText}>Buka</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        height: PR * 69,
        backgroundColor: '#EDF6F3',
        alignItems: 'center',
        borderRadius: PR * 6,
        marginBottom: PR * 10,
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
        fontSize: PR * 15,
        color: '#333',
        fontWeight: 'bold',
    },
    listContentScore: {
        fontSize: PR * 15,
        color: '#FCCF33',
    },
    listContentIcon: {
        width: PR * 16,
        height: PR * 15,
    },
    listBtn: {
        borderWidth: PR * 1,
        borderColor: '#24D29B',
        width: PR * 92,
        height: PR * 22,
        borderRadius: PR * 20,
        marginRight: PR * 15,
        justifyContent: 'center',
    },
    listBtnText: {
        textAlign: 'center',
        color: '#24D29B',
        fontWeight: 'bold',
        fontSize: PR * 12,
    },
})

export default AppListModel;