import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import DeviceInfo from 'react-native-device-info'; // 设备信息组件
import Toast from 'react-native-root-toast';

import AppJSON from './../../app';
import { AxiosPost } from './../../api';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';
import AppInfoUtil from './../../assets/js/AppInfo'; // App信息获取模块
import Global from './../../assets/js/Global';

import HeaderModel from './../../components/common/HeaderModel';
import AlertModel from './../../components/common/AlertModel';
import OptionModel from './../../components/last/OptionModel';

class SetScreen extends Component {
    constructor(props) {
        super(props);

        this._optionAction = this._optionAction.bind(this);
        this._upgradeAction = this._upgradeAction.bind(this);

        this.optionConfig = [
            { text: 'Hubungi kami', icon: require('./../../assets/img/icon_contactus.png'), route: 'Contactus' },
            // { text: 'Terms and Conditions', icon: require(''), route: '' },
            { text: 'Privacy policy', icon: require('./../../assets/img/icon_private.png'), route: 'Privacy' },
            { text: 'Cek update', icon: require('./../../assets/img/icon_version.png'), route: '' },
        ]

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            version: DeviceInfo.getVersion(),
            upgradeConfig: {
                confirm: 'Update sekarang',
                cancel: 'Update nanti'
            },
            upgradeType: 0,
            showUpgrade: false,
        }
    }

    componentWillMount() {}

    componentWillUnmount() {}

    _optionAction(index, item) {
        const { navigate } = this.props.navigation;

        if (item.text === 'Cek update') {
            AxiosPost('/app/config').then(res => {
                let { code, response } = res;
                if (code === 0) {
                    let showUpgrade = false;
                    if (response.upgrade === 0) {
                        Toast.show('Sudah versi terbaru', { duration: 4000 });
                    } else {
                        showUpgrade = true;
                    }

                    this.setState({
                        upgradeType: response.upgrade,
                        upgradeConfig: Object.assign({}, this.state.upgradeConfig, { title: `Peringatan Versi Terbaru ${response.version.new}` }),
                        showUpgrade,
                    })
                }
            })

            return false;
        }

        navigate(item.route);
    }

    _upgradeAction(state) {
        this.setState({
            showUpgrade: false
        });

        if (state) {
            let referrer = encodeURIComponent(`utm_source=${Global.utm_source || ''}&utm_medium=${Global.utm_medium || ''}&utm_term=${Global.utm_term || ''}&utm_content=${Global.utm_content || ''}&utm_campaign=${Global.utm_campaign || ''}`);

            AppInfoUtil.jumpToGooglePlay(`https://play.google.com/store/apps/details?id=${DeviceInfo.getBundleId()}&referrer=${referrer}`);
        }
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>PENGATURAN</Text>
                </View>
                <View style={LastStyles.setContent}>
                    <Image style={LastStyles.setContentIcon} source={require('./../../assets/img/logo.png')} />
                    <Text style={LastStyles.setContentName}>{AppJSON.displayName} {this.state.version}</Text>
                </View>
                <OptionModel data={this.optionConfig} doAction={this._optionAction}  />
                <AlertModel data={this.state.upgradeConfig} type={this.state.upgradeType} state={this.state.showUpgrade} doAction={this._upgradeAction} />
            </View>
        );
    }
}

export default SetScreen;