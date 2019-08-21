import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Easing, BackHandler, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-crop-picker';

class CameraModel extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Chat with ${navigation.state.params.type}`,
    });

    constructor(props) {
        super(props);
        this.state = {
            // moveAnim: new Animated.Value(0)
            focusedScreen: false,
            hasCameraPermission: true,
            showRNCamera: false,
            showBtnWrap: false,
            type: 'RNCamera', // RNCamera--打开自定义相机，camera--打开手机相机，picker--打开手机相册
        };
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        if (params) {
            this.setState({ type: params.type })
        }
    }

    componentDidMount() {
        // this._startAnimation();
        const { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.setState({ focusedScreen: true })
        );
        navigation.addListener('willBlur', () =>
            this.setState({ focusedScreen: false })
        );

        //如果当前是Android系统，则添加back键按下事件监听
        // if (Platform.OS === "android") {
        //     BackHandler.addEventListener('hardwareBackPress', () => {
        //         return this.handleBackAndroid(this.navigator);
        //     });
        // }

        this._changeCamera();
    }

    //组件被卸载前会执行
    componentWillUnmount() {
        //如果当前是Android系统，则移除back键按下事件监听
        // if (Platform.OS === "android") {
        //     BackHandler.removeEventListener('hardwareBackPress', () => { });
        // }
    }

    //back键按下事件响应
    handleBackAndroid(navigator) {
        //如果存在上一页则后退
        if (navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true; //接管默认行为
        }
        return false;  //使用默认行为（直接退出应用）
    }

    _changeCamera() {
        switch (this.state.type) {
            case 'RNCamera':
                this.setState({ showRNCamera: true })
                this.setState({ showBtnWrap: true })
                break;
            case 'camera':
                this._imagePicker()
                break;
            case 'picker':
                this._openPhoto()
                break;
            default:
                break;
        }
    }

    // _startAnimation = () => {
    //     this.state.moveAnim.setValue(0);
    //     Animated.timing(
    //         this.state.moveAnim,
    //         {
    //             toValue: -200,
    //             duration: 1500,
    //             easing: Easing.linear
    //         }
    //     ).start(() => this._startAnimation());
    // };

    _takePicture = async () => {
        if (this.camera) {
            const options = { quality: 0.5, base64: true, width: 100, height: 100 };
            const data = await this.camera.takePictureAsync(options);
            console.log(data);
            // alert("拍照成功！图片保存地址：\n" + data.path)
        }
    }

    _pausePreview() {
        this.camera.pausePreview();
    }

    _resumePreview() {
        this.camera.resumePreview();
    }

    _imagePicker() {
        let option = {
            includeBase64: true,
            compressImageQuality: 0.8,
            mediaType: 'photo',
            useFrontCamera: false,
            compressImageMaxWidth: 1024,
        };

        ImagePicker.openCamera(option).then(images => {
            console.log(images);
        }).catch(err => {
            console.log(err);
        });
    }

    _openPhoto() {
        ImagePicker.openPicker({
            includeBase64: true,
            compressImageQuality: 0.5,
            mediaType: 'photo',
            compressImageMaxWidth: 750,
        }).then(images => {
            console.log(images);
        }).catch(err => {
            console.log(err);
        });
    }

    //  识别二维码  onBarCodeRead 检测到条形码时，将调用指定的方法；事件包含data（条形码中的数据）和type（检测到的条形码类型）
    _onBarCodeRead = (result) => {
        const { navigate } = this.props.navigation;
        const { data } = result; //只要拿到data就可以了
        //路由跳转到webView页面；
        navigate('Sale', {
            url: data
        })
    };

    render() {
        const { hasCameraPermission, focusedScreen, showRNCamera, showBtnWrap } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else if (focusedScreen) {
            return (
                <View style={styles.container}>
                    {showRNCamera &&
                        <RNCamera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={styles.preview}
                            type={RNCamera.Constants.Type.back}
                            flashMode={RNCamera.Constants.FlashMode.on}
                            onBarCodeRead={this._onBarCodeRead}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                            androidRecordAudioPermissionOptions={{
                                title: 'Permission to use audio recording',
                                message: 'We need your permission to use your audio',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                            onGoogleVisionBarcodesDetected={({ barcodes }) => {
                                console.log(barcodes);
                            }}
                        >
                            <View style={styles.rectangleContainer}>
                                <View style={styles.rectangle} />
                                {/* <Animated.View style={[
                                    styles.border,
                                    { transform: [{ translateY: this.state.moveAnim }] }]} /> */}
                                <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                            </View>
                        </RNCamera>
                    }

                    {showBtnWrap &&
                        <View style={styles.btnWrap}>
                            <TouchableOpacity onPress={() => this.setState({ showRNCamera: false })} style={styles.capture}>
                                <Text style={styles.btnText}> hideRNCamera </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ showRNCamera: true })} style={styles.capture}>
                                <Text style={styles.btnText}> showRNCamera </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._pausePreview.bind(this)} style={styles.capture}>
                                <Text style={styles.btnText}> pausePreview </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._resumePreview.bind(this)} style={styles.capture}>
                                <Text style={styles.btnText}> resumePreview </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._takePicture.bind(this)} style={styles.capture}>
                                <Text style={styles.btnText}> RNCamera </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._imagePicker.bind(this)} style={styles.capture}>
                                <Text style={styles.btnText}> ImagePicker </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._openPhoto.bind(this)} style={styles.capture}>
                                <Text style={styles.btnText}> [打开相册] </Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            );
        } else {
            return <View />;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: '#00FF00',
    },
    btnWrap: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#aaa',
        flexWrap: 'wrap',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 5,
        alignSelf: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
    },
    btnText: {
        fontSize: 14,
    }
});

export default CameraModel;