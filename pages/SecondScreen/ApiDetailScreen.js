import React, { Component } from 'react';
import { ScrollView, View, Text, FlatList, DeviceEventEmitter, TouchableOpacity, Image, RefreshControl } from 'react-native';

import Toast from 'react-native-root-toast';

import { MainStyles, SecondStyles } from './../../assets/css/AppStyles';
import LogEventUtil from './../../assets/js/LogEvent'; // App事件记录模块

import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import NothingModel from './../../components/common/NothingModel';
import ApiInfoModel from './../../components/second/ApiInfoModel';
import ScoreModel from './../../components/second/ScoreModel';
import ApiAuthModel from './../../components/second/ApiAuthModel';
import ProductItemModel from './../../components/second/ProductItemModel';

class ApiDetailScreen extends Component {
    constructor(props) {
        super(props);

        this._onRefresh = this._onRefresh.bind(this);
        this._goAuth = this._goAuth.bind(this);
        this._updateLoanData = this._updateLoanData.bind(this);
        this._listAction = this._listAction.bind(this);

        this.defaultAuthConfig = [
            { text: 'Informasi Pribadi', icon: require('./../../assets/img/icon_auth1.png'), auth_type: 2 },
            { text: 'Informasi Pekerjaan', icon: require('./../../assets/img/icon_auth2.png'), auth_type: 3 },
            { text: 'Kontak Darurat', icon: require('./../../assets/img/icon_auth3.png'), auth_type: 4 },
            { text: 'Informasi Bank', icon: require('./../../assets/img/icon_auth4.png'), auth_type: 5 },
        ];

        this.moreInfo = [
            { text: 'Details', route: 'ProductDetail' },
            { text: 'Komentar', route: 'ProductComment' },
            { text: 'FAQ', route: 'FAQ' },
        ];

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            refreshing: true,
            id: 0,
            checkData: null,
            detailData: null,
            authConfig: [],
            authTypeActive: null,
            showRecommend: null,
            recommendData: [],
            waiting: true,
            exposureList: [],
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数

        // 监听认证状态
        this.isAuthListener = DeviceEventEmitter.addListener('authState', (state) => {
            if (state === 1) {
                this._getData(this.state.id); // 重新获取数据
            }
        });

        this.sumbitCommentListener = DeviceEventEmitter.addListener('sumbitComment', (state) => {
            if (state === 1) {
                this._getData(this.state.id); // 获取评论列表数据
            }
        });
    }

    componentWillUnmount() {
        this.isAuthListener && this.isAuthListener.remove();
        this.sumbitCommentListener && this.sumbitCommentListener.remove();
        this.setState = () => { return }; // 重置setState方法，防止内存泄漏
    }

    _getRouterParam() {
        const { navigation } = this.props;
        const id = navigation.getParam('id', '0');
        const categoryId = navigation.getParam('category_id', '0');

        this.setState({ id, categoryId });
        this._platformClick(id, 1, categoryId); // 记录产品访问次数

        this._hasOrderId(id); // 判断该产品是否已经存在订单
    }

    _platformClick(id, clickType, categoryId) {
        let eventName = 'list-product';
        if (clickType === 2) {
            eventName = 'productDetail';
        }
        LogEventUtil.logEvent(eventName, `${id}`); // 记录产品点击事件

        AxiosPost('/platform/click', {
            para: { platform_id: id, click_type: clickType, category_id: categoryId }
        })
    }

    async _hasOrderId(id) {
        let { code, response } = await AxiosPost('/platform/detail', {
            para: { id }
        })

        this.setState({
            refreshing: false,
        })

        if (code === 0) {
            if (response.order_id && response.order_id !== 0) {
                this._goOrderDetail(response.order_id); // 跳转订单详情
            } else {
                this._basicCheck(id); // 用户过滤
                this._initData(response); // 初始化数据
            }
        }
    }

    _getData(id) {
        AxiosPost('/platform/detail', {
            para: { id }
        }).then(res => {
            let { code, response } = res;

            this.setState({
                refreshing: false,
            })

            if (code === 0) {
                this._initData(response); // 初始化数据
            }
        }).catch(error => {
            this.setState({
                refreshing: false,
            })
        })
    }

    _initData(response) {
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
            detailData: response,
            authConfig,
            authTypeActive,
        })
    }

    _basicCheck(id) {
        AxiosPost('/order/basic-check', {
            para: { platform_id: id }
        }).then(res => {
            let { code, response } = res;
            let showRecommend = 0;
            if (code !== 0) {
                showRecommend = 1;
                this._getRecommendData(id); // 获取推荐数据
            }

            this.setState({
                showRecommend,
                checkData: response,
            })
        })
    }

    _getRecommendData(id) {
        AxiosPost('/platform/recommend', {
            para: { platform_id: id }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 获取曝光产品id列表
                let exposureList = [];
                response.map(item => {
                    exposureList.push(item.id.toString());
                })

                this.setState({
                    refreshing: false,
                    recommendData: response,
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

        if (this.state.showRecommend === 0) {
            this._getData(this.state.id); // 获取产品详情数据
        }
    }

    _updateLoanData(state) {
        this.setState(state);
    }

    _detailMoreAction(route) {
        const { navigate } = this.props.navigation;

        let param = null;
        if (route === 'ProductDetail') {
            param = {
                detailData: this.state.detailData,
            }
        }

        if (route === 'ProductComment') {
            let showBtnComment = true;

            if (this.state.detailData.can_evaluate === 0) {
                showBtnComment = false;
            }
            param = {
                id: this.state.id,
                evaluate: this.state.detailData.evaluate,
                showBtnComment,
            }
        }

        navigate(route, param);
    }

    _goAuth(index) {
        const { navigate } = this.props.navigation;

        if (this.state.detailData.order_id !== 0) {
            Toast.show('Terdapat pesanan yang belum selesai', { duration: 4000 });
            return false
        }

        if (index !== 0 && this.state.authConfig[index - 1].is_auth === 0) {
            Toast.show('Silahkan lengkapi informasi mengikuti urutannya', { duration: 4000 });
            return false
        }

        navigate('AuthDetail', {
            authType: this.state.authConfig[index].auth_type,
            platformId: this.state.id,
        });
    }

    _goOrderConfirm() {
        const { navigate } = this.props.navigation;

        let isPass = 0;
        this.state.detailData.auth_progress.map(item => {
            if (item.is_auth === 1) {
                isPass++;
            }
        });

        if (isPass === this.state.detailData.auth_progress.length) {
            navigate('OrderConfirm', {
                state: {
                    interestFee: this.state.interestFee,
                    loanTerm: this.state.loanTerm,
                    loan_term: this.state.loan_term,
                    loan_amount: this.state.loan_amount,
                    term_type: this.state.term_type,
                    platform_id: this.state.platform_id,
                    receiveAmount: this.state.receiveAmount,
                    repayAmount: this.state.repayAmount,
                    repayDate: this.state.repayDate,
                    serviceFee: this.state.serviceFee,
                    categoryId: this.state.categoryId,
                }
            });
        } else {
            for (let index = 0; index < this.state.detailData.auth_progress.length; index++) {
                const item = this.state.detailData.auth_progress[index];
                if (item.is_auth === 0) {
                    navigate('AuthDetail', {
                        authType: item.auth_type,
                        platformId: this.state.id,
                    });
                    return false;
                }
            }
        }
    }

    _goOrderDetail(id) {
        const { replace } = this.props.navigation;

        replace('OrderDetail', { id });
    }

    _listAction(item) {
        const { navigate, push } = this.props.navigation;

        // 跳转默认产品详情
        if (item.jump_type === 0 || item.jump_type === 1) {
            navigate('DefultDetail', { id: item.id, category_id: 0 });
        }

        // 跳转Api产品详情
        if (item.jump_type === 2) {
            push('ApiDetail', { id: item.id, category_id: 0 });
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
                {
                    this.state.detailData &&
                    <View style={MainStyles.mainTitle}>
                        <Text style={MainStyles.mainTitleText}>{this.state.detailData.name}</Text>
                        <TouchableOpacity activeOpacity={1} style={SecondStyles.detailService} onPress={() => this.props.navigation.navigate('Feedback')}>
                            <Image source={require('./../../assets/img/icon_service.png')} style={SecondStyles.detailServiceIcon} />
                        </TouchableOpacity>
                    </View>
                }
                {
                    this.state.showRecommend === 1 &&
                    <View style={SecondStyles.recommendDetail}>
                        <Image source={require('./../../assets/img/icon_refuse.png')} style={SecondStyles.recommendInfoIcon} />
                        <View style={SecondStyles.recommendInfo}>
                            <Text style={SecondStyles.recommendName}>Kualifikasi tidak memenuhi syarat!!!</Text>
                            <Text style={SecondStyles.recommendText}>Kualifikasi Anda tidak memenuhi syarat, Silahkan coba produk lain!</Text>
                        </View>
                    </View>
                }
                {
                    this.state.showRecommend === 1 &&
                    <View style={MainStyles.mainTitle}>
                        <Text style={MainStyles.mainTitleText}>Rekomendasi Lainnya</Text>
                    </View>
                }
                {
                    this.state.showRecommend === 1 &&
                    <FlatList
                        style={SecondStyles.recommendList}
                        showsVerticalScrollIndicator={false}
                        data={this.state.recommendData}
                        keyExtractor={item => item.id.toString()}
                        ListFooterComponent={() => <View style={SecondStyles.listHack}></View>}
                        renderItem={({ item }) => <ProductItemModel item={item} doAction={this._listAction} />}
                        onViewableItemsChanged={this._onViewableItemsChanged}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 50
                        }}
                    />
                }
                {
                    this.state.showRecommend === 0 &&
                    this.state.detailData &&
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                    >
                        <ApiInfoModel platformId={this.state.detailData.id} checkData={this.state.checkData} doAction={this._updateLoanData} />
                        <View style={SecondStyles.detailMore}>
                            {
                                this.moreInfo.map((item, index) => {
                                    return (
                                        <Text style={SecondStyles.detailMoreText} key={index} onPress={() => this._detailMoreAction(item.route)}>{item.text} <Image source={require('./../../assets/img/icon_arrow5.png')} style={SecondStyles.detailMoreArrow} /></Text>
                                    )
                                })
                            }
                        </View>
                        <View style={SecondStyles.detailContainer}>
                            <View style={SecondStyles.detailTitle}>
                                <Text style={SecondStyles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={SecondStyles.detailTitleDot} /> Proses peminjaman</Text>
                            </View>
                            <View style={SecondStyles.detailContent}>
                                <ApiAuthModel data={this.state.authConfig} orderId={this.state.detailData.order_id} authTypeActive={this.state.authTypeActive} doAction={this._goAuth} />
                            </View>
                        </View>
                    </ScrollView>
                }
                {
                    this.state.showRecommend === 0 &&
                    this.state.detailData &&
                    this.state.detailData.order_id === 0 &&
                    <Text style={SecondStyles.downloadBtn} onPress={() => !this.state.waiting && this._goOrderConfirm()}>Segera Ambil</Text>
                }
                {
                    this.state.showRecommend === 0 &&
                    this.state.detailData &&
                    this.state.detailData.order_id !== 0 &&
                    <Text style={SecondStyles.downloadBtn} onPress={() => this._goOrderDetail(this.state.detailData.order_id)}>Lihat Pesanan</Text>
                }
            </View>
        );
    }
}

export default ApiDetailScreen;