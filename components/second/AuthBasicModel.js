import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, DeviceEventEmitter, StyleSheet } from 'react-native';

import Toast from 'react-native-root-toast';

import AuthAlertModel from './AuthAlertModel';

import { PR } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';

class AuthBasicModel extends Component {
    constructor(props) {
        super(props);

        this.navigation = this.props.navigation;
        this.userInfo = this.props.userInfo;

        this._confirmAction = this._confirmAction.bind(this);

        this.state = {
            name: '',
            idcard: '',
            showConfirm: false,
        };
    }

    componentDidMount() {
        this._getUserInfo(); // 获取用户信息
    }

    componentWillUnmount() {}

    _getUserInfo() {
        AxiosPost('/user/info').then(res => {
            let { code, response } = res;
            if (code === 0) {
                this.setState({
                    user_phone: response.user_phone
                });
            }
        })
    }

    _checkIdcard(idcard) {
        let reg = /^((1[1-9])|(21)|([37][1-6])|(5[1-4])|(6[1-5])|([8-9][1-2]))[0-9]{2}[0-9]{2}(([0-6][0-9])|(7[0-1]))((0[1-9])|(1[0-2]))([0-9]{2})[0-9]{4}$/g;
        return reg.test(idcard);
    }

    _doSubmit() {
        if (!this.state.name) {
            Toast.show('Silahkan masukkan nama lengkap Anda', { duration: 4000 });
            return false;
        }

        if (!this._checkIdcard(this.state.idcard)) {
            Toast.show('Silahkan masukkan nomor ID Anda', { duration: 4000 });
            return false;
        }

        this.setState({
            showConfirm: true
        });
    }

    _confirmAction(state) {
        this.setState({
            showConfirm: false
        });

        if (state) {
            AxiosPost('/auth/basic', {
                para: this.state
            }).then(res => {
                let { code, message } = res;

                Toast.show(message, { duration: 4000 });
                if (code === 0) {
                    DeviceEventEmitter.emit('sumbitAuthBasic', 1);
                    this.props.navigation.goBack(); // 返回上一页
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.authModel}>
                <View style={styles.authHint}>
                    <Image style={styles.authHintIcon} source={require('./../../assets/img/icon_hint.png')} />
                    <Text style={styles.authHintText}>Pastikan Data yang dimasukkan sesuai, jika tidak akan mengganggu proses pengajuan</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Nomor Ponsel</Text>
                    <Text style={styles.authItemValue}>{this.state.user_phone}</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Nama Sesuai KTP</Text>
                    <TextInput style={styles.authItemValue} contextMenuHidden={true} maxLength={30} onChangeText={name => this.setState({ name })} value={this.state.name} placeholder='Silahkan masukkan' />
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Nomor KTP</Text>
                    <TextInput style={styles.authItemValue} contextMenuHidden={true} keyboardType='numeric' maxLength={16} onChangeText={idcard => this.setState({ idcard })} value={this.state.idcard} placeholder='Silahkan masukkan' />
                </View>
                <Text style={styles.authHintText2}>Pastikan nomor dan nama sesuai dengan KTP</Text>
                <TouchableOpacity activeOpacity={1} style={styles.submitAction} onPress={() => this._doSubmit()}>
                    <Text style={styles.submitText}>KIRIM</Text>
                </TouchableOpacity>
                <AuthAlertModel data={this.state} state={this.state.showConfirm} doAction={this._confirmAction} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    authModel: {
        marginHorizontal: PR * 20,
    },
    authHint: {
        marginTop: PR * 10,
        marginBottom: PR * 20,
        paddingVertical: PR * 15,
        paddingLeft: PR * 40,
        paddingRight: PR * 15,
        borderRadius: PR * 6,
        backgroundColor: '#FFF8E0',
    },
    authHintText: {
        fontSize: PR * 12,
        color: '#FCCF33',
        lineHeight: PR * 15,
    },
    authHintText2: {
        fontSize: PR * 12,
        color: '#ADD5C7',
        lineHeight: PR * 15,
        marginBottom: PR * 20,
    },
    authHintIcon: {
        position: 'absolute',
        top: PR * 15,
        left: PR * 15,
        width: PR * 16,
        height: PR * 16,
    },
    authItem: {
        marginBottom: PR * 15,
    },
    authItemText: {
        color: '#ADD5C7',
        fontSize: PR * 15,
        fontWeight: 'bold',
    },
    authItemDot: {
        width: PR * 6,
        height: PR * 6,
    },
    authItemValue: {
        height: PR * 48,
        textAlignVertical: 'center',
        borderBottomWidth: PR * 1,
        borderBottomColor: '#F2F2F2',
        fontSize: PR * 15,
        color: '#333',
        paddingHorizontal: PR * 10,
    },
    submitAction: {
        backgroundColor: '#24D29B',
        borderRadius: PR * 48,
    },
    submitText: {
        color: '#fff',
        fontSize: PR * 17,
        textAlign: 'center',
        lineHeight: PR * 48,
    },
})

export default AuthBasicModel;