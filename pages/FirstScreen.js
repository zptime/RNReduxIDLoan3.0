import React, { Component } from 'react';
import { View, RefreshControl, Text, FlatList, Linking } from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import DeviceInfo from 'react-native-device-info'; // 设备信息组件

import { MainStyles, FirstStyles } from './../assets/css/AppStyles';

import { AxiosPost } from './../api';
import Global from './../assets/js/Global';
import StorageUtil from './../assets/js/StorageUtil';
import AppInfoUtil from './../assets/js/AppInfo'; // App信息获取模块
import { FormatNumber } from './../assets/js/AppConfig';

import HeaderModel from './../components/common/HeaderModel';
import AlertModel from './../components/common/AlertModel';
import BannerModel from './../components/common/BannerModel';
import CategoryModel from './../components/first/CategoryModel';
import ScrollModel from './../components/first/ScrollModel';
import RecommendModel from './../components/first/RecommendModel';
import ProductItemModel from './../components/second/ProductItemModel';

class FirstScreen extends Component {
    constructor(props) {
        super(props);

        this._onRefresh = this._onRefresh.bind(this);
        this._clickAction = this._clickAction.bind(this);
        this._listAction = this._listAction.bind(this);
        this._upgradeAction = this._upgradeAction.bind(this);

        this.state = {
            refreshing: true,
            bannerData: null,
            categoryData: null,
            scrollData: null,
            recommendData: null,
            productData: null,
            hotCategoryId: 0,
            upgradeConfig: {
                confirm: 'Update sekarang',
                cancel: 'Update nanti'
            },
            upgradeVersion: '0.0.0',
            upgradeType: 0,
            showUpgrade: false,
            noNetwork: false,
            exposureList: [],
        }
    }

    componentDidMount() {
        this._retryGetToken(); // 获取首页数据

        // 监听网络状况
        this.networkFirstListener = NetInfo.addEventListener('connectionChange', (connectionInfo) => {
            let noNetwork = false;
            if (connectionInfo.type === 'none' || connectionInfo.type === 'unknown') {
                noNetwork = true;
            }

            if (!noNetwork && this.state.noNetwork) {
                this._getData(); // 获取首页数据
                this._getUpgrade(); // 获取App版本信息
                this._isLogin(); // 保存登录状态
            }

            this.setState({
                noNetwork
            });
        })
    }

    componentWillUnmount() {
        this.networkFirstListener && this.networkFirstListener.remove(); // 移除监听网络连接事件
    }

    // 判断登录状态
    async _isLogin() {
        let { response } = await AxiosPost('/user/is-login');
        if (response) {
            Global.isLogin = response.is_login;
        } else {
            Global.isLogin = 0;
        }

        if (Global.isLogin === 1) {
            this._getBasicAuth();
        }
    }

    // 获取实名认证信息
    async _getBasicAuth() {
        let { response } = await AxiosPost('/user/info');
        if (response) {
            Global.basicAuth = response.basic_auth;
        } else {
            Global.basicAuth = 0;
        }
    }

    async _getUpgrade() {
        let { response } = await AxiosPost('/app/config');

        if (!response) {
            return false;
        }

        let upgrade = {
            upgradeType: response.upgrade,
            upgradeConfig: Object.assign({}, this.state.upgradeConfig, { title: `Peringatan Versi Terbaru ${response.version.new}` }),
            upgradeVersion: response.version.new,
            showUpgrade: true,
        }

        if (response.upgrade === 2) {
            this.setState(upgrade)
        }

        if (response.upgrade === 1) {
            try {
                let skipVersion = await StorageUtil.getJsonObject('KEY_LOCAL_SKIPVERSION');

                if (skipVersion) {
                    if (skipVersion !== response.version.new) {
                        this.setState(upgrade)
                    }
                }
            } catch (e) {
                this.setState(upgrade)
            }
        }
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

    _retryGetToken() {
        let count = 1;
        let timer = setInterval(() => {
            let token = Global.token;
            count++;
            if (token || count > 10) {
                clearInterval(timer);
                timer = null;
                this._getData(); // 获取首页数据
                this._getUpgrade(); // 获取App版本信息
            }
        }, 500)
    }

    _getData() {
        AxiosPost('/platform/online-data').then(res => {
            let {code, response} = res;
            if (code === 0) {
                let bannerData = response.top_banner;
                let categoryData = response.ad_list;

                let scrollData = [];
                response.top_apply.map((item) => {
                    scrollData.push(Object.assign(item, {
                        loan_amount: FormatNumber(item.loan_amount / 100)
                    }))
                });

                let recommendData = response.platform_head_banner[0];
                if (recommendData && recommendData.platform_info) {
                    this._recommendExposure(recommendData); // 曝光推荐产品
                }

                // 获取曝光产品id列表
                let exposureList = [];
                let productData = response.hot_platforms;
                productData.map(item => {
                    exposureList.push(item.id.toString());
                })

                let hotCategoryId = response.hot_category_id;

                this.setState({
                    refreshing: false,
                    bannerData,
                    categoryData,
                    scrollData,
                    recommendData,
                    productData,
                    hotCategoryId,
                    exposureList,
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
        this._getData(); // 获取首页数据
        this._getUpgrade(); // 获取App版本信息
    }

    _clickAction(item) {
        const { navigate } = this.props.navigation;

        // 跳转外链
        if (item.jump_type === 1) {
            Linking.openURL(item.jump_url);
        }

        // 跳转分类
        if (item.jump_type === 2) {
            navigate('Category', { id: item.category });
        }

        // 跳转产品详情
        if (item.jump_type === 3) {
            this._listAction(item.platform_info);
        }
    }

    _listAction(item) {
        const { navigate } = this.props.navigation;

        // 跳转默认产品详情
        if (item.jump_type === 0 || item.jump_type === 1) {
            navigate('DefultDetail', { id: item.id, category_id: this.state.hotCategoryId, campaign_url: item.campaign_url });
        }

        // 跳转Api产品详情
        if (item.jump_type === 2) {
            if (Global.isLogin !== 1) {
                this._getLoginMethod(); // 获取登录类型
            } else {
                if (Global.basicAuth === 1) {
                    navigate('ApiDetail', { id: item.id, category_id: this.state.hotCategoryId });
                } else { // 实名认证
                    navigate('AuthDetail', { authType: 1 });
                }
            }
        }
    }

    _upgradeAction(state) {
        if (this.state.upgradeType !== 2) {
            this.setState({
                showUpgrade: false
            });
        }

        if (state) {
            let referrer = encodeURIComponent(`utm_source=${Global.utm_source || ''}&utm_medium=${Global.utm_medium || ''}&utm_term=${Global.utm_term || ''}&utm_content=${Global.utm_content || ''}&utm_campaign=${Global.utm_campaign || ''}`);

            AppInfoUtil.jumpToGooglePlay(`https://play.google.com/store/apps/details?id=${DeviceInfo.getBundleId()}&referrer=${referrer}`);
        } else {
            StorageUtil.saveJsonObject('KEY_LOCAL_SKIPVERSION', this.state.upgradeVersion); // 本地存储token
        }
    }

    _recommendExposure(data) {
        this._platformExposure({
            platform_id: data.platform_info.id,
            category_id: data.category,
            campaign_url: data.platform_info.campaign_url,
        });
    }

    _onViewableItemsChanged = ({ changed }) => {
        changed.map(value => {
            if (value.isViewable && this.state.exposureList.includes(value.key)) {
                let exposureList = [];
                this.state.exposureList.map(item => {
                    if (item !== value.key) {
                        exposureList.push(item);
                    }
                })
                this.setState({ exposureList });

                this._platformExposure({
                    platform_id: value.item.id,
                    category_id: 0,
                    campaign_url: value.item.campaign_url,
                });
            }
        })
    }

    _platformExposure(para) {
        AxiosPost('/platform/exposure', { para })
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    data={this.state.productData}
                    extraData={this.state}
                    keyExtractor={item => item.id.toString()}
                    ListHeaderComponent={() => <View>
                        {
                            this.state.bannerData &&
                            <View style={MainStyles.mainTitle}>
                                <Text style={MainStyles.mainTitleText}>BERANDA</Text>
                            </View>
                        }
                        {
                            this.state.bannerData &&
                            <BannerModel data={this.state.bannerData} doAction={this._clickAction} />
                        }
                        {
                            this.state.categoryData &&
                            <CategoryModel data={this.state.categoryData} doAction={this._clickAction} />
                        }
                        {
                            this.state.scrollData &&
                            <ScrollModel data={this.state.scrollData} />
                        }
                        {
                            this.state.recommendData &&
                            this.state.recommendData.platform_info &&
                            <RecommendModel data={this.state.recommendData} doAction={this._listAction} />
                        }
                        {
                            this.state.productData &&
                            <View style={MainStyles.mainTitle}>
                                <Text style={MainStyles.mainTitleText}>UANG TUNAI</Text>
                            </View>
                        }
                    </View>}
                    ListFooterComponent={() => <View style={FirstStyles.listHack}></View>}
                    renderItem={({ item }) => <View style={FirstStyles.listWrap}><ProductItemModel item={item} doAction={this._listAction} /></View>}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                />
                <AlertModel data={this.state.upgradeConfig} type={this.state.upgradeType} state={this.state.showUpgrade} doAction={this._upgradeAction} />
            </View>
        );
    }
}

export default FirstScreen;