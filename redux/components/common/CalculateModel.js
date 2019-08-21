import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { PR } from '../../../assets/css/AppStyles';
import TitleModel from './TitleModel';
import SelectModel from './SelectModel';

import { connect } from 'react-redux';
// import { addTodo } from '../actions';

class CalculateModel extends Component {
    constructor(props){
        super(props);

        this._selectAction = this._selectAction.bind(this);

        this.state = {
            titleConfig: {
                title: "Perhitungan",
                subtitle: "Cepat",
                isOperate: false,
            },
            data: {
                min_loan: 4000,
                max_loan: 40000,
            },
            quota: 8000,
            duration: '12', //持续时间（月）
            interestRate: '5',//每年的利息
            interestCalculate: 'Flat', //利息计算
            selectOption: [
                { label: 'Flat', value: 1 },
                { label: 'Efektif', value: 2 },
                { label: 'Anuitas', value: 3 },
            ],
            selectTitle: 'Perhitungan Bunga',
            showSelect: false,
        };
        this.props = props;
    }

    _onPressButton(index){
        console.log("clicked to index", index)
    }

    _doSubmit(){
        console.log("do submit: quota=" + this.state.quota + ',duration=' + this.state.duration + ',interestRate=' + this.state.interestRate + ',interestCalculate=' + this.state.interestCalculate)
    }

    _selectAction(item) {
        let state = {
            showSelect: false
        };

        if (item) {
            state.interestCalculate = item.label;
        }

        this.setState(state);
    }

    render() {
        let { data, quota } = this.state;
        return (
            <View style={styles.calculateWrap}>
                <TitleModel data={this.state.titleConfig}/>
                <View style={styles.selectItem}>
                    <View style={[styles.selectTitle, styles.selectCommon]}>
                        <Text style={[styles.selectTitleName, styles.selectTitleCommon]}>Jumlah</Text>
                        <Text style={[styles.selectTitleValue, styles.selectTitleCommon]}>RP {quota}</Text>
                    </View>
                    <Slider
                        style={styles.selectSlider}
                        step={1000}
                        value={quota}
                        minimumValue={data.min_loan}
                        maximumValue={data.max_loan}
                        thumbTintColor="#52AA9B"
                        minimumTrackTintColor="#52AA9B"
                        maximumTrackTintColor="#F2F2F2"
                        onValueChange={quota => this.setState({ quota })}
                        onSlidingComplete={quota => this.setState({ quota })}
                    />
                    <View style={[styles.selectValue, styles.selectCommon]}>
                        <Text style={[styles.selectValueLeft, styles.selectValueCommon]}>RP {data.min_loan}</Text>
                        <Text style={[styles.selectValueRight, styles.selectValueCommon]}>RP {data.max_loan}</Text>
                    </View>
                </View>
                <View style={styles.tabModel}>
                    <View style={styles.tabItem}>
                        <Text style={styles.itemTitle}>Jangka Waktu(bulan)</Text>
                        <TextInput style={styles.itemValue} value={this.state.duration} onChangeText={(duration) => this.setState({duration})} maxLength={6}></TextInput>
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.itemTitle}>Bunga per Tahun(%)</Text>
                        <TextInput style={styles.itemValue} value={this.state.interestRate} onChangeText={(interestRate) => this.setState({interestRate})} maxLength={6}></TextInput>
                    </View>
                    <View style={styles.tabItem}>
                        <Text style={styles.itemTitle}>Perhitungan Bunga</Text>
                        <TouchableOpacity activeOpacity={1} onPress={() =>  this.setState({showSelect: true})}>
                            <TextInput style={styles.itemValue} editable={false} value={this.state.interestCalculate}></TextInput>
                            <Image style={styles.itemSelectArrow} source={require('../../../assets/img/icon_arrow2.png')} />
                        </TouchableOpacity>
                        <SelectModel
                            data={this.state.selectOption}
                            state={this.state.showSelect}
                            title={this.state.selectTitle}
                            selectLabel={this.state.interestCalculate}
                            doAction={this._selectAction}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={1} style={styles.submitAction} onPress={() => this._doSubmit()}>
                        <Text style={styles.submitText}>HITUNG</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    calculateWrap: {
        marginHorizontal: 20 * PR,
        marginTop: 20 * PR,
    },
    selectTitle:{
        marginTop: 10 * PR,
    },
    selectCommon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectTitleCommon: {
        fontSize: 15 * PR,
        fontWeight: 'bold',
    },
    selectTitleName: {
        color: '#445E80',
    },
    selectTitleValue: {
        color: '#52AA9B',
    },
    selectValueCommon: {
        fontSize: 12 * PR,
        color: '#8AA2C3',
    },
    selectSlider: {
        height: 30 * PR,
        marginLeft: -PR * 15,
        marginRight: -PR * 15,
        paddingVertical: PR * 5,
    },
    tabModel: {
        marginTop: 16 * PR,
        marginBottom: 37 * PR,
    },
    tabItem: {
        paddingBottom: 18 * PR,
    },
    itemTitle: {
        color: '#445E80',
        marginBottom: 11 * PR,
        fontSize: 15 * PR,
        fontWeight: 'bold',
    },
    itemValue: {
        height: 46 * PR,
        borderRadius: 23 * PR,
        backgroundColor: '#F2F2F2',
        color: '#8AA2C3',
        fontSize: 15 * PR,
        fontWeight: 'bold',
        paddingHorizontal: 15 * PR,
    },
    submitAction: {
        marginTop: 7 * PR,
    },
    submitText: {
        width: '100%',
        height: 46 * PR,
        backgroundColor: '#52AA9B',
        borderRadius: 23 * PR,
        color: '#fff',
        fontSize: 15 * PR,
        fontWeight: 'bold',
        textAlign:'center',
        textAlignVertical:'center',
    },
    itemSelectArrow: {
        position: 'absolute',
        right: 15 * PR,
        top: 18 * PR,
        width: 15 * PR,
        height: 10 * PR,
    },
})

export default connect()(CalculateModel);