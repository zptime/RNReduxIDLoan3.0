import React, { Component } from 'react';
import { ScrollView, View, Text, Linking, TouchableOpacity, Image, Dimensions, RefreshControl, DeviceEventEmitter } from 'react-native';

import { WebView } from 'react-native-webview';

import { MainStyles, SecondStyles, PR } from './../../assets/css/AppStyles';
import AppInfoUtil from './../../assets/js/AppInfo'; // App信息获取模块
import Global from './../../assets/js/Global';
import LogEventUtil from './../../assets/js/LogEvent'; // App事件记录模块

import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import ProductInfoModel from './../../components/second/ProductInfoModel';
import DetailTabModel from './../../components/second/DetailTabModel';
import DetailMoreModel from './../../components/second/DetailMoreModel';
import DetailCommentModel from './../../components/second/DetailCommentModel';

class DefultDetailScreen extends Component {
    constructor(props) {
        super(props);

        this._onRefresh = this._onRefresh.bind(this);
        this._detailTabAction = this._detailTabAction.bind(this);
        this._commentMoreAction = this._commentMoreAction.bind(this);

        this.detailTabConfig = ['Detail', 'Guide', 'Komentar'];

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            refreshing: true,
            id: 0,
            detailData: null,
            commentData: null,
            tabIndex: 0,
            detailView: null,
            guideView: null,
            commentView: null,
            showBtnComment: false,
            webViewHeight1: 0,
            webViewHeight2: 0,
            openApp: false,
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数

        this.sumbitCommentListener = DeviceEventEmitter.addListener('sumbitComment', (state) => {
            if (state === 1) {
                this._getData(this.state.id); // 获取详情数据
                this.setState({ showBtnComment: false }); // 隐藏评论按钮
            }
        });
    }

    componentWillUnmount() {
        this.sumbitCommentListener && this.sumbitCommentListener.remove();
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

    _getRouterParam() {
        const { navigation } = this.props;
        const id = navigation.getParam('id', '0');
        const categoryId = navigation.getParam('category_id', '0');
        const campaignUrl = navigation.getParam('campaign_url', '0');

        this.setState({ id, categoryId });
        this._platformClick(id, 1, categoryId, campaignUrl); // 记录产品访问次数

        this._getData(id); // 获取数据
    }

    _platformClick(id, clickType, categoryId, campaignUrl) {
        let eventName = 'list-product';
        if (clickType === 2) {
            eventName = 'productDetail';
        }
        LogEventUtil.logEvent(eventName, `${id}`); // 记录产品点击事件

        AxiosPost('/platform/click', {
            para: { platform_id: id, click_type: clickType, category_id: categoryId, campaign_url: campaignUrl }
        })
    }

    _getData(id) {
        AxiosPost('/platform/detail', {
            para: { id }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                this.setState({
                    refreshing: false,
                    detailData: response,
                })

                AppInfoUtil.checkAppInstalled(response.app_market_id).then(state => {
                    if (state) {
                        this.setState({
                            openApp: true
                        });
                    }
                });

                this._getComment(this.state.id);
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

    _getComment(id) {
        AxiosPost('/evaluate/list', {
            para: { id, limit: 3 }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                this.setState({
                    commentData: response,
                })
            }
        })
    }

    _detailTabAction(tabIndex) {
        let y = 0;
        let showBtnComment = this.state.showBtnComment;

        if (tabIndex === 0) {
            y = this.state.detailView.y - PR * 50;
            showBtnComment = false;
        }

        if (tabIndex === 1) {
            y = this.state.guideView.y - PR * 50;
            showBtnComment = false;
        }

        if (tabIndex === 2) {
            y = this.state.commentView.y - PR * 50;

            if (Global.isLogin === 1 && this.state.detailData.can_evaluate === 0) {
                showBtnComment = false;
            } else {
                showBtnComment = true;
            }
        }

        this.scrollView.scrollTo({ x: 0, y, animated: true });

        this.setState({ showBtnComment });
    }

    _scrollAction(scrollViewY) {
        let tabIndex = this.state.tabIndex;
        let showBtnComment = this.state.showBtnComment;

        // 判断模块位置数据已获得
        if (!this.state.detailView || !this.state.guideView || !this.state.commentView) {
            return false
        }

        if (scrollViewY <= this.state.detailView.y + this.state.detailView.height + PR * 100 - Dimensions.get('window').height) {
            tabIndex = 0;
            showBtnComment = false;
        } else if (scrollViewY <= this.state.guideView.y + this.state.guideView.height + PR * 100 - Dimensions.get('window').height) {
            tabIndex = 1;
            showBtnComment = false;
        } else if (scrollViewY <= this.state.commentView.y + this.state.commentView.height + PR * 100 - Dimensions.get('window').height) {
            tabIndex = 2;

            if (Global.isLogin === 1 && this.state.detailData.can_evaluate === 0) {
                showBtnComment = false;
            } else {
                showBtnComment = true;
            }
        }

        if (tabIndex !== this.state.tabIndex) {
            this.setState({ tabIndex, showBtnComment });
        }
    }

    _commentMoreAction() {
        const { navigate } = this.props.navigation;

        let showBtnComment = true;

        if (Global.isLogin === 1 && this.state.detailData.can_evaluate === 0) {
            showBtnComment = false;
        }

        navigate('ProductComment', {
            id: this.state.id,
            evaluate: this.state.detailData.evaluate,
            showBtnComment,
        });
    }

    _commentAction() {
        const { navigate } = this.props.navigation;

        if (Global.isLogin === 1) {
            navigate('SubmitComment', { id: this.state.id });
        } else {
            this._getLoginMethod(); // 获取登录类型
        }
    }

    _handleMessage(data) {
        if (data) {
            let message = JSON.parse(data);
            if (message.height1) {
                this.setState({
                    webViewHeight1: message.height1 + PR * 30,
                })
            }

            if (message.height2) {
                this.setState({
                    webViewHeight2: message.height2 + PR * 30,
                })
            }
        }
    }

    _getWebViewHeight(index) {
        const jsString = `const height = document.body.scrollHeight;window.ReactNativeWebView.postMessage(JSON.stringify({ height${index}: height }));`;

        if (index === 1) {
            this.refs.webView1.injectJavaScript(jsString);
        } else {
            this.refs.webView2.injectJavaScript(jsString);
        }
    }

    _openUrl() {
        if (this.state.detailData.campaign_url) {
            Linking.openURL(this.state.detailData.campaign_url);
        }

        this._platformClick(this.state.id, 2, this.state.categoryId, this.state.detailData.campaign_url);
    }

    _downloadApp() {
        AppInfoUtil.checkAppInstalled(this.state.detailData.app_market_id).then(state => {
            if (!state) {
                AppInfoUtil.jumpToGooglePlay(`https://play.google.com/store/apps/details?id=${this.state.detailData.app_market_id}`);
            } else {
                AppInfoUtil.openApp(this.state.detailData.app_market_id)
            }
        });

        this._platformClick(this.state.id, 2, this.state.categoryId, this.state.detailData.campaign_url);
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
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    stickyHeaderIndices={[1]}
                    ref={view => this.scrollView = view}
                    onScroll={({ nativeEvent }) => this._scrollAction(nativeEvent.contentOffset.y) }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    {
                        this.state.detailData &&
                        <ProductInfoModel data={this.state.detailData} />
                    }
                    {
                        this.state.detailData &&
                        <View style={SecondStyles.detailTab}>
                            <DetailTabModel data={this.detailTabConfig} tabIndex={this.state.tabIndex} doAction={this._detailTabAction} />
                        </View>
                    }
                    {
                        this.state.detailData &&
                        <View onLayout={({ nativeEvent }) => this.setState({ detailView: nativeEvent.layout })} style={SecondStyles.detailContainer}>
                            <DetailMoreModel data={this.state.detailData} />
                            <View style={SecondStyles.detailItemLine}></View>
                        </View>
                    }
                    {
                        this.state.detailData &&
                        <View onLayout={({ nativeEvent }) => this.setState({ guideView: nativeEvent.layout })} style={SecondStyles.detailContainer}>
                            {
                                this.state.detailData.loan_process.length > 0 &&
                                <View style={SecondStyles.detailItem}>
                                    <View style={SecondStyles.detailTitle}>
                                        <Text style={SecondStyles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={SecondStyles.detailTitleDot} /> Proses peminjaman</Text>
                                    </View>
                                    <View style={[SecondStyles.detailContent, { height: this.state.webViewHeight1 }]}>
                                        <WebView
                                            ref='webView1'
                                            source={{ html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="padding:0;margin:0;color:#666;word-break:break-all;font-size:${PR * 12}px;">${this.state.detailData.loan_process}</body></html>` }}
                                            overScrollMode={'never'}
                                            onMessage={({ nativeEvent }) => { this._handleMessage(nativeEvent.data) }}
                                            onLoad={() => { this._getWebViewHeight(1) }}
                                        />
                                    </View>
                                </View>
                            }
                            {
                                this.state.detailData.audit_information.length > 0 &&
                                <View style={SecondStyles.detailItem}>
                                    <View style={SecondStyles.detailTitle}>
                                        <Text style={SecondStyles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={SecondStyles.detailTitleDot} /> Informasi audit</Text>
                                    </View>
                                    <View style={[SecondStyles.detailContent, , { height: this.state.webViewHeight2 }]}>
                                        <WebView
                                            ref='webView2'
                                            source={{ html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="padding:0;margin:0;color:#666;word-break:break-all;font-size:${PR * 12}px;">${this.state.detailData.audit_information}</body></html>` }}
                                            overScrollMode={'never'}
                                            onMessage={({ nativeEvent }) => { this._handleMessage(nativeEvent.data) }}
                                            onLoad={() => { this._getWebViewHeight(2) }}
                                        />
                                    </View>
                                </View>
                            }
                        </View>
                    }
                    {
                        this.state.commentData &&
                        <View onLayout={({ nativeEvent }) => this.setState({ commentView: nativeEvent.layout })} style={SecondStyles.detailContainer}>
                            <DetailCommentModel detailData={this.state.detailData} commentData={this.state.commentData} doAction={this._commentMoreAction} />
                        </View>
                    }
                </ScrollView>
                {
                    this.state.showBtnComment &&
                    <TouchableOpacity activeOpacity={1} style={SecondStyles.btnComment} onPress={() => this._commentAction()}>
                        <Image style={SecondStyles.btnCommentIcon} source={require('./../../assets/img/btn_comment.png')} />
                    </TouchableOpacity>
                }
                {
                    this.state.detailData && this.state.detailData.jump_type === 1 &&
                    <Text style={SecondStyles.downloadBtn} onPress={() => this._openUrl()}>{'BUKA'}</Text>
                }
                {
                    this.state.detailData && this.state.detailData.jump_type === 0 &&
                    <Text style={SecondStyles.downloadBtn} onPress={() => this._downloadApp()}>{this.state.openApp ? 'BUKA' :`Download dan ${this.state.detailData.name}`}</Text>
                }
            </View>
        );
    }
}

export default DefultDetailScreen;