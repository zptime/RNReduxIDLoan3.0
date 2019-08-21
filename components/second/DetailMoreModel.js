import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

const DetailMoreModel = ({ data }) => {
    return (
        <View style={styles.detailWrap}>
            {
                data.condition && data.condition.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Kondisi pinjaman</Text>
                    </View>
                    <View style={styles.detailContent}>
                        {
                            data.condition.map((item, index) => {
                                return (
                                    <Text key={index} style={styles.detailContentText}>{item}</Text>
                                )
                            })
                        }
                    </View>
                </View>
            }
            {
                data.visible_cities.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Area jangkauan</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.visible_cities}</Text>
                    </View>
                </View>
            }
            {
                data.day_rate.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Bunga</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.day_rate}%</Text>
                    </View>
                </View>
            }
            {
                data.success_rate > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Tingkat lulus</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.success_rate}%</Text>
                    </View>
                </View>
            }
            {
                data.disbursement_time.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Waktu pencairan dana</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.disbursement_time}</Text>
                    </View>
                </View>
            }
            {
                data.repayment_type.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Jenis pelunasan</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.repayment_type}</Text>
                    </View>
                </View>
            }
            {
                data.repayment_method.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Metode pelunasan</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.repayment_method}</Text>
                    </View>
                </View>
            }
            {
                data.repayment_interest.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Bunga pelunasan</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.repayment_interest}</Text>
                    </View>
                </View>
            }
            {
                data.late_charge.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Denda keterlambatan</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.late_charge}</Text>
                    </View>
                </View>
            }
            {
                data.payment_time.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Waktu konfirmasi pembayaran kembali</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.payment_time}</Text>
                    </View>
                </View>
            }
            {
                data.bill_method.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Cara penagihan</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.bill_method}</Text>
                    </View>
                </View>
            }
            {
                data.bill_rate.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Tingkat penagihan</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.bill_rate}</Text>
                    </View>
                </View>
            }
            {
                data.company.length > 0 &&
                <View style={styles.detailItem}>
                    <View style={styles.detailTitle}>
                        <Text style={styles.detailTitleText}><Image source={require('./../../assets/img/icon_dot.png')} style={styles.detailTitleDot} /> Nama perusahaan</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.detailContentText}>{data.company}</Text>
                    </View>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    detailWrap: {
        paddingBottom: PR * 10,
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
    detailContent: {
        paddingHorizontal: PR * 10,
    },
    detailContentText: {
        fontSize: PR * 12,
        color: '#666',
        lineHeight: PR * 18,
    },
})

export default DetailMoreModel;