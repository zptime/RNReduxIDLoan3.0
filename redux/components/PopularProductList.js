import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TitleModel from './common/TitleModel';
import ProductItemModel from './common/ProductItemModel';
import { PR } from './../../assets/css/AppStyles';

class PopularProductList extends Component {
    constructor(props){
        super(props);
        this.state = {
            titleConfig: {
                title: "Rekomendasi",
                subtitle: "Populer",
                isOperate: true,
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
            },{
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
                    numColumns={2}
                    renderItem={({item}) => (
                        <View style={styles.productItem}>
                            <ProductItemModel data={item} showFlag={false} doAction={this._productAction.bind(this)}/>
                        </View>
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
    },
    productItem: {
        width: '50%',
    }
})

export default  PopularProductList;