import React, { Component } from 'react';
import { View, StyleSheet, Platform, PermissionsAndroid, TouchableOpacity, Text, TouchableHighlight } from 'react-native';

import Sound from 'react-native-sound';                        // 播放声音组件
import { AudioRecorder, AudioUtils } from 'react-native-audio';

class AudioModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0.0,                                                   //开始录音到现在的持续时间
            recording: false,                                                   //是否正在录音
            paused: false,                                                      //暂停录音或者恢复录音
            stoppedRecording: false,                                            //是否停止了录音
            finished: false,                                                    //是否完成录音
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',          //路径下的文件名  Exception in native call from JS
            hasPermission: undefined,                                           //是否获取权限
        };

        this.prepareRecordingPath = this.prepareRecordingPath.bind(this);     //执行录音的方法
        this.checkPermission = this.checkPermission.bind(this);               //检测是否授权
        this._record = this._record.bind(this);                                 //录音
        this._stop = this._stop.bind(this);                                     //停止
        this._play = this._play.bind(this);                                     //播放
        this._pause = this._pause.bind(this);                                   //暂停  Method not available on this version of Android
        this._resume = this._resume.bind(this);                                   //恢复
        this.finishRecording = this.finishRecording.bind(this);
    }

    componentDidMount() {
        // 页面加载完成后获取权限
        // AudioRecorder.requestAuthorization().then((isAuthorised) => {
        this.checkPermission().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });

            //如果未授权, 则执行下面的代码
            if (!isAuthorised) return;

            this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({ currentTime: Math.floor(data.currentTime) });
            };

            AudioRecorder.onFinished = (data) => {
                if (Platform.OS === 'ios') {
                    this.finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };

        })
    }

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",            //录音质量
            AudioEncoding: "aac",           //录音格式
            AudioEncodingBitRate: 32000     //比特率
        });
    }

    checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }

        const rationale = {
            'title': '获取录音权限',
            'message': 'XXX正请求获取麦克风权限用于录音,是否准许'
        };

        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
            .then((result) => {
                // alert(result);
                //结果: granted , PermissionsAndroid.RESULTS.GRANTED 也等于 granted
                return (result === true || PermissionsAndroid.RESULTS.GRANTED)
            })
    }

    finishRecording(didSucceed, filePath, fileSize) {
        this.setState({ finished: didSucceed });
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    async _record() {
        // 如果正在录音
        if (this.state.recording) {
            alert('正在录音中!');
            console.warn('Already recording!');
            return;
        }

        //如果没有获取权限
        if (!this.state.hasPermission) {
            alert('没有获取录音权限!');
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        //如果暂停获取停止了录音
        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({ recording: true, paused: false });

        try {
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {
        // 如果没有在录音
        if (!this.state.recording) {
            alert('没有录音, 无需停止!');
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({ stoppedRecording: true, recording: false, paused: false });

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this.finishRecording(true, filePath);
            }
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    async _play() {
        // 如果在录音 , 执行停止按钮
        if (this.state.recording) {
            await this.stop();
        }

        // 使用 setTimeout 是因为, 为避免发生一些问题 react-native-sound中
        // These timeouts are a hacky workaround for some issues with react-native-sound.
        // See https://github.com/zmxv/react-native-sound/issues/89.
        setTimeout(() => {
            var sound = new Sound(this.state.audioPath, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);
    }

    async _pause() {
        if (!this.state.recording) {
            alert('没有录音, 无需停止!');
            console.warn('Can\'t pause, not recording!');
            return;
        }

        // this.setState({ stoppedRecording: true, recording: false });

        try {
            const filePath = await AudioRecorder.pauseRecording();

            // 在安卓中, 暂停就等于停止
            // if (Platform.OS === 'android') {
            //     this.finishRecording(true, filePath);
            // }
            this.setState({ paused: true }); // ++
        } catch (error) {
            console.error(error);
        }
    }

    async _resume() {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({ paused: false });
        } catch (error) {
            console.error(error);
        }
    }

    _renderButton(title, onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    _renderPauseButton(onPress, active) {
        var style = (active) ? styles.activeButtonText : styles.buttonText;
        var title = this.state.paused ? "RESUME" : "PAUSE";
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.controls}>
                    {this._renderButton("RECORD", () => { this._record() }, this.state.recording)}
                    {this._renderButton("PLAY", () => { this._play() })}
                    {this._renderButton("STOP", () => { this._stop() })}
                    {this._renderButton("PAUSE", () => {this._pause()} )}
                    {this._renderButton("RESUME", () => {this._resume()} )}
                    {this._renderPauseButton(() => { this.state.paused ? this._resume() : this._pause() })}
                    <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2b608a",
    },
    controls: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    progressText: {
        paddingTop: 50,
        fontSize: 50,
        color: "#fff"
    },
    button: {
        padding: 20
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 20,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    }
});

export default AudioModel;