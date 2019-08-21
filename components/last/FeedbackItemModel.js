import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

class FeedbackItemModel extends Component {
    constructor(props) {
        super(props);

        this.item = this.props.item;
        this.doAction = this.props.doAction;

        this.state = {
            showAnswer: false,
            showMore1: 0,
            showMore2: 0,
        };
    }

    // 监听键盘弹出与收回
    componentDidMount() {
        this._formatData(); // 格式化数据
    }

    //注销监听
    componentWillUnmount() {}

    _formatData() {
        let showMore1 = 0;
        if (this.item.description && this.item.description.length / 46 >= 3) {
            showMore1 = 1;
        }

        let showAnswer = false;
        let showMore2 = 0;
        if (this.item.answer) {
            showAnswer = true;

            if (this.item.answer.length / 46 >= 3) {
                showMore2 = 1;
            }
        }

        this.setState({ showMore1, showMore2, showAnswer });
    }

    _showMoreAction(more) {
        let showMore1 = this.state.showMore1;
        let showMore2 = this.state.showMore2;
        if (more === 'more1') {
            if (this.state.showMore1 === 1) {
                showMore1 = 2;
            } else if (this.state.showMore1 === 2) {
                showMore1 = 1;
            }
        }

        if (more === 'more2') {
            if (this.state.showMore2 === 1) {
                showMore2 = 2;
            } else if (this.state.showMore2 === 2) {
                showMore2 = 1;
            }
        }

        this.setState({ showMore1, showMore2 });
    }

    render() {
        let arrowSource1;
        let number1 = 0;
        if (this.state.showMore1 === 1) {
            arrowSource1 = require('./../../assets/img/icon_arrow2.png');
            number1 = 3;
        }

        if (this.state.showMore1 === 2) {
            arrowSource1 = require('./../../assets/img/icon_arrow4.png')
        }

        let arrowSource2;
        let number2 = 0;
        if (this.state.showMore2 === 1) {
            arrowSource2 = require('./../../assets/img/icon_arrow2.png');
            number2 = 3;
        }

        if (this.state.showMore2 === 2) {
            arrowSource2 = require('./../../assets/img/icon_arrow4.png')
        }

        return (
            <View style={styles.feedbackItem}>
                <View style={styles.feedbackDetail}>
                    <Image style={styles.feedbackUserIcon} source={this.item.user_avatar ? { uri: `https://${this.item.user_avatar}` } : require('./../../assets/img/user_default.png') } />
                    <View style={styles.feedbackInfo}>
                        <View style={styles.feedbackUserInfo}>
                            <Text style={styles.feedbackName}>{this.item.user_phone}</Text>
                            <Text style={styles.feedbackDate}>{this.item.created_at}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._showMoreAction('more1')}>
                            <Text style={styles.feedbackContentText} numberOfLines={number1}>{this.item.description}</Text>
                            {
                                this.state.showMore1 !== 0 &&
                                <View style={[styles.feedbackBtn, styles.feedbackBtnHack]}>
                                    <Image style={styles.feedbackBtnIcon} source={arrowSource1} />
                                </View>
                            }
                        </TouchableOpacity>
                        <View style={styles.feedbackPic}>
                            {
                                this.item.pic.map((value, index) => {
                                    return (
                                        <TouchableOpacity key={index} activeOpacity={1} onPress={() => this.doAction(`https://${value}`)}>
                                            <Image style={styles.feedbackPicItem} source={{ uri: `https://${value}` }} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                {
                    this.state.showAnswer &&
                    <View style={styles.feedbackContent}>
                        <View style={styles.feedbackArrow}></View>
                        <View style={styles.feedbackUserInfo}>
                            <Text style={styles.feedbackName}>Balasan resmi:</Text>
                            <Text style={styles.feedbackDate}>{this.item.answer_at}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._showMoreAction('more2')}>
                            <Image style={styles.feedbackTextLeft} source={require('./../../assets/img/icon_symbol1.png')} />
                            <Text style={styles.feedbackContentText2} numberOfLines={number2}>{this.item.answer}</Text>
                            <Image style={styles.feedbackTextRight} source={require('./../../assets/img/icon_symbol2.png')} />
                            {
                                this.state.showMore2 !== 0 &&
                                <View style={styles.feedbackBtn}>
                                    <Image style={styles.feedbackBtnIcon} source={arrowSource2} />
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    feedbackItem: {
        marginBottom: PR * 25,
    },
    feedbackDetail: {
        flexDirection: 'row',
    },
    feedbackUserIcon: {
        width: PR * 34,
        height: PR * 34,
        borderRadius: PR * 34,
        marginRight: PR * 10,
        marginLeft: PR * 15,
    },
    feedbackInfo: {
        flex: 1,
    },
    feedbackUserInfo: {
        flexDirection: 'row',
    },
    feedbackName: {
        flex: 1,
        fontSize: PR * 15,
        color: '#333',
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    feedbackDate: {
        width: PR * 72,
        textAlign: 'right',
        fontSize: PR * 12,
        color: '#999',
    },
    feedbackContent: {
        marginLeft: PR * 60,
        marginTop: PR * 5,
        paddingHorizontal: PR * 15,
        paddingTop: PR * 15,
        paddingBottom: PR * 5,
        backgroundColor: '#F2F2F2',
        borderRadius: PR * 6,
    },
    feedbackContentText: {
        marginVertical: PR * 5,
        padding: 0,
        fontSize: PR * 12,
        color: '#666',
        lineHeight: PR * 18,
        textAlignVertical: 'top',
    },
    feedbackContentText2: {
        marginVertical: PR * 15,
        padding: 0,
        fontSize: PR * 12,
        color: '#ADD5C7',
        lineHeight: PR * 18,
        textAlignVertical: 'top',
    },
    feedbackPic: {
        flexDirection: 'row',
        paddingBottom: PR * 10,
        paddingTop: PR * 5,
    },
    feedbackPicItem: {
        width: PR * 78,
        height: PR * 78,
        marginRight: PR * 15,
        borderRadius: PR * 6,
    },
    feedbackBtn: {
        marginBottom: PR * 5,
        alignItems: 'flex-end',
    },
    feedbackBtnIcon: {
        width: PR * 9,
        height: PR * 6,
    },
    feedbackBtnHack: {
        marginRight: PR * 15,
    },
    feedbackArrow: {
        position: 'absolute',
        top: - PR * 14,
        left: PR * 15,
        width: 0,
        height: 0,
        borderWidth: PR * 7.5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: '#F2F2F2',
    },
    feedbackTextLeft: {
        position: 'absolute',
        top: PR * 5,
        left: 0,
        width: PR * 7,
        height: PR * 5,
    },
    feedbackTextRight: {
        position: 'absolute',
        bottom: PR * 15,
        right: 0,
        width: PR * 7,
        height: PR * 5,
    },
})

export default FeedbackItemModel;