import React, { Component } from 'react';
import { View } from 'react-native';

import { WebView } from 'react-native-webview';

import { MainStyles } from './../assets/css/AppStyles';

import HeaderModel from './../components/common/HeaderModel';

class WebViewScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            param: {},
            showView: false,
            isRepayPage: false,
        }
    }

    componentDidMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数
    }

    componentWillUnmount() {}

    _getRouterParam() {
        const { navigation } = this.props;
        const param = navigation.getParam('param', {});

        let isRepayPage = false;
        if (param.uri.indexOf('/activities/repay') > 0) {
            isRepayPage = true;
        }

        this.setState({ param, showView: true, isRepayPage });
    }

    render() {
        const WebViewComponent = this.state.isRepayPage ?
            <WebView
                ref={r => (this.webref = r)}
                source={{ uri: `${this.state.param.uri}?pay_code=${this.state.param.pay_code}&pay_amount=${this.state.param.pay_amount}&user_name=${this.state.param.user_name}&user_phone=${this.state.param.user_phone}&pay_type=${this.state.param.pay_type}` }}
            />
            :
            <WebView
                ref={r => (this.webref = r)}
                source={{ uri: this.state.param.uri }}
                onLoad={() => {
                    this.webref.injectJavaScript(`window.ReactNativeParam=${JSON.stringify(this.state.param)}`);
                }}
            />
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                {
                    this.state.showView &&
                    WebViewComponent
                }
            </View>
        );
    }
}

export default WebViewScreen;