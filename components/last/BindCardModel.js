import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

import Toast from 'react-native-root-toast';

import { PR } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';

import AuthSelectModel from './../second/AuthSelectModel';

class BindCardModel extends Component {
    constructor(props) {
        super(props);

        this.option = this.props.option;
        this.doAction = this.props.doAction;

        this._selectAction = this._selectAction.bind(this);

        this.state = {
            order_id: this.props.orderId,
            selectOption: null,
            selectKey: '',
            selectTitle: '',
            showSelect: false,
        };
    }

    componentDidMount() {
        this._getUserInfo(); // 获取用户信息
    }

    componentWillUnmount() {}

    _getUserInfo() {
        AxiosPost('/user/info').then(res => {
            let { code, response } = res;
            if (code === 0) {
                this.setState({
                    name: response.name
                });
            }
        })
    }

    _showSelect(selectKey, selectTitle, selectValue) {
        this.setState({
            selectOption: this.option[`${selectKey}Option`],
            selectKey,
            selectTitle,
            selectValue,
            showSelect: true
        });
    }

    async _selectAction(key, item) {
        let state = {
            showSelect: false
        };

        if (item) {
            state[key] = item.value;
            state[`${key}Label`] = item.label;

            // 回显所选银行对应的银行卡
            let { response } = await AxiosPost('/user/get-card', {
                para: { bank_code: item.value }
            });

            if (response && response.bank_card) {
                state.card_number = response.bank_card;
            } else {
                state.card_number = '';
            }
        }

        this.setState(state);
    }

    _doSubmit() {
        if (!this.state.bank_code) {
            Toast.show('Silahkan pilih bank', { duration: 4000 });
            return false;
        }

        if (!this.state.card_number) {
            Toast.show('Silahkan masukkan nomor rekening bank Anda', { duration: 4000 });
            return false;
        }

        AxiosPost('/order/bind-card', {
            para: this.state
        }).then(res => {
            let { code, message } = res;
            Toast.show(message, { duration: 4000 });
            if (code === 0) {
                this.doAction();
            }
        })
    }

    render() {
        return (
            <View style={styles.authModel}>
                <View style={styles.authHint}>
                    <Image style={styles.authHintIcon} source={require('./../../assets/img/icon_hint.png')} />
                    <Text style={styles.authHintText}>Silahkan periksa informasi bank anda dan pastikan itubenar.kami tidak akan bertanggung jawab atas kesalahananda.</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Pemegang Kartu</Text>
                    <Text style={styles.authItemValue}>{this.state.name}</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Name Bank Penerima</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showSelect('bank_code', 'Name Bank Penerima', this.state.bank_code)}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.bank_codeLabel} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Nomor Rekening Penerima</Text>
                    <TextInput contextMenuHidden={true} keyboardType='numeric' style={styles.authItemValue} value={this.state.card_number} onChangeText={cardNumber => this.setState({ card_number: cardNumber })} placeholder='Silahkan masukkan' />
                </View>
                <View style={styles.authHint2}>
                    <Text style={styles.authHintText2}>Nama yang tertera pada rekening harus sama dengan nama peminjam</Text>
                </View>
                <TouchableOpacity activeOpacity={1} style={styles.submitAction} onPress={() => this._doSubmit()}>
                    <Text style={styles.submitText}>Masukkan No.Rekening</Text>
                </TouchableOpacity>
                <AuthSelectModel
                    data={this.state.selectOption}
                    state={this.state.showSelect}
                    selectKey={this.state.selectKey}
                    selectValue={this.state.selectValue}
                    title={this.state.selectTitle}
                    doAction={this._selectAction}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    authModel: {
        marginHorizontal: PR * 20,
        paddingBottom: PR * 20,
    },
    authHint: {
        marginTop: PR * 10,
        marginBottom: PR * 20,
        paddingVertical: PR * 15,
        paddingLeft: PR * 40,
        paddingRight: PR * 15,
        borderRadius: PR * 6,
        backgroundColor: '#FFF8E0',
    },
    authHintText: {
        fontSize: PR * 12,
        color: '#FCCF33',
        lineHeight: PR * 15,
    },
    authHintIcon: {
        position: 'absolute',
        top: PR * 15,
        left: PR * 15,
        width: PR * 16,
        height: PR * 16,
    },
    authHint2: {
        marginBottom: PR * 20,
    },
    authHintText2: {
        fontSize: PR * 12,
        color: '#ADD5C7',
        lineHeight: PR * 15,
    },
    authItem: {
        marginBottom: PR * 15,
    },
    authItemText: {
        color: '#ADD5C7',
        fontSize: PR * 15,
        fontWeight: 'bold',
    },
    authItemDot: {
        width: PR * 6,
        height: PR * 6,
    },
    authItemValue: {
        height: PR * 48,
        textAlignVertical: 'center',
        borderBottomWidth: PR * 1,
        borderBottomColor: '#F2F2F2',
        fontSize: PR * 15,
        color: '#333',
        paddingHorizontal: PR * 10,
    },
    authItemSelect: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: PR * 48,
        borderBottomWidth: PR * 1,
        borderBottomColor: '#F2F2F2',
        paddingHorizontal: PR * 10,
    },
    authItemValueText: {
        flex: 1,
        fontSize: PR * 15,
        color: '#333',
    },
    authItemArrow: {
        width: PR * 6,
        height: PR * 9,
    },
    submitAction: {
        backgroundColor: '#24D29B',
        borderRadius: PR * 48,
    },
    submitText: {
        color: '#fff',
        fontSize: PR * 17,
        textAlign: 'center',
        lineHeight: PR * 48,
    },
})

export default BindCardModel;