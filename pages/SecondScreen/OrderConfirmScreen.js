import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, DeviceEventEmitter, BackHandler } from 'react-native';

import Toast from 'react-native-root-toast';

import { AxiosPost } from './../../api';
import { MainStyles, LastStyles } from './../../assets/css/AppStyles';
import { FormatNumber, FormatDate } from './../../assets/js/AppConfig';
import LogEventUtil from './../../assets/js/LogEvent'; // App事件记录模块

import HeaderModel from './../../components/common/HeaderModel';
import AlertModel from './../../components/common/AlertModel';

class OrderConfirmScreen extends Component {
    constructor(props) {
        super(props);

        this._onBackAndroid = this._onBackAndroid.bind(this);
        this._confirmAlertAction = this._confirmAlertAction.bind(this);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            confirmState: true,
            showConfirmAlert: false,
            confirmAlertConfig: {
                text: 'Apakah ini merupakan langkah terakhir dari kesuksesan pinjaman, mengonfirmasi pembatalan pinjaman?',
                confirm: 'Batalkan',
                cancel: 'Keluar'
            },
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数

        this.isBackListener = BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid); // 监听物理返回键
    }

    componentWillUnmount() {
        this.isBackListener && this.isBackListener.remove(); //取消监听物理返回键
    }

    _getRouterParam() {
        const { navigation } = this.props;
        const state = navigation.getParam('state', {});

        this.setState(state);
    }

    _onBackAndroid() {
        this.setState({
            showConfirmAlert: true,
        })

        return true;
    }

    _confirmAlertAction(state) {
        this.setState({
            showConfirmAlert: false,
        })

        if (!state) {
            this.props.navigation.goBack();
        }
    }

    _doSubmit() {
        if (!this.state.confirmState) {
            Toast.show('Silahkan baca dengan teliti dan menyetujui Surat Perjanjian Pinjaman berikut ini', { duration: 4000 });
            return false;
        }

        AxiosPost('/order/apply', {
            para: this.state
        }).then(res => {
            let { code, message, response } = res;
            Toast.show(message, { duration: 4000 });
            if (code === 0) {
                DeviceEventEmitter.emit('authState', 1); // 通知api产品详情更新数据
                this._platformClick(this.state.platform_id, 2, this.state.categoryId);
                this._goOrderDetail(response.order_id);
            }
        })
    }

    _goOrderDetail(id) {
        const { replace } = this.props.navigation;

        replace('OrderDetail', { id });
    }

    _platformClick(id, clickType, categoryId) {
        let eventName = 'list-product';
        if (clickType === 2) {
            eventName = 'productDetail';
        }
        LogEventUtil.logEvent(eventName, `${id}`); // 记录产品点击事件

        AxiosPost('/platform/click', {
            para: { platform_id: id, click_type: clickType, category_id: categoryId }
        })
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} doAction={this._onBackAndroid} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={MainStyles.mainTitle}>
                        <Text style={MainStyles.mainTitleText}>Mengkonfirmasi pinjaman</Text>
                    </View>
                    <View style={LastStyles.orderConfirmWrap}>
                        <View style={LastStyles.orderConfirmModel}>
                            <View style={LastStyles.orderConfirmItem}>
                                <Text style={LastStyles.orderConfirmItemName}>Jumlah Pinjaman</Text>
                                <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {FormatNumber(this.state.loan_amount / 100)}</Text>
                            </View>
                            <View style={LastStyles.orderConfirmItem}>
                                <Text style={LastStyles.orderConfirmItemName}>Tenggat Pinjaman</Text>
                                <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>{this.state.loanTerm} Hari</Text>
                            </View>
                            <View style={LastStyles.orderConfirmItem}>
                                <Text style={LastStyles.orderConfirmItemName}>Bunga</Text>
                                <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {this.state.interestFee}</Text>
                            </View>
                            <View style={LastStyles.orderConfirmItem}>
                                <Text style={LastStyles.orderConfirmItemName}>Biaya Layanan</Text>
                                <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {this.state.serviceFee}</Text>
                            </View>
                        </View>
                        <View style={LastStyles.orderConfirmModel}>
                            <View style={LastStyles.orderConfirmItem}>
                                <Text style={LastStyles.orderConfirmItemName}>Jumlah Penerimaan</Text>
                                <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {this.state.receiveAmount}</Text>
                            </View>
                        </View>
                        <View style={LastStyles.orderConfirmModel}>
                            <View style={LastStyles.orderConfirmItem}>
                                <Text style={LastStyles.orderConfirmItemName}>Pengembalian Total</Text>
                                <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {this.state.repayAmount}</Text>
                            </View>
                            <View style={LastStyles.orderConfirmItem}>
                                <Text style={LastStyles.orderConfirmItemName}>Jangka Waktu Pinjaman</Text>
                                <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>{FormatDate(new Date(this.state.repayDate), 'yyyy/MM/dd')}</Text>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={1} style={LastStyles.orderConfirmHint} onPress={() => this.setState({ confirmState: !this.state.confirmState })}>
                            {
                                this.state.confirmState &&
                                <Image style={LastStyles.orderConfirmHintIcon} source={require('./../../assets/img/icon_selected.png')} />
                            }
                            {
                                !this.state.confirmState &&
                                <Image style={LastStyles.orderConfirmHintIcon} source={require('./../../assets/img/icon_select.png')} />
                            }
                            <Text style={LastStyles.orderConfirmHintText}>Nama yang tertea pada rekening harus sama dengan nama peninjam</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} style={LastStyles.submitAction} onPress={() => this._doSubmit()}>
                            <Text style={LastStyles.submitText}>KIRIM</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <AlertModel data={this.state.confirmAlertConfig} type={1} state={this.state.showConfirmAlert} doAction={this._confirmAlertAction} />
            </View>
        );
    }
}

export default OrderConfirmScreen;