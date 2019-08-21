import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View, Text, Image, TextInput, DeviceEventEmitter, Keyboard, StyleSheet } from 'react-native';

import Toast from 'react-native-root-toast';

import { PR } from './../../assets/css/AppStyles';

import { AxiosPost } from './../../api';

class SubmitCommentModel extends Component {
    constructor(props) {
        super(props);

        this.navigation = this.props.navigation;

        this.state = {
            'platform_id': this.props.id,
            approved: 0,
            speed: 0,
            billing: 0,
            content: '',
        };
    }

    // 监听键盘弹出与收回
    componentDidMount() {}

    //注销监听
    componentWillUnmount() {}

    _getScore(score) {
        let result = [0, 0, 0, 0, 0];
        let target = score / 10 % 5 === 0 ? 5 : score / 10 % 5;
        if (score === 0) {
            target = 0;
        }

        result.map((item, index) => {
            if (index < target) {
                result[index] = 1;
            }
        });

        return result;
    }

    _selectAction(key, index) {
        let value = (index + 1) * 10;
        if (key === 0) {
            this.setState({
                approved: value
            })
        }

        if (key === 1) {
            this.setState({
                speed: value
            })
        }

        if (key === 2) {
            this.setState({
                billing: value
            })
        }
    }

    _submitAction() {
        Keyboard.dismiss(); // 收起键盘

        if (
            this.state.approved !== 0 &&
            this.state.approved !== 0 &&
            this.state.approved !== 0 &&
            this.state.content.length >= 15
        ) {
            AxiosPost('/evaluate/add', {
                para: this.state
            }).then(res => {
                let { code, message } = res;

                Toast.show(message, { duration: 4000 });
                if (code === 0) {
                    DeviceEventEmitter.emit('sumbitComment', 1);
                    this.props.navigation.goBack(); // 返回上一页
                }
            })
        } else {
            if (
                this.state.approved === 0 ||
                this.state.approved === 0 ||
                this.state.approved === 0 ||
                this.state.content.length === 0
            ) {
                Toast.show('Silahkan berikan komentar skor lalu kirim', { duration: 4000 });
            } else {
                if (this.state.content.length < 15) {
                    Toast.show('Komentar minimal 15 karakter', { duration: 4000 });
                }
            }
        }
    }

    render() {
        return (
            <ScrollView style={styles.submitCommentWrap} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                <View style={styles.submitCommentItem}>
                    <Text style={styles.scoreValueName}>Disetujui</Text>
                    {
                        this._getScore(this.state.approved).map((item, index) => {
                            let source;
                            if (item === 1) {
                                source = require('./../../assets/img/icon_score.png');
                            }

                            if (item === 0) {
                                source = require('./../../assets/img/icon_score2.png');
                            }

                            return (
                                <TouchableOpacity style={styles.scoreBtn} key={index} activeOpacity={1} onPress={() => this._selectAction(0, index)}>
                                    <Image style={styles.scoreStar} source={source} />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={styles.submitCommentItem}>
                    <Text style={styles.scoreValueName}>Kecepatan</Text>
                    {
                        this._getScore(this.state.speed).map((item, index) => {
                            let source;
                            if (item === 1) {
                                source = require('./../../assets/img/icon_score.png');
                            }

                            if (item === 0) {
                                source = require('./../../assets/img/icon_score2.png');
                            }

                            return (
                                <TouchableOpacity style={styles.scoreBtn} key={index} activeOpacity={1} onPress={() => this._selectAction(1, index)}>
                                    <Image style={styles.scoreStar} source={source} />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View style={styles.submitCommentItem}>
                    <Text style={styles.scoreValueName}>Penagihan</Text>
                    {
                        this._getScore(this.state.billing).map((item, index) => {
                            let source;
                            if (item === 1) {
                                source = require('./../../assets/img/icon_score.png');
                            }

                            if (item === 0) {
                                source = require('./../../assets/img/icon_score2.png');
                            }

                            return (
                                <TouchableOpacity style={styles.scoreBtn} key={index} activeOpacity={1} onPress={() => this._selectAction(2, index)}>
                                    <Image style={styles.scoreStar} source={source} />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View>
                    <TextInput
                        style={styles.commentContent}
                        value={this.state.content}
                        contextMenuHidden={true}
                        multiline={true}
                        maxLength={500}
                        onChange={({ nativeEvent }) => this.setState({ content: nativeEvent.text  })}
                        placeholder={`Bagaimana menurut anda mengenai produk ini?${'\n'}Apakah mudah meminjamnya dan Pencairan dana cepat?`}
                    />
                    <Text style={styles.commentHint}>Masukkan setidaknya 15 kata</Text>
                </View>
                <Text style={styles.commentHint2}>Komentar dan saran anda sangat penting bagi kami！</Text>
                <Text style={styles.submitCommentBtn} onPress={() => this._submitAction()}>Kirim</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    submitCommentWrap: {
        marginHorizontal: PR * 20,
    },
    submitCommentItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreValueName: {
        width: PR * 110,
        fontSize: PR * 18,
        color: '#666',
        fontWeight: 'bold',
    },
    scoreBtn: {
        paddingHorizontal: PR * 10,
        height: PR * 35,
        justifyContent: 'center',
    },
    scoreStar: {
        width: PR * 16,
        height: PR * 15,
    },
    commentContent: {
        padding: PR * 15,
        paddingBottom: PR * 30,
        backgroundColor: '#EDF6F3',
        borderRadius: PR * 6,
        marginTop: PR * 20,
        fontSize: PR * 15,
        height: PR * 184,
        color: '#333',
        textAlignVertical: 'top',
    },
    commentHint: {
        position: 'absolute',
        right: PR * 15,
        bottom: PR * 10,
        color: '#ADD5C7',
        fontSize: PR * 13,
    },
    commentHint2: {
        paddingVertical: PR * 10,
        textAlign: 'center',
        color: '#ADD5C7',
        fontSize: PR * 13,
    },
    submitCommentBtn: {
        marginTop: PR * 10,
        marginBottom: PR * 20,
        backgroundColor: '#24D29B',
        color: '#FFF',
        fontSize: PR * 17,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        height: PR * 48,
        borderRadius: PR * 48,
    },
})

export default SubmitCommentModel;