import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Modal } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const AuthSelectModel = ({ data, state, selectKey, selectValue, title, doAction }) => {
    const SelectModel = state &&
        <Modal
            animationType='fade'
            transparent={true}
            visible={state}
            onRequestClose={() => doAction(selectKey, null)}
        >
            <StatusBar backgroundColor='rgba(0, 0, 0, 0.7)' barStyle='light-content' />
            <View style={styles.selectModel}>
                <TouchableOpacity activeOpacity={1} style={styles.selectMask} onPress={() => doAction(selectKey, null)}></TouchableOpacity>
                <View style={styles.selectContent}>
                    <Text style={styles.selectTitle}>{title}</Text>
                    <FlatList
                        style={styles.selectlist}
                        showsVerticalScrollIndicator={false}
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Text style={[styles.selectlistItem, selectValue === item.value && styles.selectlistActive]} onPress={() => doAction(selectKey, item)}>{item.label}</Text>}
                    />
                </View>
            </View>
        </Modal>
    return (
        SelectModel
    );
}

const styles = StyleSheet.create({
    selectModel: {
        flex: 1,
        justifyContent: 'center',
    },
    selectMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    selectContent: {
        marginHorizontal: PR * 20,
        backgroundColor: '#FFF',
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
    },
    selectlist: {
        maxHeight: PR * 460,
        margin: PR * 20,
    },
    selectlistItem: {
        lineHeight: PR * 43,
        textAlign: 'center',
        fontSize: PR * 15,
        color: '#000',
    },
    selectlistActive: {
        backgroundColor: 'rgba(36, 210, 155, 0.1)',
        color: '#24D29B',
    },
})

export default AuthSelectModel;