import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, } from 'react-native';

class LastScreen extends Component {
    constructor(props) {
        super(props);

        this._takePicture = this._takePicture.bind(this);
    }

    // type：RNCamera--打开自定义相机，camera--打开手机相机，picker--打开手机相册
    _takePicture = (type) => {
        const { navigate } = this.props.navigation;
        console.log(type)
        navigate('Camera', {
            type: type
        })
    };

    // type：Video--视频播放，Audio--音频录音、播放
    _goTo = (type) => {
        const { navigate } = this.props.navigation;
        navigate(type)
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.btnWrap}>
                    {/* 拍照功能 */}
                    <TouchableOpacity onPress={() => this._takePicture('RNCamera')} style={styles.capture}>
                        <Text style={styles.btnText}>[RNCamera]</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._takePicture('camera')} style={styles.capture}>
                        <Text style={styles.btnText}>[openCamera]</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._takePicture('picker')} style={styles.capture}>
                        <Text style={styles.btnText}>[openPicker]</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._goTo('Video')} style={styles.capture}>
                        <Text style={styles.btnText}>[video]</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this._goTo('Audio')} style={styles.capture}>
                        <Text style={styles.btnText}>[audio]</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    btnWrap: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    capture: {
        flex: 0,
        backgroundColor: '#0bd9ff',
        borderRadius: 5,
        padding: 10,
        alignSelf: 'center',
        margin: 5,
    },
    btnText: {
        fontSize: 14,
        color: '#fff',
    }
});

export default LastScreen;