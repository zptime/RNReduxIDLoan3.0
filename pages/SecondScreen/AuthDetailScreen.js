import React, { Component } from 'react';
import { View, Text, Alert, ScrollView, DeviceEventEmitter, BackHandler } from 'react-native';

import Permissions from 'react-native-permissions';

import { MainStyles } from './../../assets/css/AppStyles';

import AppJSON from './../../app';
import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import AlertModel from './../../components/common/AlertModel';
import AuthStepModel from './../../components/second/AuthStepModel';
import AuthBasicModel from './../../components/second/AuthBasicModel';
import AuthPersonalModel from './../../components/second/AuthPersonalModel';
import AuthJobModel from './../../components/second/AuthJobModel';
import AuthContactModel from './../../components/second/AuthContactModel';

class AuthDetailScreen extends Component {
    constructor(props) {
        super(props);

        this._updateAuth = this._updateAuth.bind(this);
        this._onBackAndroid = this._onBackAndroid.bind(this);
        this._confirmAlertAction = this._confirmAlertAction.bind(this);

        this.defaultAuthConfig = [
            { text: `Informasi${'\n'}Pribadi`, auth_type: 2 },
            { text: `Informasi${'\n'}Pekerjaan`, auth_type: 3 },
            { text: `Kontak${'\n'}Darurat`, auth_type: 4 },
            { text: `Informasi${'\n'}Bank`, auth_type: 5 },
        ];

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            authTitle: '',
            authType: null,
            platformId: null,
            authConfig: null,
            authTypeActive: null,
            hasOption: false,
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
        this._getAuthOption(); // 获取认证选项信息

        this.isBackListener = BackHandler.addEventListener('hardwareBackPress', this._onBackAndroid); // 监听物理返回键
    }

    componentWillUnmount() {
        this.isBackListener && this.isBackListener.remove(); //取消监听物理返回键
    }

    _getRouterParam() {
        const { navigation } = this.props;
        const authType = navigation.getParam('authType', null);
        const platformId = navigation.getParam('platformId', null);

        this.setState({ authType, platformId, authTitle: authType === 1 ? 'Konfirmasi informasi KTP' : 'Sertifikasi' });

        if (authType !== 1) {
            this._getAuthStepData(platformId); // 获取认证步骤数据
        }

        if (authType === 2 || authType === 3) {
            this._getStoragePermissions(); // 获取存储权限
        }
    }

    _getAuthStepData(platformId) {
        AxiosPost('/platform/auth', {
            para: { id: platformId }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 初始化认证信息
                let authConfig = [];
                let authTypeActive = 0;
                this.defaultAuthConfig.map(item1 => {
                    response.auth_progress.map(item2 => {
                        if (item2.auth_type === item1.auth_type) {
                            authConfig.push(Object.assign({}, item2, item1));
                            if (item2.is_auth === 0 && authTypeActive === 0) {
                                authTypeActive = item2.auth_type;
                            }
                        }
                    })
                })

                this.setState({
                    authConfig,
                    authTypeActive,
                })
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

    _getAuthOption() {
        AxiosPost('/auth/option').then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 性别
                let sexOption = [];
                Object.keys(response.sex).forEach(key => {
                    sexOption.push({ label: response.sex[key], value: key });
                });

                // 教育
                let educationOption = [];
                Object.keys(response.education).forEach(key => {
                    educationOption.push({ label: response.education[key], value: key });
                });

                // 婚姻状况
                let marriageOption = [];
                Object.keys(response.marriage).forEach(key => {
                    marriageOption.push({ label: response.marriage[key], value: key });
                });

                // 子女数
                let children_numberOption = [];
                Object.keys(response.children_number).forEach(key => {
                    children_numberOption.push({ label: response.children_number[key], value: key });
                });

                // 雇佣关系
                let employmentOption = [];
                Object.keys(response.employment).forEach(key => {
                    employmentOption.push({ label: response.employment[key], value: key });
                });

                // 月收入
                let salaryOption = [];
                Object.keys(response.salary).forEach(key => {
                    salaryOption.push({ label: response.salary[key], value: key });
                });

                // 直系亲属关系
                let direct_relationOption = [];
                Object.keys(response.direct_relation).forEach(key => {
                    direct_relationOption.push({ label: response.direct_relation[key], value: key });
                });

                // 其他联系人关系
                let other_relationOption = [];
                Object.keys(response.other_relation).forEach(key => {
                    other_relationOption.push({ label: response.other_relation[key], value: key });
                });

                this.setState({
                    hasOption: true,
                    sexOption,
                    educationOption,
                    marriageOption,
                    children_numberOption,
                    employmentOption,
                    salaryOption,
                    direct_relationOption,
                    other_relationOption,
                });
            }
        })
    }

    _updateAuth(authType) {
        this._getAuthStepData(this.state.platformId); // 更新认证步骤数据
        DeviceEventEmitter.emit('authState', 1); // 通知api产品详情更新数据

        // 显示下一个认证
        let authTypeActive = authType;
        for (const item of this.state.authConfig) {
            if (item.auth_type > authTypeActive) {
                authTypeActive = item.auth_type;
                break;
            }
        }

        if (authType !== this.state.authConfig[this.state.authConfig.length - 1].auth_type) {
            this.setState({ authType: authTypeActive });
        } else {
            this.props.navigation.goBack(); // 返回产品详情
        }
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
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>{this.state.authTitle}</Text>
                </View>
                {
                    this.state.authType !== 1 &&
                    this.state.authConfig &&
                    this.state.authConfig.length > 1 &&
                    <AuthStepModel data={this.state.authConfig} authTypeActive={this.state.authTypeActive} />
                }
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    {
                        this.state.authType === 1 &&
                        <AuthBasicModel
                            navigation={this.props.navigation}
                        />
                    }
                    {
                        this.state.authType === 2 &&
                        this.state.hasOption &&
                        <AuthPersonalModel
                            authType={this.state.authType}
                            option={{
                                sexOption: this.state.sexOption,
                                educationOption: this.state.educationOption,
                                marriageOption: this.state.marriageOption,
                                children_numberOption: this.state.children_numberOption
                            }}
                            platformId={this.state.platformId}
                            doAction={this._updateAuth}
                        />
                    }
                    {
                        this.state.authType === 3 &&
                        this.state.hasOption &&
                        <AuthJobModel
                            authType={this.state.authType}
                            option={{
                                employmentOption: this.state.employmentOption,
                                salaryOption: this.state.salaryOption,
                            }}
                            platformId={this.state.platformId}
                            doAction={this._updateAuth}
                        />
                    }
                    {
                        this.state.authType === 4 &&
                        this.state.hasOption &&
                        <AuthContactModel
                            authType={this.state.authType}
                            option={{
                                direct_relationOption: this.state.direct_relationOption,
                                other_relationOption: this.state.other_relationOption,
                            }}
                            platformId={this.state.platformId}
                            doAction={this._updateAuth}
                        />
                    }
                </ScrollView>
                <AlertModel data={this.state.confirmAlertConfig} type={1} state={this.state.showConfirmAlert} doAction={this._confirmAlertAction} />
            </View>
        );
    }
}

export default AuthDetailScreen;