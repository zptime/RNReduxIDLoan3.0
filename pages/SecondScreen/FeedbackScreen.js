import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Text, Image, Alert, Keyboard } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import Toast from 'react-native-root-toast';

import { AxiosPost } from './../../api';
import AppJSON from './../../app';
import { MainStyles, FeedbackStyles } from './../../assets/css/AppStyles';
import Global from './../../assets/js/Global';
import AppInfoUtil from './../../assets/js/AppInfo'; // App信息获取模块

import HeaderModel from './../../components/common/HeaderModel';
import LoadingModel from './../../components/common/LoadingModel'; // loading模块

class FeedbackScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            picList: [],
            description: '',
            showFeedback: false,
        }
    }

    componentWillMount() {
        if (Global.isLogin === 1) {
            this.setState({
                showFeedback: true,
            });
            this._getStoragePermissions(); // 获取存储权限
        } else {
            this._getLoginMethod(); // 获取登录类型
        }
    }

    componentWillUnmount() {}

    _getStoragePermissions() {
        Permissions.request('storage').then(response => {
            if (response !== 'authorized') {
                Alert.alert(
                    'Terapkan',
                    `Izinkan akses kamera di Pengaturan --> Aplikasi --> ${AppJSON.displayName} untuk menggunakan penyimpanan`,
                    [
                        {
                            text: 'Batal',
                            style: 'cancel'
                        },
                    ]
                )
            }
        })
    }

    async _getLoginMethod() {
        let { response } = await AxiosPost('/app/config');
        let sms = response ? response.sms : 0;

        const { goBack, navigate } = this.props.navigation;

        goBack(); // 返回上一页

        if (sms === 2) {
            navigate('Login');
        } else {
            AppInfoUtil.showLoginDialog(); // 显示facebook登录页
        }
    }

    _doSubmit() {
        Keyboard.dismiss(); // 收起键盘

        if (!this.state.description || this.state.description.length < 10) {
            Toast.show('Silahkan isi deskripsi masalah dengan lebih dari 10 kata sehingga kami dapat memberikan layanan yang lebih baik.', { duration: 4000 });
            return false;
        }

        let pic = []
        this.state.picList.map(item => {
            pic.push(item.uri)
        })

        LoadingModel.show(); // 显示loading

        AxiosPost('/app/submit-feedback', {
            para: {
                description: this.state.description,
                pic,
            }
        }).then(res => {
            let { code, message } = res;

            LoadingModel.hide(); // 隐藏loading
            Toast.show(message, { duration: 4000 });
            if (code === 0) {
                this.setState({
                    description: '',
                    picList: [],
                })

                this.props.navigation.goBack(); // 返回上一页
            }
        }).catch(error => {
            LoadingModel.hide(); // 隐藏loading
        })
    }

    _addImg() {
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
                ImagePicker.openPicker({
                    includeBase64: true,
                    compressImageQuality: 0.5,
                    mediaType: 'photo',
                    compressImageMaxWidth: 1024,
                }).then(images => {
                    LoadingModel.hide(); // 隐藏loading

                    let picList = this.state.picList;
                    picList.push({ time: new Date().getTime(), uri: `data:${images.mime};base64,${images.data}` });

                    this.setState({ picList });
                }).catch(err => {
                    LoadingModel.hide(); // 隐藏loading
                    // console.log(err);
                });
            }
        })
    }

    _delImg(item) {
        let picList = this.state.picList;
        picList.map((value, index) => {
            if (value.time === item.time) {
                picList.splice(index, 1);
            }
        })
        this.setState({ picList });
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                {
                    this.state.showFeedback &&
                    <View>
                        <HeaderModel data={this.state.headerConfig} />
                        <View style={MainStyles.mainTitle}>
                            <Text style={MainStyles.mainTitleText}>HUBUNGI KAMI</Text>
                        </View>
                        <ScrollView
                            style={FeedbackStyles.feedbackContainer}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps={'handled'}
                        >
                            <View style={FeedbackStyles.feedbackItem}>
                                <View style={FeedbackStyles.feedbackTitle}>
                                    <Text style={FeedbackStyles.feedbackTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={FeedbackStyles.feedbackTitleDot} /> Pertanyaan dan komentar (wajib diisi)</Text>
                                </View>
                                <View style={FeedbackStyles.feedbackContent}>
                                    <TextInput onChangeText={description => this.setState({ description })} value={this.state.description} placeholder="Silahkan isi deskripsi masalah dengan lebih dari 10 kata sehingga kami dapat memberikan layanan yang lebih baik." style={FeedbackStyles.feedbackDetail} multiline={true} maxLength={200} />
                                </View>
                            </View>
                            <View style={FeedbackStyles.feedbackItem}>
                                <View style={FeedbackStyles.feedbackTitle}>
                                    <Text style={FeedbackStyles.feedbackTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={FeedbackStyles.feedbackTitleDot} /> Unggah gambar (opsional)</Text>
                                </View>
                                <View style={FeedbackStyles.uploadList}>
                                    {
                                        this.state.picList.map((item, key) => {
                                            return (
                                                <View key={key} style={FeedbackStyles.uploadItem}>
                                                    <Image style={FeedbackStyles.itemImg} source={{ uri: item.uri }} />
                                                    <TouchableOpacity activeOpacity={1} style={FeedbackStyles.itemDel} onPress={() => this._delImg(item)}>
                                                        <Image style={FeedbackStyles.itemDelIcon} source={require('./../../assets/img/icon_close.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                    {
                                        this.state.picList.length < 3 ?
                                            <TouchableOpacity activeOpacity={1} style={FeedbackStyles.uploadItem} onPress={() => this._addImg()}>
                                                <Image style={FeedbackStyles.itemAdd} source={require('./../../assets/img/icon_upload1.png')} />
                                            </TouchableOpacity>
                                            :
                                            null
                                    }
                                </View>
                            </View>
                            <Text style={FeedbackStyles.feedbackTip}>Kami akan dengan cermat membaca umpan balik Anda dan mencari solusinya, informasi kontak hanya dapat dilihat oleh staf kami</Text>
                            <TouchableOpacity activeOpacity={1} style={FeedbackStyles.submitAction} onPress={() => this._doSubmit()}>
                                <Text style={FeedbackStyles.submitText}>Kirimkan Masukkan</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                }
            </View>
        );
    }
}

export default FeedbackScreen;