import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Slider from '@react-native-community/slider';

import { AxiosPost } from './../../api';

import { PR } from './../../assets/css/AppStyles';
import { FormatNumber } from './../../assets/js/AppConfig';

class ApiInfoModel extends Component {
    constructor(props) {
        super(props);

        this.checkData = this.props.checkData;
        this.doAction = this.props.doAction;

        this.termsList = [];
        if (Array.isArray(this.checkData.terms)) {
            this.checkData.terms.map(item => {
                if (this.checkData.term_type === 1) {
                    this.termsList.push(item);
                }

                if (this.checkData.term_type === 2) {
                    this.termsList.push(item * 30);
                }

                if (this.checkData.term_type === 3) {
                    this.termsList.push(item * 360);
                }
            });
        }

        this.state = {
            platform_id: this.props.platformId,
            loan_amount: this.checkData.amount,
            loan_term: Array.isArray(this.checkData.terms) && this.checkData.terms[0],
            term_type: this.checkData.term_type,
        };
    }

    componentDidMount() {
        this._loanCalculate(); // 试算
    }

    componentWillUnmount() {}

    _loanCalculate() {
        AxiosPost('/order/loan-calculate', {
            para: this.state
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 贷款期限 年月转为日
                let loanTerm = 0;
                if (this.state.term_type === 1) {
                    loanTerm = this.state.loan_term;
                }

                if (this.state.term_type === 2) {
                    loanTerm = this.state.loan_term * 30;
                }

                if (this.state.term_type === 3) {
                    loanTerm = this.state.loan_term * 360;
                }

                // 还款日期
                let repayDate = new Date().getTime() + loanTerm * 86400000;

                // 到账金额
                let receiveAmount = 0;
                if (typeof response.receive_amount === 'number') {
                    receiveAmount = FormatNumber(response.receive_amount / 100)
                } else {
                    receiveAmount = `${FormatNumber(response.receive_amount.min / 100)}~${'\n'}${FormatNumber(response.receive_amount.max / 100)}`
                }

                // 应还总额
                let repayAmount = 0;
                if (typeof response.repay_amount === 'number') {
                    repayAmount = FormatNumber(response.repay_amount / 100)
                } else {
                    repayAmount = `${FormatNumber(response.repay_amount.min / 100)}~${'\n'}${FormatNumber(response.repay_amount.max / 100)}`
                }

                // 利息
                let interestFee = 0;
                if (typeof response.interest_fee === 'number') {
                    interestFee = FormatNumber(response.interest_fee / 100)
                } else {
                    interestFee = `${FormatNumber(response.interest_fee.min / 100)}~${FormatNumber(response.interest_fee.max / 100)}`
                }

                // 服务费
                let serviceFee = 0;
                if (typeof response.service_fee === 'number') {
                    serviceFee = FormatNumber(response.service_fee / 100)
                } else {
                    serviceFee = `${FormatNumber(response.service_fee.min / 100)}~${FormatNumber(response.service_fee.max / 100)}`
                }

                // 总费用
                let allFee = 0;
                if (typeof response.interest_fee === 'number' && typeof response.service_fee === 'number') {
                    allFee = FormatNumber((response.interest_fee + response.service_fee) / 100)
                } else if (typeof response.interest_fee !== 'number' && typeof response.service_fee === 'number') {
                    allFee = `${FormatNumber((response.interest_fee.min + response.service_fee) / 100)}~${'\n'}${FormatNumber((response.interest_fee.max + response.service_fee) / 100)}`
                } else if (typeof response.interest_fee === 'number' && typeof response.service_fee !== 'number') {
                    allFee = `${FormatNumber((response.interest_fee + response.service_fee.min) / 100)}~${'\n'}${FormatNumber((response.interest_fee + response.service_fee.max) / 100)}`
                } else if (typeof response.interest_fee !== 'number' && typeof response.service_fee !== 'number') {
                    allFee = `${FormatNumber((response.interest_fee.min + response.service_fee.min) / 100)}~${'\n'}${FormatNumber((response.interest_fee.max + response.service_fee.max) / 100)}`
                }

                let state = {
                    loanTerm,
                    repayDate,
                    receiveAmount,
                    repayAmount,
                    interestFee,
                    serviceFee,
                    allFee,
                }

                this.setState(state);

                this.doAction(Object.assign({}, state, {
                    platform_id: this.state.platform_id,
                    loan_amount: this.state.loan_amount,
                    loan_term: this.state.loan_term,
                    term_type: this.state.term_type,
                    waiting: false,
                }));
            }
        })
    }

    _updateData(amount, term, index) {
        if (amount) {
            this.setState({
                loan_amount: amount
            })
        }

        if (term) {
            this.setState({
                loanTerm: term,
                loan_term: this.checkData.terms[index]
            })
        }

        this.doAction({
            waiting: true
        });

        setTimeout(() => {
            this._loanCalculate();
        }, 500);
    }

    render() {
        return (
            <View style={styles.infoModel}>
                <View style={styles.infoSelect}>
                    <View style={styles.infoSelectItem}>
                        <View style={styles.infoSelectItemTitle}>
                            <Text style={styles.infoSelectItemName}>Jumlah <Text style={styles.infoSelectQuota}>Rp {FormatNumber(this.state.loan_amount / 100)}</Text></Text>
                        </View>
                        <Slider
                            style={styles.infoSelectSlider}
                            step={10000}
                            minimumValue={(this.checkData.min_amount || this.checkData.amount) / 100}
                            maximumValue={this.checkData.amount / 100}
                            value={this.state.loan_amount / 100}
                            minimumTrackTintColor='#24D29B'
                            maximumTrackTintColor='#E2E2E2'
                            thumbTintColor='#24D29B'
                            onValueChange={loan_amount => this.setState({ loan_amount: loan_amount * 100 })}
                            onSlidingComplete={loan_amount => this._updateData(loan_amount * 100, undefined, undefined)}
                        />
                        <View style={styles.infoSelectItemValue}>
                            <Text style={styles.infoSelectDefaultQuota}>{FormatNumber((this.checkData.min_amount || this.checkData.amount) / 100)}</Text>
                            <Text style={[styles.infoSelectDefaultQuota, styles.infoSelectDefaultQuotaRight]}>{FormatNumber(this.checkData.amount / 100)}</Text>
                        </View>
                    </View>
                    <View style={styles.infoSelectItem}>
                        <View style={styles.infoSelectItemTitle}>
                            <Text style={styles.infoSelectItemName}>Waktu</Text>
                        </View>
                        <View style={styles.infoSelectItemValue}>
                            {
                                this.termsList.map((item, index) => {
                                    return (
                                        <Text style={[styles.infoSelectTerm, this.state.loanTerm === item && styles.infoSelectTermActive]} key={index} onPress={() => this._updateData(undefined, item, index)}>{item} Hari</Text>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                <View style={styles.infoResult}>
                    <View style={styles.infoResultItem}>
                        <Text style={styles.infoResultItemValue}>Rp {this.state.repayAmount}</Text>
                        <Text style={styles.infoResultItemName}>Pembayaran</Text>
                    </View>
                    <View style={styles.infoResultItem}>
                        <Text style={styles.infoResultItemValue}>Rp {this.state.receiveAmount}</Text>
                        <Text style={styles.infoResultItemName}>Pinjaman</Text>
                    </View>
                    <View style={[styles.infoResultItem, styles.infoResultItemHack]}>
                        <Text style={styles.infoResultItemValue}>Rp {this.state.allFee}</Text>
                        <Text style={styles.infoResultItemName}>Bunga+Manajemen</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    infoModel: {
        borderTopWidth: PR * 10,
        borderTopColor: '#F2F2F2',
        marginHorizontal: PR * 20,
        marginVertical: PR * 10,
        paddingBottom: PR * 15,
    },
    infoSelect: {
        paddingTop: PR * 15,
        paddingBottom: PR * 10,
    },
    infoSelectItem: {
        marginBottom: PR * 20,
    },
    infoSelectItemTitle: {
        flexDirection: 'row',
    },
    infoSelectItemName: {
        flex: 1,
        color: '#333',
        fontSize: PR * 18,
        fontWeight: 'bold',
    },
    infoSelectQuota: {
        color: '#24D29B',
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
        color: '#ADD5C7',
    },
    infoSelectDefaultQuotaRight: {
        textAlign: 'right',
    },
    infoSelectTerm: {
        borderWidth: PR * 0.5,
        borderColor: '#24D29B',
        borderRadius: PR * 6,
        width: PR * 72,
        height: PR * 32,
        marginRight: PR * 10,
        marginTop: PR * 10,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: PR * 15,
        color: '#24D29B',
    },
    infoSelectTermActive: {
        borderWidth: 0,
        backgroundColor: '#24D29B',
        color: '#FFF',
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

export default ApiInfoModel;