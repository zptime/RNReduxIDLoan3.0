import React, { Component } from 'react';
import { View, StatusBar, Alert, Platform, DeviceEventEmitter } from 'react-native';

import SplashScreen from 'react-native-splash-screen'; // 启动图模块
import RNFS from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import DeviceInfo from 'react-native-device-info'; // 设备信息组件
import Toast from 'react-native-root-toast';
import NetInfo from "@react-native-community/netinfo";
import Permissions from 'react-native-permissions';

import { MainStyles } from './assets/css/AppStyles';

import AppJSON from './app';
import { AxiosPost } from './api';
import Router from './router';
import Global from './assets/js/Global';
import StorageUtil from './assets/js/StorageUtil';
import { BundleConfig } from './assets/js/AppConfig'; // 配置模块
import AppInfoUtil from './assets/js/AppInfo'; // App信息获取模块
import LogEventUtil from './assets/js/LogEvent'; // App事件记录模块
import Indonesian from './assets/js/Indonesian';

import NoNetworkModel from './components/common/NoNetworkModel';

import { Provider } from 'react-redux';
import store from './redux/configureStore';
import { setIp, setToken, setIsLogin, setBasicAuth, setAppChannel, setCityData } from './redux/actions'
import TestRouter from './redux/router'

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showMaps: false,
            noNetwork: false,
            device_info: {
                device_id: DeviceInfo.getUniqueID(),
                idfa: '',
                idfv: Platform.OS === 'ios' ? DeviceInfo.getUniqueID() : '',
                device_info: DeviceInfo.getDeviceName(),
                os_type: DeviceInfo.getSystemName(),
                os_version: DeviceInfo.getSystemVersion(),
                gps_longitude: '',
                gps_latitude: '',
                gps_address: '',
                ip: '',
                memory: DeviceInfo.getTotalMemory() ? `${(DeviceInfo.getTotalMemory() / 1000000000).toFixed(2)} GB` : '',
                // storage: DeviceInfo.getTotalDiskCapacity() ? `${(DeviceInfo.getTotalDiskCapacity() / 1000000000).toFixed(2)} GB` : '0' // android值有误,
                storage: '0',
                unuse_storage: DeviceInfo.getFreeDiskStorage() ? `${(DeviceInfo.getFreeDiskStorage() / 1000000000).toFixed(2)} GB` : '0',
                last_login_time: (new Date().getTime() / 1000 >>> 0).toString(),
                wifi: '',
                wifi_name: '',
                bettary: '',
                carrier: DeviceInfo.getCarrier(),
                tele_num: '',
                app_market: AppJSON.displayName,
                is_root: '0',
                dns: '',
                is_simulator: 'false',
                pic_count: '',
                android_id: Platform.OS === 'android' ? DeviceInfo.getUniqueID() : '',
                udid: '',
                uuid: '',
                imsi: '',
                mac: '',
                sdcard: '',
                unuse_sdcard: '',
                imei: ''
            },
            app_list: [],
            call_history: []
        }
    }

    componentWillMount() { // 组件加载前
        this._updateHead(); // 获取fetch需要配置数据
        this._initAreaData(); // 获取城市地区数据
        this._updateBundle(); // 更新jsBundle

        // this._getLocationInfo(); // 获取定位信息

        // 监听facebook登录回调
        this.loginListener = DeviceEventEmitter.addListener('LoginData', (res) => {
            if (res.code === '0') {
                AxiosPost('/auth/login', {
                    para: { code: res.data }
                }).then(res => {
                    Toast.show(res.message, { duration: 4000 });
                    if (res.code === 0) {
                        this._saveLoginData(res.response); // 保存登录信息
                    }
                });
            }
        });

        // 监听app登录回调
        this.appLoginListener = DeviceEventEmitter.addListener('appLoginData', (res) => {
            if (res) {
                this._saveLoginData(res); // 保存登录信息
            }
        });

        // 监听网络状况
        this.networkListener = NetInfo.addEventListener('connectionChange', (connectionInfo) => {
            let noNetwork = false;
            if (connectionInfo.type === 'none' || connectionInfo.type === 'unknown') {
                noNetwork = true;
            }
            this.setState({
                noNetwork
            });
        })

        // 监听实名认证
        this.authBasicListener = DeviceEventEmitter.addListener('sumbitAuthBasic', (state) => {
            if (state === 1) {
                Global.basicAuth = 1;
                store.dispatch(setBasicAuth(1))
            }
        });
    }

    componentDidMount() { // 组件加载
        SplashScreen.hide();
    }

    componentWillUnmount() {
        this.loginListener && this.loginListener.remove(); // 移除监听facebook登录事件
        this.appLoginListener && this.appLoginListener.remove(); // 移除监听app登录事件
        this.networkListener && this.networkListener.remove(); // 移除监听网络连接事件
        this.authBasicListener && this.authBasicListener.remove(); // 移除监听实名认证事件
    }

    async _updateHead() {
        Global.ip = await DeviceInfo.getIPAddress();
        store.dispatch(setIp(Global.ip))

        try {
            Global.token = await StorageUtil.getJsonObject('KEY_LOCAL_TOKEN');
            store.dispatch(setToken(Global.token))
        } catch(e) {
            let { response } = await AxiosPost('/auth/token', {
                para: { uuid: DeviceInfo.getUniqueID(), package: DeviceInfo.getBundleId() }
            });

            if (response) {
                Global.token = response.token;
                store.dispatch(setToken(Global.token))
                StorageUtil.saveJsonObject('KEY_LOCAL_TOKEN', response.token); // 本地存储token
            }
        }

        // 获取渠道信息
        let appChannel = {
            utm_source: 'android_official',
            utm_medium: 'cpi',
            utm_term: '',
            utm_content: 'apk',
            utm_campaign: '',
        }
        const referrer = DeviceInfo.getInstallReferrer();
        if (referrer) {
            let channelObj = {};

            // 将referrer中的字符串数据转为对象
            let channelArray = referrer.split('&');
            channelArray.map(item => {
                let itemArray = item.split('=');
                channelObj[itemArray[0]] = itemArray[1];
            });

            if (channelObj.utm_source &&
                channelObj.utm_source.indexOf('not set') < 0 &&
                channelObj.utm_source.indexOf('not%20set') < 0)
            { // referrer中有合法数据，合并到渠道对象中
                Object.assign(appChannel, channelObj);
            } else { // 否则从本地文件中获取渠道信息
                let channelResult = await AppInfoUtil.getAppChannel();
                if (channelResult) {
                    appChannel = channelResult;
                }
            }
            StorageUtil.saveJsonObject('KEY_LOCAL_CHANNEL', appChannel); // 本地存储渠道信息
        } else {
            try {
                appChannel = await StorageUtil.getJsonObject('KEY_LOCAL_CHANNEL'); // 获取缓存渠道信息
            } catch (e) {
                let channelResult = await AppInfoUtil.getAppChannel();
                if (channelResult) {
                    appChannel = channelResult;
                }
                StorageUtil.saveJsonObject('KEY_LOCAL_CHANNEL', appChannel); // 本地存储渠道信息
            }
        }
        Object.assign(Global, appChannel);
        store.dispatch(setAppChannel(appChannel))

        try {
            await StorageUtil.getJsonObject('KEY_LOCAL_ACTIVATESTATE'); // 获取激活状态
        } catch (e) {
            this._appActivate(appChannel); // 统计激活
        }

        this._appOpen(); // 统计app启动次数
        this._isLogin(); // 保存登录状态
    }

    // 判断登录状态
    async _isLogin() {
        let { response } = await AxiosPost('/user/is-login');
        if (response) {
            Global.isLogin = response.is_login;
            store.dispatch(setIsLogin(response.is_login))
        } else {
            Global.isLogin = 0;
            store.dispatch(setIsLogin(0))
        }

        if (Global.isLogin === 1) {
            this._isBasicAuth();

            // 获取设备信息
            this._getDeviceInfo(1, data => {
                this._addDeviceInfo(data);
            })
        }
    }

    // 获取实名认证信息
    async _isBasicAuth() {
        let { response } = await AxiosPost('/user/info');
        Global.basicAuth = response.basic_auth || 0;
        store.dispatch(setBasicAuth(Global.basicAuth))
    }

    // 获取设备信息
    async _getDeviceInfo(type, callback) {
        // ip
        let ip = await DeviceInfo.getIPAddress();

        // bettary is_simulator
        let bettary = '';
        let is_simulator = '';
        let batteryLevel = await DeviceInfo.getBatteryLevel();
        if (batteryLevel && batteryLevel > 0) {
            bettary = Math.floor(batteryLevel * 100).toString();
            is_simulator = 'false';
        } else {
            is_simulator = 'true';
        }

        // mac
        let mac = await DeviceInfo.getMACAddress();

        // wifi wifi_name
        let wifiType = await NetInfo.getConnectionInfo();
        let wifi = wifiType.type === 'wifi' ? '1' : '0';

        // 更新数据
        this.setState({
            device_info: Object.assign({}, this.state.device_info, {
                ip,
                bettary,
                is_simulator,
                mac,
                wifi,
            })
        })

        let count = 1;
        let locationTimer = setInterval(() => {
            if (count > 15 || this.state.device_info.gps_address) { // 获取定位或者超时15秒则发送信息
                clearInterval(locationTimer)
                callback({
                    info: this.state.device_info,
                    type
                })
            } else {
                count++
            }
        }, 1000)
    }

    _addDeviceInfo(para) {
        AxiosPost('/auth/add-device-info', { para })
    }

    _saveLoginData(response) {
        Global.isLogin = 1;
        Global.token = response.token;
        store.dispatch(setIsLogin(1))
        store.dispatch(setToken(response.token))
        StorageUtil.saveJsonObject('KEY_LOCAL_TOKEN', response.token); // 本地存储token
        DeviceEventEmitter.emit('loginState', 1);

        this._isBasicAuth(); // 获取基本认证信息

        // 获取设备信息
        this._getDeviceInfo(1, data => {
            this._addDeviceInfo(data);
        })

        LogEventUtil.logEvent('login', response.user_phone); // 记录登录事件

        this._appOpen();// 统计app启动
    }

    // 城市地区数据初始化
    _initAreaData() {
        Global.cityData = Indonesian;
        store.dispatch(setCityData(Indonesian))
    }

    _getLocationInfo() {
        Permissions.request('location', { type: 'always' }).then(response => {
            if (response !== 'authorized') {
                Alert.alert(
                    'Terapkan',
                    `Izinkan akses Informasi Lokasi di Pengaturan -->Aplikasi--> ${AppJSON.displayName} untuk menggunakan Informasi Lokasi`,
                    [
                        {
                            text: 'Batal',
                            style: 'cancel'
                        },
                    ]
                )
            } else {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        let { coords } = position;
                        this.setState({
                            device_info: Object.assign({}, this.state.device_info, {
                                gps_longitude: coords.longitude.toString(),
                                gps_latitude: coords.latitude.toString(),
                            })
                        })
                    },
                    error => console.log(error.message),
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
                );
            }
        })
    }

    // 更新jsBundle
    _updateBundle() {
        fetch(BundleConfig.updateOrigin).then((response) => response.json()).then((json) => {
            let updateState = this._checkBundleVersion(json.bundleVersion, BundleConfig.bundleVersion);
            if (updateState) {
                let downloadDir = RNFS.DocumentDirectoryPath
                if (Platform.OS === 'android') {
                    downloadDir = RNFS.ExternalCachesDirectoryPath
                }
                let downloadFile = downloadDir + '/jsBundle.zip'
                const options = {
                    fromUrl: json.updateUrl,
                    toFile: downloadFile,
                    background: true,
                    begin: (res) => {
                        // console.log('begin', res);
                        // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                    },
                    progress: (res) => {}
                };
                try {
                    const ret = RNFS.downloadFile(options);
                    ret.promise.then(res => {
                        this._unzipBundle(downloadDir, downloadFile) // 解压缩
                    }).catch(err => {
                        console.log('err', err);
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        }).catch((error) => console.log('Mendeteksi kegagalan pembaruan:' + error));
    }

    _unzipBundle(downloadDir, downloadFile) {
        unzip(downloadFile, downloadDir).then((path) => {
            // 解压成功，将zip删除
            RNFS.unlink(downloadFile);
        }).catch((error) => {
            console.log(error)
        })
    }

    // 检测jsBundle版本大小
    _checkBundleVersion(jsonVersion, bundleVersion) {
        let state = false;
        let jsonVersionArray = jsonVersion.split('.');
        let bundleVersionArray = bundleVersion.split('.');
        if (jsonVersionArray.length === 3 && bundleVersionArray.length === 3) {
            if  (jsonVersionArray[0] > bundleVersionArray[0] ||
                (jsonVersionArray[0] === bundleVersionArray[0] && jsonVersionArray[1] > bundleVersionArray[1]) ||
                (jsonVersionArray[0] === bundleVersionArray[0] && jsonVersionArray[1] === bundleVersionArray[1] && jsonVersionArray[2] > bundleVersionArray[2])
            ) {
                state = true
            }
        }

        return state
    }

    _appOpen() {
        AxiosPost('/app/open').catch(err => console.log(err))
    }

    _appActivate(para) {
        AxiosPost('/app/activate', { para }).catch(err => console.log(err));

        StorageUtil.saveJsonObject('KEY_LOCAL_ACTIVATESTATE', 1); // 本地存储激活状态
    }

    render() {
        return (
            <Provider store={store}>
                <View style={MainStyles.mainModel}>
                    {/* <StatusBar animated={true} backgroundColor={'transparent'} barStyle={'dark-content'} translucent={true} /> */}
                    <StatusBar animated={true} backgroundColor={'#aaa'} barStyle={'dark-content'} />
                    {/* <Router /> */}
                    <TestRouter />
                    {
                        this.state.noNetwork &&
                        <NoNetworkModel />
                    }
                </View>
            </Provider>
        );
    }
}