import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TitleModel from './common/TitleModel';
import ProductItemModel from './common/ProductItemModel';
import { PR } from './../../assets/css/AppStyles';

class DailyProductList extends Component {
    constructor(props){
        super(props);
        this.state = {
            titleConfig: {
                title: "Pilihan",
                subtitle: "Harian",
                isOperate: false,
            },
            productData: [{
                id: "5141", //产品ID
                type: 1,
                name: "Wang Duit", //产品名称
                icon: require('./../../assets/img/icon_feedback.png'), //产品图标
                slogan: "slogan", //广告语
                min_loan: "1000", //最小额度
                max_loan: "8000", //最大额度
                min_pay_time: "7",
                max_pay_time: "15",
                day_rate: '0.01',
            },{
                id: "5142", //产品ID
                type: 2,
                name: "Wang Duit", //产品名称
                icon: require('./../../assets/img/icon_feedback.png'), //产品图标
                slogan: "slogan", //广告语
                min_loan: "1000", //最小额度
                max_loan: "8000", //最大额度
                min_pay_time: "7",
                max_pay_time: "15",
                day_rate: '0.01',
            },{
                id: "5143", //产品ID
                type: 1,
                name: "Wang Duit", //产品名称
                icon: require('./../../assets/img/icon_feedback.png'), //产品图标
                slogan: "slogan", //广告语
                min_loan: "1000", //最小额度
                max_loan: "8000", //最大额度
                min_pay_time: "7",
                max_pay_time: "15",
                day_rate: '0.01',
            }]
        };
    }

    _titleAction(){
        console.log("clicked to the title action")
    }

    _productAction(item){
        console.log("clicked to the product action" + JSON.stringify(item))
    }

    render() {
        return (
            <View style={styles.productWrap}>
                <FlatList
                    data={this.state.productData}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => (
                        <ProductItemModel data={item} doAction={this._productAction.bind(this)}/>
                    )}
                    ListHeaderComponent={() => <TitleModel data={this.state.titleConfig} doAction={this._titleAction.bind(this)}/>}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    productWrap: {
        marginHorizontal: 20 * PR,
        marginVertical: 20 * PR,
    },
})

export default  DailyProductList;