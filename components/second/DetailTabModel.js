import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const DetailTabModel = ({data, tabIndex, doAction}) => {
    return (
        <View style={styles.tabWrap}>
            {
                data.map((item, index) => {
                    return (
                        <Text onPress={() => doAction(index)} key={index} style={[styles.tabText, tabIndex === index && styles.tabTextActive]}>{item}</Text>
                    )
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    tabWrap: {
        flexDirection: 'row',
    },
    tabText: {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        height: PR * 40,
        borderBottomWidth: PR * 2,
        borderBottomColor: '#FFF',
        fontSize: PR * 18,
        color: '#333',
        fontWeight: 'bold',
    },
    tabTextActive: {
        color: '#24D29B',
        borderBottomColor: '#24D29B',
    },
})

export default DetailTabModel;