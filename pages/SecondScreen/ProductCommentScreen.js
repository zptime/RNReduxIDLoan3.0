import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, Image, DeviceEventEmitter } from 'react-native';

import { MainStyles, SecondStyles } from './../../assets/css/AppStyles';
import AppInfoUtil from './../../assets/js/AppInfo'; // App信息获取模块
import Global from './../../assets/js/Global';

import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import CommentModel from './../../components/second/CommentModel';
import ScoreModel from './../../components/second/ScoreModel';

class ProductCommentScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            refreshing: false,
            isCanLoadMore: false,
            id: 0,
            evaluate: {},
            showBtnComment: true,
            index: 1,
            list: [],
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数

        this.sumbitCommentListener = DeviceEventEmitter.addListener('sumbitComment', (state) => {
            if (state === 1) {
                this._getData(this.state.id, 1); // 获取评论列表数据
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
        const evaluate = navigation.getParam('evaluate', {
            summary: 0,
            approved: 0,
            speed: 0,
            billing: 0,
            count: 0
        });
        const showBtnComment = navigation.getParam('showBtnComment', false);

        this.setState({ id, evaluate, showBtnComment });

        this._getData(id, 1); // 获取数据
    }

    _getData(id, index) {
        this.setState({ refreshing: true });

        AxiosPost('/evaluate/list', {
            para: { id, index }
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
                    })
                }
            }
        }).catch(error => {
            this.setState({
                refreshing: false,
            })
        })
    }

    _commentAction() {
        const { navigate } = this.props.navigation;

        if (Global.isLogin === 1) {
            navigate('SubmitComment', { id: this.state.id });
        } else {
            this._getLoginMethod(); // 获取登录类型
        }
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>KOMENTAR</Text>
                </View>
                <View style={SecondStyles.scoreWrap}>
                    <ScoreModel data={this.state.evaluate} />
                </View>
                <FlatList
                    style={SecondStyles.listWrap}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this._getData(this.state.id, 1)}
                        />
                    }
                    data={this.state.list}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <CommentModel item={item} />}
                    onEndReached={() => {
                        if (this.state.isCanLoadMore) {
                            this._getData(this.state.id, this.state.index + 10);
                            this.setState({ isCanLoadMore: false });
                        }
                    }}
                    onContentSizeChange={() => {
                        this.setState({ isCanLoadMore: true });
                    }}
                    onEndReachedThreshold={0.01}
                />
                {
                    this.state.showBtnComment &&
                    <TouchableOpacity activeOpacity={1} style={SecondStyles.btnComment} onPress={() => this._commentAction()}>
                        <Image style={SecondStyles.btnCommentIcon} source={require('./../../assets/img/btn_comment.png')} />
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

export default ProductCommentScreen;