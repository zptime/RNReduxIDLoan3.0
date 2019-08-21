import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { MainStyles, SecondStyles } from './../../assets/css/AppStyles';
import FAQ from './../../assets/js/FAQ';

import HeaderModel from './../../components/common/HeaderModel';

class FAQScreen extends Component {
    constructor(props) {
        super(props);

        this.tabConfig = Object.keys(FAQ);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            activeIndex: 0,
            list: FAQ[this.tabConfig[0]],
        }
    }

    componentWillMount() {}

    componentWillUnmount() {}

    _tabAction(item, index) {
        this.setState({
            activeIndex: index,
            list: FAQ[item],
        });
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>FAQ</Text>
                </View>
                <View style={SecondStyles.FAQTabWrap}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            this.tabConfig.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        key={index}
                                        style={[SecondStyles.FAQTabItem, this.state.activeIndex === index && SecondStyles.FAQTabItemActive]}
                                        onPress={() => {
                                            this._tabAction(item, index);
                                        }}
                                    >
                                        <Text style={[SecondStyles.FAQTabText, this.state.activeIndex === index && SecondStyles.FAQTabTextHack]}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']} style={SecondStyles.FAQTabMask} />
                </View>
                <FlatList
                    style={SecondStyles.listWrap}
                    showsVerticalScrollIndicator={false}
                    data={this.state.list}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <View style={SecondStyles.FAQListItem}>
                            <View>
                                <Image source={require('./../../assets/img/icon_question.png')} style={SecondStyles.FAQListItemIcon} />
                                <Text style={SecondStyles.FAQListItemTitle}>{item.question}</Text>
                            </View>
                            <View>
                                <Image source={require('./../../assets/img/icon_answer.png')} style={SecondStyles.FAQListItemIcon} />
                                <Text style={SecondStyles.FAQListItemText}>{item.answer}</Text>
                            </View>
                        </View>
                    }
                />
                <Text style={SecondStyles.FAQBtn} onPress={() => this.props.navigation.navigate('Feedback')}>Hubungi layanan pelanggan</Text>
            </View>
        );
    }
}

export default FAQScreen;