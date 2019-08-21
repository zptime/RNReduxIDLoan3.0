import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { MainStyles } from './../../assets/css/AppStyles';

import HeaderModel from './../../components/common/HeaderModel'
import SubmitCommentModel from './../../components/second/SubmitCommentModel'

class SubmitCommentScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            id: 0,
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数
    }

    componentWillUnmount() {}

    _getRouterParam() {
        const { navigation } = this.props;
        const id = navigation.getParam('id', '0');

        this.setState({ id });
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>EVALUASI</Text>
                </View>
                <SubmitCommentModel id={this.state.id} navigation={this.props.navigation} />
            </View>
        );
    }
}

export default SubmitCommentScreen;