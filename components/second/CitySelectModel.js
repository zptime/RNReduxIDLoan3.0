import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Modal } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

class CitySelectModel extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;
        this.title = this.props.title;
        this.doAction = this.props.doAction;

        this.state = {
            currentIndex: 0,
            selectValue: [...this.props.selectValue],
            list: [],
        };
    }

    componentDidMount() {
        this._initData();
    }

    componentWillUnmount() {}

    _initData() {
        let currentIndex = 0;
        this.state.selectValue.map((item, index) => {
            if (item) {
                currentIndex = index;
            }
        })

        let list = this._getData(this.state.selectValue, currentIndex);

        this.setState({ currentIndex, list });
    }

    _getData(selectValue, currentIndex) {
        let list = [];
        this.data.map(item1 => {
            if (currentIndex === 0) {
                list.push(item1.name)
            }

            if (item1.name === selectValue[0]) {
                item1.city.map(item2 => {
                    if (currentIndex === 1) {
                        list.push(item2.name)
                    }

                    if (item2.name === selectValue[1]) {
                        item2.area.map(item3 => {
                            if (currentIndex === 2) {
                                list.push(item3)
                            }
                        })
                    }
                })
            }
        })

        return list;
    }

    _selectTabAction(index, item) {
        if (!item) {
            return false;
        }

        let list = this._getData(this.state.selectValue, index);

        this.setState({ currentIndex: index, list });
    }

    _selectListAction(item) {
        let selectValue = this.state.selectValue;
        let currentIndex = this.state.currentIndex;

        if (currentIndex === 2) {
            selectValue[currentIndex] = item;
            this.doAction(selectValue);
        } else {
            if (item !== selectValue[currentIndex]) {
                selectValue[2] = '';
                if (currentIndex === 0) {
                    selectValue[1] = '';
                }
            }
            selectValue[currentIndex] = item;

            currentIndex = currentIndex + 1;
        }

        let list = this._getData(selectValue, currentIndex);

        this.setState({ selectValue, currentIndex, list });
    }

    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={true}
                onRequestClose={() => this.doAction(null)}
            >
                <StatusBar backgroundColor='rgba(0, 0, 0, 0.7)' barStyle='light-content' />
                <View style={styles.selectModel}>
                    <TouchableOpacity activeOpacity={1} style={styles.selectMask} onPress={() => this.doAction(null)}></TouchableOpacity>
                    <View style={styles.selectContent}>
                        <Text style={styles.selectTitle}>{this.title}</Text>
                        <View style={styles.selectTab}>
                            {
                                this.state.selectValue.map((item, index) => {
                                    return (
                                        <Text numberOfLines={1} style={[styles.selectTabItem, index === 0 && styles.selectTabItemLeft, index === 2 && styles.selectTabItemRight, this.state.currentIndex === index && styles.selectTabActive]} onPress={() => this._selectTabAction(index, item)} key={index}>{item || (index === 0 && 'Provinsi') || (index === 1 && 'Kota/Kab.') || (index === 2 && 'Kecamatan')}</Text>
                                    )
                                })
                            }
                        </View>
                        <FlatList
                            style={styles.selectlist}
                            showsVerticalScrollIndicator={false}
                            data={this.state.list}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => <Text style={[styles.selectlistItem, this.state.selectValue[this.state.currentIndex] === item && styles.selectlistActive]} onPress={() => this._selectListAction(item)}>{item}</Text>}
                        />
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    selectModel: {
        flex: 1,
        justifyContent: 'center',
    },
    selectMask: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    selectContent: {
        marginHorizontal: PR * 20,
        backgroundColor: '#FFF',
        borderRadius: PR * 6,
        overflow: 'hidden',
    },
    selectTitle: {
        height: PR * 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: PR * 15,
        color: '#999',
        fontWeight: 'bold',
        backgroundColor: '#f2f2f2',
    },
    selectTab: {
        flexDirection: 'row',
        marginHorizontal: PR * 20,
    },
    selectTabItem: {
        maxWidth: '33%',
        marginRight: PR * 10,
        textAlignVertical: 'center',
        fontSize: PR * 15,
        color: '#666',
        height: PR * 54,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    selectTabItemLeft: {
        textAlign: 'left',
    },
    selectTabItemRight: {
        textAlign: 'right',
    },
    selectTabActive: {
        color: '#24D29B',
    },
    selectlist: {
        maxHeight: PR * 352,
        marginBottom: PR * 20,
        marginHorizontal: PR * 20,
    },
    selectlistItem: {
        height: PR * 44,
        lineHeight: PR * 44,
        textAlign: 'center',
        fontSize: PR * 15,
        color: '#000',
    },
    selectlistActive: {
        backgroundColor: 'rgba(36, 210, 155, 0.1)',
        color: '#24D29B',
    },
})

export default CitySelectModel;