import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const getScore = (score) => {
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
};

const ScoreModel = ({ data }) => {
    let score1 = getScore(data.approved);
    let score2 = getScore(data.speed);
    let score3 = getScore(data.billing);

    return (
        <View style={styles.scoreWrap}>
            <Text style={styles.scoreSummary}>{data.summary/10}</Text>
            <Image style={styles.scoreIcon} source={require('./../../assets/img/icon_score3.png')} />
            <View style={styles.scoreValue}>
                <View style={styles.scoreValueItem}>
                    <Text style={styles.scoreValueName}>Disetujui</Text>
                    {
                        score1.map((item, index) => {
                            let source;
                            if (item === 1) {
                                source = require('./../../assets/img/icon_score.png');
                            }

                            if (item === 0) {
                                source = require('./../../assets/img/icon_score2.png');
                            }

                            return <Image key={index} style={styles.scoreStar} source={source} />
                        })
                    }
                    <Text style={styles.scoreValueNumber}>{data.approved/10}</Text>
                </View>
                <View style={[styles.scoreValueItem, styles.scoreValueItemHack]}>
                    <Text style={styles.scoreValueName}>Kecepatan</Text>
                    {
                        score2.map((item, index) => {
                            let source;
                            if (item === 1) {
                                source = require('./../../assets/img/icon_score.png');
                            }

                            if (item === 0) {
                                source = require('./../../assets/img/icon_score2.png');
                            }

                            return <Image key={index} style={styles.scoreStar} source={source} />
                        })
                    }
                    <Text style={styles.scoreValueNumber}>{data.speed / 10}</Text>
                </View>
                <View style={styles.scoreValueItem}>
                    <Text style={styles.scoreValueName}>Penagihan</Text>
                    {
                        score3.map((item, index) => {
                            let source;
                            if (item === 1) {
                                source = require('./../../assets/img/icon_score.png');
                            }

                            if (item === 0) {
                                source = require('./../../assets/img/icon_score2.png');
                            }

                            return <Image key={index} style={styles.scoreStar} source={source} />
                        })
                    }
                    <Text style={styles.scoreValueNumber}>{data.billing / 10}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scoreWrap: {
        flexDirection: 'row',
        backgroundColor: 'rgba(173, 213, 199, 0.22)',
        borderRadius: PR * 6,
        paddingVertical: PR * 20,
        paddingHorizontal: PR * 10,
        marginTop: PR * 10,
        marginBottom: PR * 20,
        alignItems: 'center',
    },
    scoreSummary: {
        marginHorizontal: PR * 5,
        fontSize: PR * 36,
        color: '#FCCF33',
        fontWeight: 'bold',
    },
    scoreValueItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreValueItemHack: {
        paddingVertical: PR * 6,
    },
    scoreIcon: {
        width: PR * 10,
        height: PR * 70,
        marginHorizontal: PR * 10,
    },
    scoreValueName: {
        width: PR * 65,
        fontSize: PR * 12,
        color: '#ADD5C7',
        fontWeight: 'bold',
    },
    scoreStar: {
        width: PR * 16,
        height: PR * 15,
        marginHorizontal: PR * 2,
    },
    scoreValueNumber: {
        marginLeft: PR * 5,
        fontSize: PR * 15,
        color: '#FCCF33',
        fontWeight: 'bold',
    },
})

export default ScoreModel;