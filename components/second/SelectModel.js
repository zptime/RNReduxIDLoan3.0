import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, StatusBar } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const SelectModel = ({data, doAction}) => {
    const selectModal = data.state &&
        <Modal
            animationType='fade'
            transparent={true}
            visible={data.state}
            onRequestClose={() => { doAction(data, -1) }}
        >
            <StatusBar backgroundColor='rgba(0, 0, 0, 0.7)' barStyle='light-content' />
            <TouchableOpacity style={styles.selectWrap} activeOpacity={1} onPress={() => { doAction(data, -1) }}>
                <View style={styles.selectContainer}>
                    <Text style={styles.selectTitle}>{data.title}</Text>
                    {
                        data.list.map((item, index) => {
                            return (
                                <TouchableOpacity style={[styles.selectItem, data.index === index && styles.selectItemActive]} activeOpacity={1} key={index} onPress={() => doAction(data, index)}>
                                    <Text numberOfLines={1} style={[styles.selectText, data.index === index && styles.selectTextActive]}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </TouchableOpacity>
        </Modal>
    return (
        selectModal
    );
}

const styles = StyleSheet.create({
    selectWrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .7)',
        justifyContent: 'center',
    },
    selectContainer: {
        backgroundColor: '#fff',
        marginHorizontal: PR * 20,
        paddingBottom: PR * 20,
        borderRadius: PR * 6,
        overflow: 'hidden',
    },
    selectTitle: {
        height: PR * 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: PR * 15,
        color: '#999',
        fontWeight: 'bold',
        backgroundColor: '#f2f2f2',
        marginBottom: PR * 10,
    },
    selectItem: {
        marginHorizontal: PR * 20,
    },
    selectItemActive: {
        backgroundColor: 'rgba(36, 210, 155, 0.1)',
    },
    selectText: {
        height: PR * 44,
        fontSize: PR * 15,
        color: '#000',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    selectTextActive: {
        color: '#24D29B',
    },
})

export default SelectModel;