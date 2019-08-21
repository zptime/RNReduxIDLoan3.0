import React, { Component } from 'react';
import { RefreshControl, FlatList, View, Text } from 'react-native';

import { MainStyles, SecondStyles } from './../assets/css/AppStyles';

import { AxiosPost } from './../api';
import Global from './../assets/js/Global';
import AppInfoUtil from './../assets/js/AppInfo'; // App信息获取模块

import HeaderModel from './../components/common/HeaderModel';
import FilterModel from './../components/second/FilterModel';
import SelectModel from './../components/second/SelectModel';
import ProductItemModel from './../components/second/ProductItemModel';

class SecondScreen extends Component {
    constructor(props) {
        super(props);

        this._onRefresh = this._onRefresh.bind(this);
        this._listAction = this._listAction.bind(this);
        this._filterItem = this._filterItem.bind(this);
        this._selectItem = this._selectItem.bind(this);

        // 筛选标题
        this.filterConfig = ['Nominal pinjaman', 'Jangka waktu', 'Urutkan'];

        // 额度项
        this.quotaConfig = [
            {
                name: 'Default',
                amount_min: '0',
                amount_max: '0'
            },
            {
                name: 'Rp 200.000 - 1.000.000',
                amount_min: '200000',
                amount_max: '1000000'
            }, {
                name: 'Rp 1.000.000 - 2.000.000',
                amount_min: '1000000',
                amount_max: '2000000'
            }, {
                name: 'Rp 2.000.000 - 5.000.000',
                amount_min: '2000000',
                amount_max: '5000000'
            }, {
                name: 'Diatas Rp 5.000.000',
                amount_min: '5000000',
                amount_max: '0'
            }
        ];

        // 期限项
        this.termConfig = [
            {
                name: 'Default',
                day_min: '0',
                day_max: '0'
            },
            {
                name: 'Dalam 10 Hari',
                day_min: '0',
                day_max: '10'
            }, {
                name: '11-20 Hari',
                day_min: '11',
                day_max: '20'
            }, {
                name: '21-30 Hari',
                day_min: '21',
                day_max: '30'
            }, {
                name: 'Diatas 30 Hari',
                day_min: '30',
                day_max: '0'
            }
        ];

        // 期限项
        this.sortConfig = [
            { name: 'Default' },
            { name: 'Bunga', sort_type: '1', sort_value: '2' },
            { name: 'Tingkat lulus', sort_type: '2', sort_value: '1'  },
            { name: 'Komentar', sort_type: '3', sort_value: '1'  }
        ];

        this.state = {
            refreshing: true,
            para: {},
            list: [],
            filterIndex: [0, 0, 0],
            selectConfig: {
                state: false,
                title: '',
                index: null,
                filterIndex: null,
                list: []
            },
            quotaIndex: 0,
            termIndex: 0,
            sortIndex: 0,
            exposureList: [],
        }
    }

    componentDidMount() {
        this._getData(this.state.para); // 获取列表数据
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

    _getData(para) {
        AxiosPost('/platform/all-online', { para }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 获取曝光产品id列表
                let exposureList = [];
                response.map(item => {
                    exposureList.push(item.id.toString());
                })

                this.setState({
                    refreshing: false,
                    list: response,
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
        this._getData(this.state.para); // 获取列表数据
    }

    _filterItem(index) {
        let selectConfig = {
            state: true,
            title: this.filterConfig[index],
            filterIndex: index,
        }

        if (index === 0) { // 选择额度
            selectConfig.list = this.quotaConfig;
            selectConfig.index = this.state.quotaIndex;
        }

        if (index === 1) { // 选择期限
            selectConfig.list = this.termConfig;
            selectConfig.index = this.state.termIndex;
        }

        if (index === 2) { // 选择排序
            selectConfig.list = this.sortConfig;
            selectConfig.index = this.state.sortIndex;
        }

        this.setState({
            selectConfig
        })
    }

    _selectItem(item, index) {
        let state = {
            filterIndex: this.state.filterIndex,
            selectConfig: {
                state: false,
                title: '',
                index: null,
                filterIndex: null,
                list: []
            }
        };

        if (item.filterIndex === 0 && index >= 0) { // 选择额度
            state.quotaIndex = index;
        }

        if (item.filterIndex === 1 && index >= 0) { // 选择期限
            state.termIndex = index;
        }

        if (item.filterIndex === 2 && index >= 0) { // 选择排序
            state.sortIndex = index;
        }

        if (index === 0) {
            state.filterIndex[item.filterIndex] = 0;
        } else if (index > 0) {
            state.filterIndex[item.filterIndex] = 1;
        }

        this.setState(state);

        setTimeout(() => {
            index >= 0 && this._sendAction(); // 获取数据
        }, 100);
    }

    _sendAction() { // 处理请求参数获取数据
        let para = {};
        this.quotaConfig.map((value, valueIndex) => { // 额度
            if (valueIndex === this.state.quotaIndex) {
                para.amount_min = value.amount_min;
                para.amount_max = value.amount_max;
            }
        })

        this.termConfig.map((value, valueIndex) => { // 期限
            if (valueIndex === this.state.termIndex) {
                para.day_min = value.day_min;
                para.day_max = value.day_max;
            }
        })

        this.sortConfig.map((value, valueIndex) => { // 排序
            if (valueIndex === this.state.sortIndex) {
                para.sort_type = value.sort_type;
                para.sort_value = value.sort_value;
            }
        })

        this.setState({ para });

        this._getData(para); // 获取列表数据
    }

    _listAction(item) {
        const { navigate } = this.props.navigation;

        // 跳转默认产品详情
        if (item.jump_type === 0 || item.jump_type === 1) {
            navigate('DefultDetail', { id: item.id, campaign_url: item.campaign_url });
        }

        // 跳转Api产品详情
        if (item.jump_type === 2) {
            if (Global.isLogin !== 1) {
                this._getLoginMethod(); // 获取登录类型
            } else {
                if (Global.basicAuth === 1) {
                    navigate('ApiDetail', { id: item.id });
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
                <HeaderModel />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>PINJAMAN</Text>
                </View>
                <FilterModel data={this.filterConfig} active={this.state.filterIndex} doAction={this._filterItem} />
                <FlatList
                    style={SecondStyles.listWrap}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    data={this.state.list}
                    keyExtractor={item => item.id.toString()}
                    ListFooterComponent={() => <View style={SecondStyles.listHack}></View>}
                    renderItem={({item}) => <ProductItemModel item={item} doAction={this._listAction} />}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                />
                <SelectModel data={this.state.selectConfig} doAction={this._selectItem} />
            </View>
        );
    }
}

export default SecondScreen;