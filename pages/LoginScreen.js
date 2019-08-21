import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TextInput, DeviceEventEmitter } from 'react-native';

import Toast from 'react-native-root-toast';

import { MainStyles, LoginStyles } from './../assets/css/AppStyles';

import { AxiosPost } from './../api';

import HeaderModel from './../components/common/HeaderModel'

class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            phone: '',
            phoneState: false,
            code: '',
            codeState: false,
        }
    }

    componentWillMount() { }

    componentWillUnmount() { }

    _getState(value, type) {
        let result = false;
        let reg = /^\d+$/;
        if (reg.test(value)) {
            if (type === 'phone') {
                if (value.indexOf('08') === 0 && value.length >= 10 && value.length <= 13) {
                    result = true;
                }

                if (value.indexOf('8') === 0 && value.length >= 9 && value.length <= 12) {
                    result = true;
                }
            }

            if (type === 'code' && value.length === 6) {
                result = true;
            }
        }

        return result
    }

    _codeAction() {
        if (!this.state.phoneState) {
            return false;
        }

        let para = {
            phone: `62${this.state.phone}`
        };

        AxiosPost('/user/code', { para }).then(res => {
            Toast.show(res.message, { duration: 4000 });
        })
    }

    _submitAction() {
        if (!this.state.phoneState || !this.state.codeState) {
            return false;
        }

        let para = {
            account_kit: 0,
            phone: `62${this.state.phone}`,
            code: this.state.code,
        };

        AxiosPost('/auth/login', { para }).then(res => {
            let { code, message, response } = res;
            Toast.show(message, { duration: 4000 });

            if (code === 0) {
                DeviceEventEmitter.emit('appLoginData', response); // 通知登录状态

                this.props.navigation.goBack(); // 返回上一页
            }
        })
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>Masuk</Text>
                </View>
                <ScrollView
                    style={LoginStyles.loginWrap}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View style={LoginStyles.loginItem}>
                        <Text style={LoginStyles.loginItemText}>Masukkan No.Hp</Text>
                        <View style={LoginStyles.loginItemValue}>
                            <Text style={LoginStyles.loginItemColor}>+62</Text>
                            <TextInput
                                style={LoginStyles.loginItemInput}
                                contextMenuHidden={true}
                                maxLength={20}
                                keyboardType='numeric'
                                value={this.state.phone}
                                onChangeText={phone => {
                                    let phoneState = this._getState(phone, 'phone');
                                    this.setState({ phone, phoneState })
                                }}
                            />
                            <TouchableOpacity style={[LoginStyles.codeBtn, this.state.phoneState && LoginStyles.codeBtnActive]} onPress={() => this._codeAction()}>
                                <Text style={LoginStyles.codeBtnText}>Kirim kode</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={LoginStyles.loginItem}>
                        <Text style={LoginStyles.loginItemText}>Masukkan kode verifikasi</Text>
                        <View style={LoginStyles.loginItemValue}>
                            <TextInput
                                style={LoginStyles.loginItemInput}
                                contextMenuHidden={true}
                                maxLength={6}
                                keyboardType='numeric'
                                value={this.state.code}
                                onChangeText={code => {
                                    let codeState = this._getState(code, 'code');
                                    this.setState({ code, codeState })
                                }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={[LoginStyles.submitBtn, this.state.phoneState && this.state.codeState && LoginStyles.submitBtnActive]} onPress={() => this._submitAction()}>
                        <Text style={LoginStyles.submitBtnText}>Masuk</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

export default LoginScreen;