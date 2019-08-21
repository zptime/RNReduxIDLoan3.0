import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const CategoryModel = ({data, doAction}) => {
    return (
        <View style={styles.categoryWrap}>
            {
                data.map((item, key) => {
                    return (
                        <TouchableOpacity style={styles.categoryItem} activeOpacity={1} key={key} onPress={() => doAction(item)}>
                            <Image style={styles.categoryIcon} source={{ uri: item.image_url }} />
                            <Text numberOfLines={1} style={styles.categoryText}>{item.title}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    categoryWrap: {
        flexDirection: 'row',
        paddingVertical: PR * 15,
        marginHorizontal: PR * 20,
    },
    categoryItem: {
        flex: 1,
    },
    categoryIcon: {
        width: PR * 43,
        height: PR * 43,
        borderRadius: PR * 43,
        marginBottom: PR * 5,
        alignSelf: 'center',
        backgroundColor: '#eee',
    },
    categoryText: {
        fontSize: PR * 12,
        color: '#333',
        textAlign: 'center',
    },
})

export default CategoryModel;