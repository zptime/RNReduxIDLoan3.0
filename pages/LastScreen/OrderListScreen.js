import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import NothingModel from './../../components/common/NothingModel';
import OrderItemModel from './../../components/last/OrderItemModel';

class OrderListScreen extends Component {
    constructor(props) {
        super(props);

        this._listAction = this._listAction.bind(this);

        this.orderTabConfig = [
            { text: 'Semua', status: [0] },
            { text: 'Sedang Direview', status: [2, 3] },
            { text: 'Proses Transfer', status: [6, 7] },
            { text: 'Proses Pelunasan', status: [8] },
        ];

        this.statusConfig = [
            { status: 0, text: 'Menunggu No.Rekening' },
            // { status: 1, text: '' },
            { status: 2, text: 'Menunggu Review' },
            { status: 3, text: 'Review Ditolak' },
            // { status: 4, text: '' },
            // { status: 5, text: '' },
            { status: 6, text: 'Proses Transfer' },
            { status: 7, text: 'Peminjaman gagal' },
            { status: 8, text: 'Proses Pelunasan' },
            { status: 9, text: 'Sudah Lunas' },
        ];

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            refreshing: false,
            isCanLoadMore: false,
            activeIndex: 0,
            index: 1,
            list: []
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数
    }

    componentWillUnmount() {}

    _getRouterParam() {
        const { navigation } = this.props;
        const status = navigation.getParam('status', [0]);

        this.setState({
            activeIndex: status
        })

        this._getData(status, 1)
    }

    _getData(status, index) {
        this.setState({ refreshing: true });

        // 显示所有订单
        if (status[0] === 0) {
            status = null;
        }

        AxiosPost('/order/list', {
            para: { status, index, limit: 10 }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                let list = [];
                if (index !== 1) {
                    list = list.concat(this.state.list);
                }

                if (response.length > 0) {
                    list.push(...response); // 扩展运算符合并数组

                    this.setState({
                        refreshing: false,
                        list,
                        index,
                    })
                } else {
                    this.setState({
                        refreshing: false,
                        list,
                    })
                }
            }
        }).catch(error => {
            this.setState({
                refreshing: false,
            })
        })
    }

    _orderTabAction(status, index) {
        this.setState({
            activeIndex: status,
            index: 1,
        });

        this.scrollView.scrollTo({ x: this.state[`orderTab${index}`].x - this.state[`orderTab${index}`].width / 2, y: 0, animated: true });
    }

    _listAction(item) {
        this.props.navigation.navigate('OrderDetail', { id: item.id });
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>PINJAMAN SAYA</Text>
                </View>
                <View style={LastStyles.orderTabWrap}>
                    <ScrollView
                        ref={view => this.scrollView = view}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            this.orderTabConfig.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        key={index}
                                        style={[LastStyles.orderTabItem, this.state.activeIndex[0] === item.status[0] && LastStyles.orderTabItemActive]}
                                        onLayout={({ nativeEvent }) => {
                                            this.setState({ [`orderTab${index}`]: nativeEvent.layout });
                                            setTimeout(() => {
                                                if (this.state.activeIndex[0] === item.status[0]) {
                                                    this._orderTabAction(item.status, index);
                                                }
                                            }, 10);
                                        }}
                                        onPress={() => {
                                            this._orderTabAction(item.status, index);
                                            this._getData(item.status, 1);
                                        }}
                                    >
                                        <Text style={[LastStyles.orderTabText, this.state.activeIndex[0] === item.status[0] && LastStyles.orderTabTextHack]}>{item.text}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']} style={LastStyles.orderTabMask} />
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
                                onRefresh={() => this._getData(this.state.activeIndex, 1)}
                            />
                        }
                        data={this.state.list}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <OrderItemModel item={item} statusConfig={this.statusConfig} doAction={this._listAction} />}
                        onEndReached={() => {
                            if (this.state.isCanLoadMore) {
                                this._getData(this.state.activeIndex, this.state.index + 10);
                                this.setState({ isCanLoadMore: false });
                            }
                        }}
                        onContentSizeChange={() => {
                            this.setState({ isCanLoadMore: true });
                        }}
                        onEndReachedThreshold={0.01}
                    />
                }
            </View>
        );
    }
}

export default OrderListScreen;