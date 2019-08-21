import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PR } from '../../../assets/css/AppStyles';

import PropTypes from 'prop-types';

class ProductItemModel extends Component {
    static propTypes = {
        data: PropTypes.shape({
            id: PropTypes.string.isRequired,
            type: PropTypes.number.isRequired,//1-Pinjaman，2-Sertifikasi
            name: PropTypes.string.isRequired,
            icon: PropTypes.number.isRequired,
            slogan: PropTypes.string.isRequired,
            min_loan: PropTypes.string.isRequired,
            max_loan: PropTypes.string.isRequired,
            min_pay_time: PropTypes.string.isRequired,
            max_pay_time: PropTypes.string.isRequired,
            day_rate: PropTypes.string.isRequired,
        }).isRequired,
        showFlag:PropTypes.bool,//是否显示全部信息，默认是；false，隐藏部分信息，一行两个
        doAction: PropTypes.func
    };

    static defaultProps = {
        showFlag:true,
    }

    constructor(props){
        super(props);

        this.data = this.props.data;
        this.showFlag = this.props.showFlag;
        this.doAction = this.props.doAction;
    }

    render() {
        return (
            <TouchableOpacity  activeOpacity={1} style={styles.itemWrap} onPress={() => this.doAction(this.data)}>
                <Image style={styles.itemIcon} source={this.data.icon}/>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>
                        {this.data.name} <Image style={styles.itemIconHot} source={require('../../../assets/img/icon_hot.png')}/>
                    </Text>
                    <Text style={styles.itemSection}>
                        { this.showFlag && <Text>Jumlah maksimum </Text> }
                        <Text style={styles.itemSectionValue}>RP {this.data.max_loan}</Text>
                    </Text>
                    <View style={styles.itemOther}>
                        { this.showFlag &&
                            <Text style={[styles.itemSection, styles.itemOtherSection]}>
                                { this.showFlag && <Text>Bunga </Text> }
                                <Text style={styles.itemOtherValue}>{this.data.day_rate}%/Hari</Text>
                            </Text>
                        }
                        <Text style={[styles.itemSection, styles.itemOtherSection]}>
                            { this.showFlag && <Text>Waktu </Text> }
                            <Text style={styles.itemOtherValue}>{this.data.min_pay_time}-{this.data.max_pay_time} Hari</Text>
                        </Text>
                    </View>
                </View>
                {
                    this.showFlag && (this.data.type === 1 || this.data.type === 2) &&
                    <Text style={[styles.itemBtn, (this.data.type===2 && styles.itemBtn2)]}>
                        { this.data.type === 1 && <Text>Pinjaman</Text> }
                        { this.data.type === 2 && <Text>Sertifikasi</Text> }
                    </Text>
                }
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    itemWrap: {
        flexDirection: 'row',
        paddingTop: 10 * PR,
        marginBottom: 20 * PR,
        width: 'auto',
    },
    itemIcon: {
        width: 24 * PR,
        height: 24 * PR,
        borderRadius: 24 * PR,
        marginRight: 8 * PR,
    },
    itemContainer: {
        flex: 1,
    },
    itemTitle:{
        color: '#3E587B',
        fontSize: 15 * PR,
        fontWeight: 'bold',
        lineHeight: 24 * PR,
    },
    itemIconHot:{
        width: 24 * PR,
        height: 14 * PR,
    },
    itemSection:{
        color: '#999',
        fontSize: 12 * PR,
    },
    itemSectionValue:{
        color: '#52AA9B',
        fontSize: 15 * PR,
        fontWeight: 'bold',
        marginLeft: 7 * PR,
    },
    itemOther: {
        flexDirection: 'row',
        marginTop: 5 * PR,
    },
    itemOtherSection: {
        flex: 1,
    },
    itemOtherValue: {
        color:'#8AA2C3',
    },
    itemBtn: {
        width: 90 * PR,
        height: 28 * PR,
        borderRadius: 14 * PR,
        backgroundColor: '#DCEEEB',
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    itemBtn2: {
        backgroundColor: '#52AA9B',
    },
})

export default  ProductItemModel;