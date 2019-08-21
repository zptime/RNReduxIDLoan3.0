import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import Toast from 'react-native-root-toast';

import { PR } from './../../assets/css/AppStyles';
import Global from './../../assets/js/Global';

import AppJSON from './../../app';
import { AxiosPost } from './../../api';

import LoadingModel from './../common/LoadingModel'; // loading模块
import AuthSelectModel from './AuthSelectModel';
import CitySelectModel from './CitySelectModel';

class AuthJobModel extends Component {
    constructor(props) {
        super(props);

        this.authType = this.props.authType;
        this.option = this.props.option;
        this.doAction = this.props.doAction;

        this._selectAction = this._selectAction.bind(this);
        this._citySelectAction = this._citySelectAction.bind(this);

        this.pickerData = Global.cityData;

        this.state = {
            platform_id: this.props.platformId,
            selectOption: null,
            selectKey: '',
            selectTitle: '',
            showSelect: false,
            showCitySelect: false,
        };
    }

    componentDidMount() {
        this._getAuthInfo(); // 获取认证回显信息
    }

    componentWillUnmount() {}

    _getAuthInfo() {
        AxiosPost('/auth/info', {
            para: { auth_type: this.authType, platform_id: this.state.platform_id }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 雇佣关系
                let employmentLabel = '';
                this.option.employmentOption.map(item => {
                    if (item.value === response.employment) {
                        employmentLabel = item.label
                    }
                })

                // 月收入
                let salaryLabel = '';
                this.option.salaryOption.map(item => {
                    if (item.value === response.salary) {
                        salaryLabel = item.label
                    }
                })

                // 城市地区选择器初始化
                let citySelectedValue = ['', '', ''];
                if (response.company_regional && response.company_regional.length > 0) {
                    this.pickerData.map(item1 => {
                        if (response.company_regional.indexOf(item1.name) >= 0) {
                            citySelectedValue[0] = item1.name;
                            item1.city.map(item2 => {
                                if (response.company_regional.indexOf(item2.name) >= 0) {
                                    citySelectedValue[1] = item2.name;
                                    item2.area.map(item3 => {
                                        if (response.company_regional.indexOf(item3) >= 0) {
                                            citySelectedValue[2] = item3;
                                        }
                                    })
                                }
                            })
                        }
                    })
                }

                this.setState(Object.assign({}, response, {
                    work_permit: response.work_permit && `https://${response.work_permit}`,
                    employmentLabel,
                    salaryLabel,
                    citySelectedValue,
                }));
            }
        })
    }

    _addImg(key) {
        let option = {
            includeBase64: true,
            compressImageQuality: 0.5,
            mediaType: 'photo',
            useFrontCamera: false,
            compressImageMaxWidth: 1024,
        };

        Permissions.request('camera').then(response => {
            if (response !== 'authorized') {
                Alert.alert(
                    'Terapkan',
                    `Izinkan akses kamera di Pengaturan --> Aplikasi --> ${AppJSON.displayName} untuk menggunakan kamera`,
                    [
                        {
                            text: 'Batal',
                            style: 'cancel'
                        },
                    ]
                )
            } else {
                LoadingModel.show(); // 显示loading
                ImagePicker.openCamera(option).then(images => {
                    LoadingModel.hide(); // 隐藏loading
                    if (key === 'work_permit') {
                        this.setState({
                            work_permit: `data:${images.mime};base64,${images.data}`
                        });
                    }
                }).catch(err => {
                    LoadingModel.hide(); // 隐藏loading
                    // console.log(err);
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

    _showCitySelect() {
        this.setState({
            showCitySelect: true
        });
    }

    _citySelectAction(citySelectedValue) {
        let state = {
            showCitySelect: false
        };

        if (Array.isArray(citySelectedValue)) {
            state.citySelectedValue = citySelectedValue;
            state.company_regional = `${citySelectedValue[0]} ${citySelectedValue[1]} ${citySelectedValue[2]}`;
        }

        this.setState(state);
    }

    _doSubmit() {
        if (!this.state.employment) {
            Toast.show('Silahkan pilih jenis pekerjaan', { duration: 4000 });
            return false;
        }

        if (!this.state.salary) {
            Toast.show('Silahkan pilih penghasilan bulanan', { duration: 4000 });
            return false;
        }

        if (!this.state.company_name) {
            Toast.show('Silahkan masukkan nama perusahaan', { duration: 4000 });
            return false;
        }

        if (!this.state.company_regional) {
            Toast.show('Silahkan pilih wilayah', { duration: 4000 });
            return false;
        }

        if (!this.state.company_address) {
            Toast.show('Silahkan masukkan alamat lengkap', { duration: 4000 });
            return false;
        }

        if (!this.state.company_phone || this.state.company_phone.length < 6) {
            Toast.show('Silahkan masukkan nomor telepon perusahaan', { duration: 4000 });
            return false;
        }

        if (!this.state.work_permit) {
            Toast.show('Harap unggah izin kerja Anda', { duration: 4000 });
            return false;
        }

        AxiosPost('/auth/job', {
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
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Tipe Pekerjaan</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showSelect('employment', 'Tipe Pekerjaan', this.state.employment)}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.employmentLabel} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Pendapatan Bulanan</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showSelect('salary', 'Pendapatan Bulanan', this.state.salary)}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.salaryLabel} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Name Perusahaan</Text>
                    <TextInput contextMenuHidden={true} style={styles.authItemValue} value={this.state.company_name} onChangeText={companyName => this.setState({ company_name: companyName })} placeholder='Silahkan masukkan' />
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Info wilayah</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showCitySelect()}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.company_regional} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Alamat</Text>
                    <TextInput contextMenuHidden={true} style={styles.authItemValue} value={this.state.company_address} onChangeText={companyAddress => this.setState({ company_address: companyAddress })} placeholder='Silahkan masukkan' />
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> No Tel Perusahaan</Text>
                    <TextInput contextMenuHidden={true} keyboardType='numeric' style={styles.authItemValue} maxLength={20} value={this.state.company_phone} onChangeText={companyPhone => this.setState({ company_phone: companyPhone })} placeholder='Silahkan masukkan' />
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Upload Sertifiksai Pekerjaan Anda</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authUploadItem} onPress={() => this._addImg('work_permit')}>
                        {
                            this.state.work_permit &&
                            <Image source={{ uri: this.state.work_permit }} style={styles.authUploadItemIcon} />
                        }
                        {
                            !this.state.work_permit &&
                            <Image source={require('./../../assets/img/icon_upload1.png')} style={styles.authUploadItemIcon2} />
                        }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={1} style={styles.submitAction} onPress={() => this._doSubmit()}>
                    <Text style={styles.submitText}>KIRIM</Text>
                </TouchableOpacity>
                {
                    this.state.showCitySelect &&
                    <CitySelectModel
                        data={this.pickerData}
                        selectValue={this.state.citySelectedValue}
                        title={'Pilih wilayah'}
                        doAction={this._citySelectAction}
                    />
                }
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
    authUploadItem: {
        marginVertical: PR * 10,
        backgroundColor: '#EDF6F3',
        borderRadius: PR * 6,
        padding: PR * 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    authUploadItemIcon: {
        width: PR * 300,
        height: PR * 225,
    },
    authUploadItemIcon2: {
        width: PR * 84,
        height: PR * 84,
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

export default AuthJobModel;