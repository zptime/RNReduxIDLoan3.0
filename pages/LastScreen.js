import React, { Component } from 'react';
import { View, Text, DeviceEventEmitter } from 'react-native';

import { MainStyles } from './../assets/css/AppStyles';
import AppInfoUtil from './../assets/js/AppInfo'; // App信息获取模块
import Global from './../assets/js/Global';

import { AxiosPost } from './../api';

import HeaderModel from './../components/common/HeaderModel';
import UserInfoModel from './../components/last/UserInfoModel';
import OrderCategoryModel from './../components/last/OrderCategoryModel';
import OptionModel from './../components/last/OptionModel';

class LastScreen extends Component {
    constructor(props) {
        super(props);

        this._userInfoAction = this._userInfoAction.bind(this);
        this._orderCategoryAction = this._orderCategoryAction.bind(this);
        this._optionAction = this._optionAction.bind(this);

        this.orderCategoryConfig = [
            { text: 'Sedang Direview', icon: require('./../assets/img/icon_order1.png'), status: [2, 3] },
            { text: 'Proses Transfer', icon: require('./../assets/img/icon_order2.png'), status: [6, 7] },
            { text: 'Proses Pelunasan', icon: require('./../assets/img/icon_order3.png'), status: [8] },
        ]

        this.optionConfig = [
            { text: 'Komentar saya', icon: require('./../assets/img/icon_comment.png'), route: 'CommentList' },
            { text: 'Unduhan saya', icon: require('./../assets/img/icon_download.png'), route: 'Download' },
            { text: 'Umpan balik saya', icon: require('./../assets/img/icon_feedback.png'), route: 'FeedbackList' },
            { text: 'Pengaturan', icon: require('./../assets/img/icon_set.png'), route: 'Set' },
        ]

        this.state = {
            userInfoData: {},
        }
    }

    componentDidMount() {
        if (Global.isLogin === 1) {
            this._getData(); // 获取用户数据
        }

        // 监听登录状态
        this.isLoginListener = DeviceEventEmitter.addListener('loginState', (state) => {
            if (state === 1) {
                this._getData(); // 获取用户数据
            } else {
                this.setState({
                    userInfoData: {},
                })
            }
        });
    }

    componentWillUnmount() {
        this.isLoginListener && this.isLoginListener.remove();
    }

    async _getLoginMethod() {
        let { response } = await AxiosPost('/app/config');
        let sms = response ? response.sms : 0;

        if (sms === 2) {
            this.props.navigation.navigate('Login');
        } else {
            AppInfoUtil.showLoginDialog(); // 显示facebook登录页
        }
    }

    _getData() {
        AxiosPost('/user/info').then(res => {
            let { code, response } = res;
            if (code === 0) {
                Global.basicAuth = response.basic_auth || 0;

                this.setState({
                    userInfoData: response,
                })
            }
        })
    }

    _userInfoAction() {
        const { navigate } = this.props.navigation;
        if (Global.isLogin !== 1) {
            this._getLoginMethod(); // 获取登录类型
        } else {
            navigate('UserInfo', this.state.userInfoData);
        }
    }

    _orderCategoryAction(status) {
        const { navigate } = this.props.navigation;

        if (Global.isLogin !== 1) {
            this._getLoginMethod(); // 获取登录类型
        } else {
            navigate('OrderList', { status });
        }
    }

    _optionAction(item) {
        const { navigate } = this.props.navigation;

        if (item && (item.route === 'CommentList' || item.route === 'FeedbackList') && Global.isLogin !== 1) {
            this._getLoginMethod(); // 获取登录类型
        } else {
            navigate(item.route);
        }
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>SAYA</Text>
                </View>
                <UserInfoModel data={this.state.userInfoData} doAction={this._userInfoAction} />
                <OrderCategoryModel data={this.orderCategoryConfig} doAction={this._orderCategoryAction}  />
                <OptionModel data={this.optionConfig} doAction={this._optionAction} />
            </View>
        );
    }
}

export default LastScreen;