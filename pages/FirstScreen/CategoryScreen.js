import React, { Component } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';

import { MainStyles, FirstStyles } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';
import Global from './../../assets/js/Global';
import AppInfoUtil from './../../assets/js/AppInfo'; // App信息获取模块

import HeaderModel from './../../components/common/HeaderModel';
import NothingModel from './../../components/common/NothingModel';
import ProductItemModel from './../../components/second/ProductItemModel';

class CategoryScreen extends Component {
    constructor(props) {
        super(props);

        this._onRefresh = this._onRefresh.bind(this);
        this._listAction = this._listAction.bind(this);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            refreshing: true,
            id: 0,
            title: '',
            list: [],
            exposureList: [],
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数
    }

    componentWillUnmount() {}

    async _getLoginMethod() {
        let { response } = await AxiosPost('/app/config');
        let sms = response ? response.sms : 0;

        if (sms === 2) {
            this.props.navigation.navigate('Login');
        } else {
            AppInfoUtil.showLoginDialog(); // 显示facebook登录页
        }
    }

    _getRouterParam() {
        const { navigation } = this.props;
        const id = navigation.getParam('id', '0');

        this.setState({ id });

        this._getData(id); // 获取数据
    }

    _getData(id) {
        AxiosPost('/platform/category-detail', {
            para: { category_id: id }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 获取曝光产品id列表
                let exposureList = [];
                if (Array.isArray(response.platform_list)) {
                    response.platform_list.map(item => {
                        exposureList.push(item.id.toString());
                    })
                }

                this.setState({
                    refreshing: false,
                    title: response.category_info.name,
                    list: response.platform_list,
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
        this._getData(this.state.id); // 获取首页数据
    }

    _listAction(item) {
        const { navigate } = this.props.navigation;

        // 跳转默认产品详情
        if (item.jump_type === 0 || item.jump_type === 1) {
            navigate('DefultDetail', { id: item.id, category_id: this.state.id, campaign_url: item.campaign_url });
        }

        // 跳转Api产品详情
        if (item.jump_type === 2) {
            if (Global.isLogin !== 1) {
                this._getLoginMethod(); // 获取登录类型
            } else {
                if (Global.basicAuth === 1) {
                    navigate('ApiDetail', { id: item.id, category_id: this.state.id });
                } else { // 实名认证
                    navigate('AuthDetail', { authType: 1 });
                }
            }
        }
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
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>{this.state.title}</Text>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    data={this.state.list}
                    style={FirstStyles.listWrap}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={() => <View style={FirstStyles.nothingWrap}>
                        <NothingModel />
                    </View>}
                    ListFooterComponent={() => <View style={FirstStyles.listHack}></View>}
                    renderItem={({ item }) => <ProductItemModel item={item} doAction={this._listAction} />}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                />
            </View>
        );
    }
}

export default CategoryScreen;