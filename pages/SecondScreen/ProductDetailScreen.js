import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { MainStyles, SecondStyles } from './../../assets/css/AppStyles';

import HeaderModel from './../../components/common/HeaderModel';
import DetailMoreModel from './../../components/second/DetailMoreModel';

class ProductDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            detailData: null,
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数
    }

    componentWillUnmount() {}

    _getRouterParam() {
        const { navigation } = this.props;
        const detailData = navigation.getParam('detailData', {});

        this.setState({ detailData });
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={MainStyles.mainTitle}>
                        <Text style={MainStyles.mainTitleText}>Product Details</Text>
                    </View>
                    {
                        this.state.detailData &&
                        <View style={SecondStyles.detailContainer}>
                            <DetailMoreModel data={this.state.detailData} />
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }
}

export default ProductDetailScreen;