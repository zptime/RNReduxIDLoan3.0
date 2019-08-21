import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

import { PR } from './../../assets/css/AppStyles';
import { FormatNumber } from './../../assets/js/AppConfig';

class ProductInfoModel extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;
        this.doAction = this.props.doAction;

        this.state = {
            quota: 0,
            term: 0,
            payment: 0,
            interest: 0,
        };
    }

    componentDidMount() {
        this._updateData(Number(this.data.max_loan), this.data.pay_select && Number(this.data.pay_select[0].value));
    }

    componentWillUnmount() {}

    _updateData(quota, term) {
        let state = {
            quota: quota ? quota : this.state.quota,
            term: term ? term : this.state.term,
        };

        state.interest = state.quota * Number(this.data.day_rate) / 100 * state.term;

        state.payment = state.quota + state.interest;

        this.setState(state);
    }

    render() {
        return (
            <View style={styles.infoModel}>
                <View style={styles.infoSelect}>
                    <View style={styles.infoSelectItem}>
                        <View style={styles.infoSelectItemTitle}>
                            <Text style={styles.infoSelectItemName}>Jumlah</Text>
                            <Text style={[styles.infoSelectItemName, styles.infoSelectQuota]}>Rp {FormatNumber(this.state.quota / 100)}</Text>
                        </View>
                        <Slider
                            style={styles.infoSelectSlider}
                            step={10000}
                            minimumValue={this.data.min_loan / 100}
                            maximumValue={this.data.max_loan / 100}
                            value={this.state.quota / 100}
                            minimumTrackTintColor='#FCCF33'
                            maximumTrackTintColor='#FFFFFF'
                            thumbTintColor='#FFFFFF'
                            onValueChange={quota => this.setState({ quota: quota * 100 })}
                            onSlidingComplete={quota => this._updateData(quota * 100, undefined)}
                        />
                        <View style={styles.infoSelectItemValue}>
                            <Text style={styles.infoSelectDefaultQuota}>{FormatNumber(this.data.min_loan / 100)}</Text>
                            <Text style={[styles.infoSelectDefaultQuota, styles.infoSelectDefaultQuotaRight]}>{FormatNumber(this.data.max_loan / 100)}</Text>
                        </View>
                    </View>
                    <View style={styles.infoSelectItem}>
                        <View style={styles.infoSelectItemTitle}>
                            <Text style={styles.infoSelectItemName}>Waktu</Text>
                        </View>
                        <View style={styles.infoSelectItemValue}>
                            {
                                this.data.pay_select && this.data.pay_select.map((item, index) => {
                                    return (
                                        <LinearGradient style={[styles.infoSelectTerm, this.state.term === Number(item.value) && styles.infoSelectTermActive]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={this.state.term === Number(item.value) ? ['#FFF', '#E4FFF6'] : ['transparent', 'transparent']}  key={index}>
                                            <Text style={[styles.infoSelectTermText, this.state.term === Number(item.value) && styles.infoSelectTermTextActive]} onPress={() => this._updateData(undefined, Number(item.value))}>{item.text}</Text>
                                        </LinearGradient>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.infoResult}>
                    <View style={styles.infoResultItem}>
                        <Text style={styles.infoResultItemValue}>Rp {FormatNumber(this.state.payment / 100)}</Text>
                        <Text style={styles.infoResultItemName}>Pembayaran</Text>
                    </View>
                    <View style={styles.infoResultItem}>
                        <Text style={styles.infoResultItemValue}>Rp {FormatNumber(this.state.quota / 100)}</Text>
                        <Text style={styles.infoResultItemName}>Pinjaman</Text>
                    </View>
                    <View style={[styles.infoResultItem, styles.infoResultItemHack]}>
                        <Text style={styles.infoResultItemValue}>Rp {FormatNumber(this.state.interest / 100)}</Text>
                        <Text style={styles.infoResultItemName}>Bunga</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    infoModel: {
        marginHorizontal: PR * 20,
        marginTop: PR * 10,
        marginBottom: PR * 20,
    },
    infoSelect: {
        backgroundColor: '#24D29B',
        borderRadius: PR * 6,
        paddingHorizontal: PR * 15,
        paddingTop: PR * 15,
        paddingBottom: PR * 10,
        marginBottom: PR * 10,
    },
    infoSelectItem: {
        marginBottom: PR * 20,
    },
    infoSelectItemTitle: {
        flexDirection: 'row',
    },
    infoSelectItemName: {
        flex: 1,
        color: '#FFF',
        fontSize: PR * 18,
        fontWeight: 'bold',
    },
    infoSelectQuota: {
        color: '#FCCF33',
        textAlign: 'right',
    },
    infoSelectItemValue: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoSelectSlider: {
        marginLeft: -PR * 15,
        marginRight: -PR * 15,
        paddingVertical: PR * 5,
    },
    infoSelectDefaultQuota: {
        flex: 1,
        fontSize: PR * 15,
        color: '#fff',
    },
    infoSelectDefaultQuotaRight: {
        textAlign: 'right',
    },
    infoSelectTerm: {
        borderWidth: PR * 0.5,
        borderColor: '#FFF',
        borderRadius: PR * 6,
        width: PR * 72,
        height: PR * 32,
        marginRight: PR * 4,
        marginTop: PR * 10,
    },
    infoSelectTermActive: {
        borderWidth: 0,
    },
    infoSelectTermText: {
        lineHeight: PR * 32,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: PR * 15,
        color: '#FFF',
    },
    infoSelectTermTextActive: {
        color: '#24D29B',
    },
    infoResult: {
        backgroundColor: '#F2F2F2',
        padding: PR * 15,
        borderRadius: PR * 6,
        flexDirection: 'row',
    },
    infoResultItem: {
        flex: 1,
    },
    infoResultItemHack: {
        flex: 1.2
    },
    infoResultItemValue: {
        fontSize: PR * 13,
        fontWeight: 'bold',
        color: '#24D29B',
    },
    infoResultItemName: {
        fontSize: PR * 12,
        color: '#999',
    },
})

export default ProductInfoModel;