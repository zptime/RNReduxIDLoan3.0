import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import NothingModel from './../../components/common/NothingModel';
import FeedbackItemModel from './../../components/last/FeedbackItemModel';
import FeedbackPicModel from './../../components/last/FeedbackPicModel';

class FeedbackListScreen extends Component {
    constructor(props) {
        super(props);

        this._listAction = this._listAction.bind(this);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            refreshing: false,
            isCanLoadMore: false,
            userInfoData: {},
            index: 1,
            list: [],
            feedbackPic: '',
            showFeedbackPic: false,
        }
    }

    componentWillMount() {
        this._getData(1); // 获取数据
    }

    componentWillUnmount() {}

    _getData(index) {
        this.setState({ refreshing: true });

        AxiosPost('/user/user-feedback', {
            para: { index, limit: 10 }
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

    _listAction(uri) {
        this.setState({
            showFeedbackPic: true,
            feedbackPic: uri
        })
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>UMPAN BALIK SAYA</Text>
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
                                onRefresh={() => this._getData(1)}
                            />
                        }
                        data={this.state.list}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <FeedbackItemModel item={item} doAction={this._listAction} />}
                        onEndReached={() => {
                            if (this.state.isCanLoadMore) {
                                this._getData(this.state.index + 10);
                                this.setState({ isCanLoadMore: false });
                            }
                        }}
                        onContentSizeChange={() => {
                            this.setState({ isCanLoadMore: true });
                        }}
                        onEndReachedThreshold={0.01}
                    />
                }
                <FeedbackPicModel
                    state={this.state.showFeedbackPic}
                    uri={this.state.feedbackPic}
                    doAction={() => this.setState({ showFeedbackPic: false })}
                />
            </View>
        );
    }
}

export default FeedbackListScreen;