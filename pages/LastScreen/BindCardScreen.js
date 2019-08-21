import React, { Component } from 'react';
import { View, Text, ScrollView, DeviceEventEmitter, BackHandler } from 'react-native';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import AlertModel from './../../components/common/AlertModel';
import BindCardModel from './../../components/last/BindCardModel';

class BindCardScreen extends Component {
    constructor(props) {
        super(props);

        this._updateOrderState = this._updateOrderState.bind(this);
        this._onBackAndroid = this._onBackAndroid.bind(this);
        this._confirmAlertAction = this._confirmAlertAction.bind(this);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            hasCardOption: false,
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

        const order_id = navigation.getParam('order_id', '0');
        const platform_id = navigation.getParam('platform_id', '0');

        this._getCardOption(platform_id); // 获取银行列表

        this.setState({
            order_id,
            platform_id,
        })
    }

    _getCardOption(platform_id) {
        AxiosPost('/order/get-bank-list', {
            para: { platform_id }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                let bank_codeOption = [];
                response.map(item => {
                    bank_codeOption.push({ label: item.bank_name, value: item.bank_code.toString() });
                });

                this.setState({
                    hasCardOption: true,
                    bank_codeOption,
                });
            }
        })
    }

    _updateOrderState() {
        DeviceEventEmitter.emit('orderState', 1); // 通知订单详情更新状态
        this.props.navigation.goBack(); // 返回订单详情
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

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} doAction={this._onBackAndroid} />
                <View style={LastStyles.lastModel}>
                    <View style={MainStyles.mainTitle}>
                        <Text style={MainStyles.mainTitleText}>Informasi Bank</Text>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        {
                            this.state.hasCardOption &&
                            <BindCardModel
                                option={{
                                    bank_codeOption: this.state.bank_codeOption,
                                }}
                                orderId={this.state.order_id}
                                doAction={this._updateOrderState}
                            />
                        }
                    </ScrollView>
                </View>
                <AlertModel data={this.state.confirmAlertConfig} type={1} state={this.state.showConfirmAlert} doAction={this._confirmAlertAction} />
            </View>
        );
    }
}

export default BindCardScreen;