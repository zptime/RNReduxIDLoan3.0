import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';
import AppInfoUtil from './../../assets/js/AppInfo'; // App信息获取模块

import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import AppListModel from './../../components/last/AppListModel';
import NothingModel from './../../components/common/NothingModel';

class DownloadScreen extends Component {
    constructor(props) {
        super(props);

        this._onRefresh = this._onRefresh.bind(this);
        this._listAction = this._listAction.bind(this);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            refreshing: false,
            list: []
        }
    }

    componentWillMount() {
        this._getInstalledPackages(); // 获取本地App
    }

    componentWillUnmount() {}

    // 获取手机已安装App
    _getInstalledPackages() {
        AppInfoUtil.getInstalledPackages().then(appList => {
            this._getData(appList); // 获取全部产品
        });
    }

    // 获取全部产品
    _getData(appList) {
        AxiosPost('/platform/all-online').then(res => {
            let { code, response } = res;
            if (code === 0) {
                let list = []
                response.map(val1 => {
                    appList.map(val2 => {
                        if (val1.app_market_id === val2) {
                            list.push(val1)
                        }
                    })
                })

                this.setState({
                    refreshing: false,
                    list,
                })
            }
        }).catch(error => {
            this.setState({
                refreshing: false,
            })
        })
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this._getInstalledPackages();
    }

    _listAction(item) {
        AppInfoUtil.checkAppInstalled(item.app_market_id).then(state => {
            if (!state) {
                AppInfoUtil.jumpToGooglePlay(`https://play.google.com/store/apps/details?id=${item.app_market_id}`);
            } else {
                AppInfoUtil.openApp(item.app_market_id)
            }
        });
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>UNDUHAN SAYA</Text>
                </View>
                {
                    this.state.list.length === 0 &&
                    <NothingModel />
                }
                {
                    this.state.list.length > 0 &&
                    <FlatList
                        style={LastStyles.listWrap}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                        data={this.state.list}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <AppListModel item={item} doAction={this._listAction} />}
                    />
                }
            </View>
        );
    }
}

export default DownloadScreen;