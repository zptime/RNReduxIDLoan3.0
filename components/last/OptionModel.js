import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const OptionModel = ({data, doAction}) => {
    return (
        <View style={styles.optionWrap}>
            {
                data.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.optionItem} activeOpacity={1} onPress={() => doAction(item)}>
                            <Image style={styles.optionIcon} source={item.icon} />
                            <Text style={styles.optionText}>{item.text}</Text>
                            <Image style={styles.optionArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    optionWrap: {
        margin: PR * 20,
        backgroundColor: '#EDF6F3',
        borderRadius: PR * 6,
        paddingHorizontal: PR * 15,
        paddingVertical: PR * 10,
    },
    optionItem: {
        flexDirection: 'row',
        height: PR * 40,
        alignItems: 'center',
    },
    optionIcon: {
        width: PR * 18,
        height: PR * 18,
        marginRight: PR * 10,
    },
    optionText: {
        fontSize: PR * 15,
        color: '#333',
        fontWeight: 'bold',
    },
    optionArrow: {
        width: PR * 6,
        height: PR * 9,
        position: 'absolute',
        top: '50%',
        right: 0,
        marginTop: - PR * 4.5,
    },
})

export default OptionModel;