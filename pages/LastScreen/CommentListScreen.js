import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';

import Toast from 'react-native-root-toast';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';

import HeaderModel from './../../components/common/HeaderModel';
import CommentModel from './../../components/second/CommentModel';
import NothingModel from './../../components/common/NothingModel';

class CommentListScreen extends Component {
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
            index: 1,
            list: []
        }
    }

    componentWillMount() {
        this._getData(1); // 获取数据
    }

    componentWillUnmount() {}

    _getData(index) {
        this.setState({ refreshing: true });

        AxiosPost('/evaluate/my', {
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

    _listAction(item) {
        const { navigate } = this.props.navigation;

        if (item.online_status === 0) { // 产品已下架
            Toast.show('Produk telah dihapus', { duration: 4000 });
            return false;
        }

        // 跳转默认产品详情
        if (item.platform_jump_type === 0 || item.platform_jump_type === 1) {
            navigate('DefultDetail', { id: `${item.platform_id}` });
        }

        // 跳转Api产品详情
        if (item.platform_jump_type === 2) {
            navigate('ApiDetail', { id: `${item.platform_id}` });
        }
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>KOMENTAR SAYA</Text>
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
                        renderItem={({ item }) => <CommentModel item={item} doAction={this._listAction} />}
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
            </View>
        );
    }
}

export default CommentListScreen;