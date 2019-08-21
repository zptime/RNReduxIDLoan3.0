import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { PR } from '../../../assets/css/AppStyles';

class CategoryModel extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: [{
                id: "WpIAc9by5iU",
                image_url: require('../../../assets/img/icon_upload2.png'),
                title: "Kredit",
                subtitle: "Bank",
                color: "#7F5960",
            }, {
                id: "sNPnbI1arSE",
                image_url: require('../../../assets/img/icon_upload3.png'),
                title: "Kredit",
                subtitle: "Mobil",
                color: "#FAA068",
            }, {
                id: "VOgFZfRVaww",
                image_url: require('../../../assets/img/icon_upload4.png'),
                title: "Kredit",
                subtitle: "Rumah",
                color: "#52AA9B",
            },{
                id: "WpIAc9by5iU",
                image_url: require('../../../assets/img/icon_upload2.png'),
                title: "Kredit",
                subtitle: "Moto",
                color: "#677FA8",
            }]
        };
        this.props = props;
    }

    _onPressButton(index){
        console.log("clicked to index", index)
    }

    render() {
        let { data } = this.state;
        return (
            <View style={styles.categoryWrap}>
                {
                    data && data.map((item, key) => {
                        return (
                            <TouchableOpacity style={[styles.categoryItem, key !== data.length-1 && styles.categorySplit, { backgroundColor: item.color }]} activeOpacity={1} key={key} onPress={() => this._onPressButton(item)}>
                                {/* <Image style={styles.categoryIcon} source={item.image_url} /> */}
                                <Text numberOfLines={1} style={styles.categoryText}>{item.title}</Text>
                                <Text numberOfLines={1} style={styles.categorySubText}>{item.subtitle}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    categoryWrap: {
        marginHorizontal: 20 * PR,
        display: 'flex',
        flexDirection: 'row',
    },
    categoryItem: {
        flex: 1,
        height: 48 * PR,
        borderRadius: 14 * PR,
        justifyContent: 'center',
        maxWidth: '33.3%',
    },
    categorySplit: {
        marginRight: 7 * PR,
    },
    categoryIcon: {
        width: '100%',
        height: '100%',
        borderRadius: 14 * PR,
    },
    categoryText: {
        fontSize: 15 * PR,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 14 * PR,
    },
    categorySubText: {
        fontSize: 12 * PR,
        color: '#fff',
        marginLeft: 14 * PR,
    },
})

export default  CategoryModel;