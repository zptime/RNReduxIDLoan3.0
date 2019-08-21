import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, DeviceEventEmitter } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import Toast from 'react-native-root-toast';

import { PR } from './../../assets/css/AppStyles';
import Global from './../../assets/js/Global';
import AppInfoUtil from './../../assets/js/AppInfo'; // App信息获取模块

import AppJSON from './../../app';
import { AxiosPost } from './../../api';

import LoadingModel from './../common/LoadingModel'; // loading模块
import UploadHintModel from './UploadHintModel';
import AuthSelectModel from './AuthSelectModel';
import CitySelectModel from './CitySelectModel';

class AuthPersonalModel extends Component {
    constructor(props) {
        super(props);

        this.authType = this.props.authType;
        this.option = this.props.option;
        this.doAction = this.props.doAction;

        this._selectAction = this._selectAction.bind(this);
        this._uploadAction = this._uploadAction.bind(this);
        this._citySelectAction = this._citySelectAction.bind(this);

        this.pickerData = Global.cityData;

        this.state = {
            platform_id: this.props.platformId,
            check_idcard: 1,
            selectOption: null,
            selectKey: '',
            selectTitle: '',
            showSelect: false,
            showCitySelect: false,
            showUploadHint: false,
        };
    }

    componentDidMount() {
        this._getUserInfo(); // 获取用户信息
        this._getAuthInfo(); // 获取认证回显信息

        // 监听活体检测回调
        this.livenessDetectListener = DeviceEventEmitter.addListener('FaceData', res => {
            if (res.code === '0') {
                this.setState({
                    face_img: res.data
                });
            }
        });
    }

    componentWillUnmount() {
        this.livenessDetectListener && this.livenessDetectListener.remove(); // 移除监听活体检测事件
    }

    _getUserInfo() {
        AxiosPost('/user/info').then(res => {
            let { code, response } = res;
            if (code === 0) {
                let sexLabel = '';

                this.option.sexOption.map(item => {
                    if (item.value === response.sex) {
                        sexLabel = item.label
                    }
                });

                this.setState({
                    name: response.name,
                    id_card: response.id_card,
                    sex: response.sex,
                    sexLabel,
                });
            }
        })
    }

    _getAuthInfo() {
        AxiosPost('/auth/info', {
            para: { auth_type: this.authType, platform_id: this.state.platform_id }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 教育
                let educationLabel = '';
                this.option.educationOption.map(item => {
                    if (item.value === response.education) {
                        educationLabel = item.label
                    }
                })

                // 婚姻状况
                let marriageLabel = '';
                this.option.marriageOption.map(item => {
                    if (item.value === response.marriage) {
                        marriageLabel = item.label
                    }
                })

                // 子女数
                let children_numberLabel = '';
                this.option.children_numberOption.map(item => {
                    if (item.value === response.children_number) {
                        children_numberLabel = item.label
                    }
                })

                // 城市地区选择器初始化
                let citySelectedValue = ['', '', ''];
                if (response.regional && response.regional.length > 0) {
                    this.pickerData.map(item1 => {
                        if (response.regional.indexOf(item1.name) >= 0) {
                            citySelectedValue[0] = item1.name;
                            item1.city.map(item2 => {
                                if (response.regional.indexOf(item2.name) >= 0) {
                                    citySelectedValue[1] = item2.name;
                                    item2.area.map(item3 => {
                                        if (response.regional.indexOf(item3) >= 0) {
                                            citySelectedValue[2] = item3;
                                        }
                                    })
                                }
                            })
                        }
                    })
                }

                this.setState(Object.assign({}, response, {
                    face_img: response.face_img && `https://${response.face_img}`,
                    idcard_frontside: response.idcard_frontside && `https://${response.idcard_frontside}`,
                    idcard_backside: response.idcard_backside && `https://${response.idcard_backside}`,
                    educationLabel,
                    marriageLabel,
                    children_numberLabel,
                    citySelectedValue,
                }));
            }
        })
    }

    _addImg(key) {
        let option = {
            includeBase64: true,
            compressImageQuality: 0.8,
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
                if (key === 'face_img') {
                    AppInfoUtil.showLivenessDetect(); // 活体检测
                } else {
                    ImagePicker.openCamera(option).then(images => {
                        if (key === 'idcard_frontside') {
                            this._ocrCheck(`data:${images.mime};base64,${images.data}`); // 身份证验证
                        }

                        if (key === 'idcard_backside') {
                            this.setState({
                                idcard_backside: `data:${images.mime};base64,${images.data}`
                            });
                        }
                    }).catch(err => {
                        // console.log(err);
                    });
                }
            }
        })
    }

    _ocrCheck(ocrImage) {
        LoadingModel.show(); // 显示loading
        AxiosPost('/auth/ocr-check', {
            para: { ocrImage }
        }).then(res => {
            LoadingModel.hide(); // 隐藏loading

            let { code, message, response } = res;
            Toast.show(message, { duration: 4000 });
            if (code === 0) {
                this.setState({
                    idcard_frontside: response.ocrImage
                });
            }
        }).catch(err => {
            LoadingModel.hide(); // 隐藏loading
            // console.log(err);
        });
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

    _uploadAction(state) {
        if (state) {
            this._addImg('idcard_frontside')
        }

        this.setState({
            showUploadHint: false,
        });
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
            state.regional = `${citySelectedValue[0]} ${citySelectedValue[1]} ${citySelectedValue[2]}`;
        }

        this.setState(state);
    }

    _doSubmit() {
        if (!this.state.idcard_frontside) {
            Toast.show('Memotret foto depan kartu ID', { duration: 4000 });
            return false;
        }

        if (!this.state.idcard_backside) {
            Toast.show('Memotret foto belakang kartu ID', { duration: 4000 });
            return false;
        }

        if (!this.state.face_img) {
            Toast.show('Genggam kartu ID Anda dan potret', { duration: 4000 });
            return false;
        }

        if (!this.state.mother_name) {
            Toast.show('Silahkan masukkan nama ibu', { duration: 4000 });
            return false;
        }

        if (!this.state.education) {
            Toast.show('Silahkan pilih tingkat pendidikan terakhir', { duration: 4000 });
            return false;
        }

        if (!this.state.marriage) {
            Toast.show('Silahkan pilih status perkawinan', { duration: 4000 });
            return false;
        }

        if (!this.state.children_number) {
            Toast.show('Silahkan pilih jumlah anak', { duration: 4000 });
            return false;
        }

        if (!this.state.regional) {
            Toast.show('Silahkan pilih wilayah', { duration: 4000 });
            return false;
        }

        if (!this.state.address) {
            Toast.show('Silahkan pilih alamat Anda saat ini', { duration: 4000 });
            return false;
        }

        AxiosPost('/auth/personal', {
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
                <TouchableOpacity activeOpacity={1} style={styles.authUploadItem} onPress={() => this.setState({ showUploadHint: true })}>
                    <Text style={styles.authItemText}>Tampak Depan KTP</Text>
                    {
                        this.state.idcard_frontside &&
                        <Image source={{ uri: this.state.idcard_frontside }} style={styles.authUploadItemIcon} />
                    }
                    {
                        !this.state.idcard_frontside &&
                        <Image source={require('./../../assets/img/icon_upload2.png')} style={styles.authUploadItemIcon} />
                    }
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.authUploadItem} onPress={() => this._addImg('idcard_backside')}>
                    <Text style={styles.authItemText}>Tampak Belakang KTP</Text>
                    {
                        this.state.idcard_backside &&
                        <Image source={{ uri: this.state.idcard_backside }} style={styles.authUploadItemIcon} />
                    }
                    {
                        !this.state.idcard_backside &&
                        <Image source={require('./../../assets/img/icon_upload3.png')} style={styles.authUploadItemIcon} />
                    }
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.authUploadItem} onPress={() => this._addImg('face_img')}>
                    <Text style={styles.authItemText}>Pengenalan wajah</Text>
                    {
                        this.state.face_img &&
                        <Image source={{ uri: this.state.face_img }} style={styles.authUploadItemIcon} />
                    }
                    {
                        !this.state.face_img &&
                        <Image source={require('./../../assets/img/icon_upload4.png')} style={styles.authUploadItemIcon} />
                    }
                </TouchableOpacity>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Name Lengkap</Text>
                    <Text style={styles.authItemValue}>{this.state.name}</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> No. KTP</Text>
                    <Text style={styles.authItemValue}>{this.state.id_card}</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Jenis Kelamin</Text>
                    <Text style={styles.authItemValue}>{this.state.sexLabel}</Text>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Name Ibu Kandung</Text>
                    <TextInput contextMenuHidden={true} style={styles.authItemValue} value={this.state.mother_name} onChangeText={motherName => this.setState({ mother_name: motherName })} placeholder='Silahkan masukkan' />
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Edukasi</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showSelect('education', 'Edukasi', this.state.education)}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.educationLabel} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Staus Perkawinan</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showSelect('marriage', 'Staus Perkawinan', this.state.marriage)}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.marriageLabel} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Jumlah Anak</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showSelect('children_number', 'Jumlah Anak', this.state.children_number)}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.children_numberLabel} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Info wilayah</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.authItemSelect} onPress={() => this._showCitySelect()}>
                        <TextInput editable={false} style={styles.authItemValueText} value={this.state.regional} placeholder='Silahkan Pilih' />
                        <Image style={styles.authItemArrow} source={require('./../../assets/img/icon_arrow3.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> Alamat</Text>
                    <TextInput contextMenuHidden={true} style={styles.authItemValue} value={this.state.address} onChangeText={address => this.setState({ address })} placeholder='Silahkan masukkan' />
                </View>
                <View style={styles.authItem}>
                    <Text style={styles.authItemText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.authItemDot} /> WhatsAPP</Text>
                    <TextInput contextMenuHidden={true} style={styles.authItemValue} value={this.state.whatsapp} onChangeText={whatsapp => this.setState({ whatsapp })} placeholder='Silahkan masukkan' />
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
                <UploadHintModel
                    state={this.state.showUploadHint}
                    doAction={this._uploadAction}
                />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: PR * 10,
        backgroundColor: '#EDF6F3',
        borderRadius: PR * 6,
        height: PR * 99,
        paddingHorizontal: PR * 15,
        alignItems: 'center',
    },
    authUploadItemIcon: {
        width: PR * 89,
        height: PR * 59,
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

export default AuthPersonalModel;