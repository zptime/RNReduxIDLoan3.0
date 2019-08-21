import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, DeviceEventEmitter, Alert } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import Toast from 'react-native-root-toast';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';

import Global from './../../assets/js/Global';
import StorageUtil from './../../assets/js/StorageUtil';
import { AxiosPost } from './../../api';
import AppJSON from './../../app';

import HeaderModel from './../../components/common/HeaderModel';
import AlertModel from './../../components/common/AlertModel';
import LoadingModel from './../../components/common/LoadingModel';

class UserInfoScreen extends Component {
    constructor(props) {
        super(props);

        this._alertAction = this._alertAction.bind(this);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            userInfoConfig: {},
            showAlert: false,
            alertConfig: {
                title: 'Yakin untuk keluar?',
                confirm: 'Keluar',
                cancel: 'Batal'
            },
            alertType: 1,
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数
        this._getStoragePermissions(); // 获取存储权限
    }

    componentWillUnmount() {}

    _getRouterParam() {
        const { navigation } = this.props;

        this.setState({
            userInfoConfig: {
                user_phone: navigation.getParam('user_phone', ''),
                avatar: navigation.getParam('avatar', '')
            }
        })
    }

    _getStoragePermissions() {
        Permissions.request('storage').then(response => {
            if (response !== 'authorized') {
                Alert.alert(
                    'Terapkan',
                    `Izinkan akses kamera di Pengaturan --> Aplikasi --> ${AppJSON.displayName} untuk menggunakan penyimpanan`,
                    [
                        {
                            text: 'Batal',
                            style: 'cancel'
                        },
                    ]
                )
            }
        })
    }

    _changeAvatarAction() {
        Permissions.request('camera').then(response => {
            if (response !== 'authorized') {
                Alert.alert(
                    'Terapkan',
                    `Izinkan akses kamera di Pengaturan --> Aplikasi --> ${AppJSON.displayName} untuk menggunakan kamera`,
                    [
                        {
                            text: 'Batal',
                            style: 'cancel'
                        },
                    ]
                )
            } else {
                LoadingModel.show(); // 显示loading
                ImagePicker.openPicker({
                    includeBase64: true,
                    compressImageQuality: 0.5,
                    mediaType: 'photo',
                    compressImageMaxWidth: 750,
                }).then(images => {
                    LoadingModel.hide(); // 隐藏loading

                    let avatar = `data:${images.mime};base64,${images.data}`;
                    AxiosPost('/user/save-avatar', {
                        para: { avatar }
                    }).then(res => {
                        let { code, message } = res;
                        Toast.show(message, { duration: 4000 });
                        if (code === 0) {
                            this.setState({
                                userInfoConfig: Object.assign({}, this.state.userInfoConfig, { avatar })
                            });
                            DeviceEventEmitter.emit('loginState', 1);
                        }
                    })
                }).catch(err => {
                    LoadingModel.hide(); // 隐藏loading
                    // console.log(err);
                });
            }
        })
    }

    _alertAction(state) {
        this.setState({
            showAlert: false
        });

        if (state) {
            AxiosPost('/auth/logout').then(res => {
                let { code, message, response } = res;
                Toast.show(message, { duration: 4000 });
                if (code === 0) {
                    Global.isLogin = 0;
                    Global.basicAuth = 0;
                    Global.token = response.token;
                    StorageUtil.saveJsonObject('KEY_LOCAL_TOKEN', response.token); // 本地存储token
                    DeviceEventEmitter.emit('loginState', 0);

                    this.props.navigation.goBack(); // 返回上一页
                }
            })
        }
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={LastStyles.lastModel}>
                    <View style={MainStyles.mainTitle}>
                        <Text style={MainStyles.mainTitleText}>Saya</Text>
                    </View>
                    <TouchableOpacity style={[LastStyles.userInfoItem, LastStyles.userInfoItemHack]} onPress={() => this._changeAvatarAction()}>
                        <Text style={LastStyles.userInfoText}>Avatar</Text>
                        <View style={LastStyles.userInfoValue}>
                            <Image style={LastStyles.userInfoIcon} source={this.state.userInfoConfig.avatar ? { uri: this.state.userInfoConfig.avatar.indexOf('data:image/jpeg;base64,') === 0 ? this.state.userInfoConfig.avatar :`https://${this.state.userInfoConfig.avatar}` } : require('./../../assets/img/user_default.png')} />
                            <Image style={LastStyles.userInfoArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                        </View>
                    </TouchableOpacity>
                    <View style={LastStyles.userInfoItem}>
                        <Text style={LastStyles.userInfoText}>Nomor telepon</Text>
                        <View style={LastStyles.userInfoValue}>
                            <Text style={LastStyles.userInfoPhone}>{this.state.userInfoConfig.user_phone}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={LastStyles.logoutBtn} onPress={() => this.setState({ showAlert: true })}>
                        <Text style={LastStyles.logoutText}>KELUAR MASUK</Text>
                    </TouchableOpacity>
                </View>
                <AlertModel data={this.state.alertConfig} type={this.state.alertType} state={this.state.showAlert} doAction={this._alertAction} />
            </View>
        );
    }
}

export default UserInfoScreen;