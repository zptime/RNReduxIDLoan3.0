import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const FilterModel = ({data, active, doAction}) => {
    return (
        <View style={styles.filterWrap}>
            {
                data.map((item, index) => {
                    return (
                        <TouchableOpacity style={[styles.filterItem, index === 1 && styles.filterItemHack, active[index] === 1 && styles.filterItemActive]} activeOpacity={1} key={index} onPress={() => doAction(index)}>
                            <Text numberOfLines={1} style={[styles.filterText, active[index] === 1 && styles.filterTextActive]}>{item}</Text>
                            <Image style={styles.filterIcon} source={active[index] === 1 ? require('./../../assets/img/icon_arrow1.png') : require('./../../assets/img/icon_arrow2.png')} />
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    filterWrap: {
        flexDirection: 'row',
        alignContent: 'space-around',
        marginHorizontal: PR * 20,
    },
    filterItem: {
        flex: 1,
        borderWidth: PR * 1,
        borderColor: '#24D29B',
        borderRadius: PR * 6,
    },
    filterItemActive: {
        backgroundColor: '#24D29B',
    },
    filterItemHack: {
        marginHorizontal: PR * 5,
    },
    filterText: {
        height: PR * 36,
        paddingRight: PR * 17,
        fontSize: PR * 10,
        color: '#24D29B',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    filterTextActive: {
        color: '#fff',
    },
    filterIcon: {
        position: 'absolute',
        top: '50%',
        marginTop: -PR * 2,
        right: PR * 8,
        width: PR * 9,
        height: PR * 6,
    },
})

export default FilterModel;