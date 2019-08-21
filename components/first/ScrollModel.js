import React from 'react';
import { View, Image, Text, Dimensions, StyleSheet } from 'react-native';

import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';

import { PR } from './../../assets/css/AppStyles';

const ScrollModel = ({data}) => {
    return (
        <View style={styles.scrollWrap}>
            <Image style={styles.scrollIcon} source={require('./../../assets/img/icon_notice.png')} />
            <Carousel
                data={data}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width}
                loop={true}
                autoplay={true}
                useScrollView={true}
                scrollEnabled={false}
                renderItem={({item, index}) => {
                    return (
                        <View key={index}>
                            <Text numberOfLines={1} style={styles.scrollText}>{`${item.phone} Berhasil pinjam Rp ${item.loan_amount} di ${item.plat_name}`}</Text>
                        </View>
                    );
                }}
            />
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['rgba(242, 242, 242, 0)', 'rgba(242, 242, 242, 1)']} style={styles.scrollHack} />
        </View>
    );
}

const styles = StyleSheet.create({
    scrollWrap: {
        flexDirection: 'row',
        height: PR * 44,
        backgroundColor: '#f2f2f2',
        borderRadius: PR * 6,
        marginHorizontal: PR * 20,
        marginBottom: PR * 10,
        alignItems: 'center',
        overflow: 'hidden',
    },
    scrollIcon: {
        width: PR * 19,
        height: PR * 19,
        marginHorizontal: PR * 10,
    },
    scrollText: {
        fontSize: PR * 12,
        color: '#999',
    },
    scrollHack: {
        position: 'absolute',
        top: 0,
        right:0,
        bottom: 0,
        width: PR * 88,
    },
})

export default ScrollModel;