import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';

import { MainStyles } from '../../../assets/css/AppStyles';
import HeadModel from '../../components/common/HeadModel';
import BannerModel from '../../components/common/BannerModel';
import CategoryModel from '../../components/common/CategoryModel';
import CalculateModel from '../../components/common/CalculateModel';
import DailyProductList from '../../components/DailyProductList';
import PopularProductList from '../../components/PopularProductList';

class SecondScreen extends Component {
    constructor(props) {
        super(props);

        this.headConfig = {
            title: 'Pinjaman Perhitungan',
            showBack: false,
            showAvatar: true,
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _headAction(){
        console.log('this is head action....');
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeadModel data={this.headConfig} doAction={this._headAction.bind(this)}/>
                <ScrollView>
                    {/* <BannerModel /> */}
                    {/* <CategoryModel /> */}
                    <CalculateModel />
                    <DailyProductList />
                    <PopularProductList />
                </ScrollView>
            </View>
        );
    }
}

export default SecondScreen;