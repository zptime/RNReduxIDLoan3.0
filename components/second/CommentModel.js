import React, { Component } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

import { FormatDate } from './../../assets/js/AppConfig';

class CommentModel extends Component {
    constructor(props) {
        super(props);

        this.item = this.props.item;
        this.doAction = this.props.doAction;

        this.state = {
            showMore: 0
        };
    }

    // 监听键盘弹出与收回
    componentDidMount() {
        this._formatData(); // 格式化数据
    }

    //注销监听
    componentWillUnmount() {}

    _formatData() {
        let showMore;
        if (this.item.content.length / 46 >= 3) {
            showMore = 1;
        }

        this.setState({ showMore });
    }

    _showMoreAction() {
        let showMore;
        if (this.state.showMore === 1) {
            showMore = 2;
        } else if (this.state.showMore === 2) {
            showMore = 1;
        }

        this.setState({ showMore });
    }

    render() {
        let arrowSource;
        let number = 0;
        if (this.state.showMore === 1) {
            arrowSource = require('./../../assets/img/icon_arrow2.png');
            number = 3;
        }

        if (this.state.showMore === 2) {
            arrowSource = require('./../../assets/img/icon_arrow4.png')
        }

        return (
            <View style={styles.commentItem}>
                <View style={styles.commentDetail}>
                    <Image style={[styles.commentUserIcon, !this.item.platform_id && { marginLeft: 0 }]} source={this.item.user_avatar ? { uri: `https://${this.item.user_avatar}` } : require('./../../assets/img/user_default.png') } />
                    <View style={styles.commentInfo}>
                        <View style={styles.commentUserInfo}>
                            <Text style={styles.commentUserName}>{this.item.user_phone}</Text>
                            <Text style={styles.commentDate}>{FormatDate(new Date(this.item.created_at * 1000), 'yyyy/MM/dd')}</Text>
                        </View>
                        <View style={styles.commentScoreInfo}>
                            <Text style={[styles.commentScoreText, styles.commentScoreLeft]}>Disetujui {this.item.approved/10}</Text>
                            <Text style={styles.commentScoreText}>Kecepatan {this.item.speed/10}</Text>
                            <Text style={[styles.commentScoreText, styles.commentScoreRight]}>Penagihan {this.item.billing/10}</Text>
                        </View>
                        <TouchableOpacity activeOpacity={1} onPress={() => this._showMoreAction()}>
                            <Text style={styles.commentContentText} numberOfLines={number}>{this.item.content}</Text>
                            {
                                this.state.showMore !== 0 &&
                                <View style={styles.commentBtn}>
                                    <Image style={styles.commentBtnIcon} source={arrowSource} />
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    this.item.platform_id &&
                    <TouchableOpacity activeOpacity={1} style={styles.productDetail} onPress={() => this.doAction(this.item)}>
                        <Image style={styles.productIcon} source={{ uri: this.item.platform_icon }} />
                        <View style={styles.productArrow}></View>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{this.item.platform_name}</Text>
                            <View style={styles.productSlogan}>
                                <Image style={styles.productSloganLeft} source={require('./../../assets/img/icon_symbol1.png')} />
                                <Text numberOfLines={1} style={styles.productSloganText}>{this.item.platform_slogan}</Text>
                                <Image style={styles.productSloganRight} source={require('./../../assets/img/icon_symbol2.png')} />
                            </View>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    commentItem: {
        marginBottom: PR * 25,
    },
    commentDetail: {
        flexDirection: 'row',
    },
    commentUserIcon: {
        width: PR * 34,
        height: PR * 34,
        borderRadius: PR * 34,
        marginRight: PR * 10,
        marginLeft: PR * 15,
    },
    commentInfo: {
        flex: 1,
    },
    commentUserInfo: {
        flexDirection: 'row',
    },
    commentUserName: {
        flex: 1,
        fontSize: PR * 15,
        color: '#333',
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    commentDate: {
        width: PR * 72,
        textAlign: 'right',
        fontSize: PR * 12,
        color: '#999',
    },
    commentScoreInfo: {
        flexDirection: 'row',
    },
    commentScoreText: {
        flex: 1,
        color: '#ADD5C7',
        fontSize: PR * 12,
        textAlign: 'center',
    },
    commentScoreLeft: {
        textAlign: 'left',
    },
    commentScoreRight: {
        textAlign: 'right',
    },
    commentContentText: {
        marginVertical: PR * 5,
        padding: 0,
        fontSize: PR * 12,
        color: '#666',
        lineHeight: PR * 18,
        textAlignVertical: 'top',
    },
    commentBtn: {
        marginBottom: PR * 5,
        alignItems: 'flex-end',
    },
    commentBtnIcon: {
        width: PR * 9,
        height: PR * 6,
    },
    productDetail: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
        borderRadius: PR * 6,
        padding: PR * 15,
        marginTop: PR * 5,
    },
    productIcon: {
        width: PR * 34,
        height: PR * 34,
        borderRadius: PR * 34,
        marginRight: PR * 10,
    },
    productArrow: {
        position: 'absolute',
        top: - PR * 15,
        left: PR * 15,
        width: 0,
        height: 0,
        borderWidth: PR * 7.5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: '#F2F2F2',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: PR * 15,
        color: '#333',
        fontWeight: 'bold',
    },
    productSlogan: {
        marginTop: PR * 5,
    },
    productSloganText: {
        color: '#ADD5C7',
        fontSize: PR * 12,
        textAlign: 'center',
        marginHorizontal: PR * 10,
    },
    productSloganLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: PR * 7,
        height: PR * 5,
    },
    productSloganRight: {
        position: 'absolute',
        bottom: -PR * 5,
        right: 0,
        width: PR * 7,
        height: PR * 5,
    },
})

export default CommentModel;