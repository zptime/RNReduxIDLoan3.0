import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

import NothingModel from './../common/NothingModel';
import CommentModel from './../second/CommentModel';
import ScoreModel from './../second/ScoreModel';

const DetailCommentModel = ({ detailData, commentData, doAction }) => {
    return (
        <View style={styles.detailWrap}>
            <View style={styles.detailItem}>
                <View style={styles.detailTitle}>
                    <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Komentar <Text style={styles.detailTitleColor}>({detailData.evaluate.count})</Text></Text>
                    {
                        detailData.evaluate.count > 3 &&
                        <Text style={styles.detailTitleBtn} onPress={() => doAction()}>semua</Text>
                    }
                </View>
                <View style={styles.detailContent}>
                    {
                        commentData.length === 0 &&
                        <NothingModel />
                    }
                    {
                        commentData.length > 0 &&
                        <View style={styles.detailComment}>
                            <ScoreModel data={detailData.evaluate} />
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={commentData}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => <CommentModel item={item} />}
                            />
                        </View>
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    detailWrap: {
        borderTopColor: '#F2F2F2',
        borderTopWidth: PR * 10,
        paddingTop: PR * 10,
    },
    detailItem: {
        marginBottom: PR * 10,
    },
    detailTitleDot: {
        width: PR * 6,
        height: PR * 6,
    },
    detailTitleText: {
        fontSize: PR * 18,
        color: '#ADD5C7',
        fontWeight: 'bold',
    },
    detailTitleColor: {
        color: '#333',
        fontSize: PR * 15,
        fontWeight: 'normal',
    },
    detailTitleBtn: {
        position: 'absolute',
        right: 0,
        marginTop: PR * 2,
        width: PR * 50,
        height: PR * 22,
        paddingTop: PR * 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: PR * 12,
        backgroundColor: '#ADD5C7',
        borderRadius: PR * 22,
    },
    detailContent: {
        paddingTop: PR * 10,
        paddingHorizontal: PR * 10,
    },
    detailComment: {},
})

export default DetailCommentModel;