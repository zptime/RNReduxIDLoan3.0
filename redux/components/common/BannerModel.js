import React, { Component } from 'react';
// import PropTypes from 'prop-types'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { PR } from '../../../assets/css/AppStyles';

class BannerModel extends Component {
    // static propTypes = {
    //     data: PropTypes.arrayOf(
    //         PropTypes.shape({
    //             id: PropTypes.string.isRequired,
    //             image_url: PropTypes.string.isRequired,
    //             title: PropTypes.string.isRequired
    //         }).isRequired
    //     ).isRequired,
    // };

    constructor(props){
        super(props);
        this.state = {
            activeSlide: 0,
            data: [{
                id: "WpIAc9by5iU",
                image_url: require('../../../assets/img/icon_upload2.png'),
                title: "Led Zeppelin - Stairway To Heaven"
            }, {
                id: "sNPnbI1arSE",
                image_url: require('../../../assets/img/icon_upload3.png'),
                title: "Eminem - My Name Is"
            }, {
                id: "VOgFZfRVaww",
                image_url: require('../../../assets/img/icon_upload4.png'),
                title: "hahahhahha"
            }]
        };
        this.props = props;
        this._carousel = {};
    }

    _renderItem = ( {item, index} ) => {
        // console.log("rendering,", index, item)
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => this._onPressButton(index)} style={styles.bannerItem}>
                <Image style={styles.bannerImg} source={item.image_url}/>
                <Text style={styles.bannerTitle}>{item.title}</Text>
            </TouchableOpacity>
        );
    }

    _handleSnapToItem(index){
        console.log("snapped to ", index)
        this.setState({ activeSlide: index })
    }

    _onPressButton(index){
        console.log("clicked to index", index)
        // this._carousel.snapToItem(index);
    }

    render() {
        return (
            <View style={styles.bannerWrap}>
                <Carousel
                    ref={ (c) => { this._carousel = c; } }
                    data={this.state.data}
                    renderItem={this._renderItem.bind(this)}
                    onSnapToItem={this._handleSnapToItem.bind(this)}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                    loop={true}
                    autoplay={true}
                    useScrollView={true}
                />
                <Pagination
                    dotsLength={this.state.data.length}
                    activeDotIndex={this.state.activeSlide}
                    containerStyle={styles.dotWrap}
                    dotStyle={styles.dotItem}
                    inactiveDotOpacity={0.5}
                    inactiveDotScale={0.8}
                    carouselRef={this._carousel}
                    tappableDots={!!this._carousel}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bannerWrap: {
        height: 84 * PR,
        marginVertical: 20 * PR,
    },
    bannerItem: {
        position: 'relative',
        paddingHorizontal: 10 * PR,
    },
    bannerImg: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 14 * PR,
    },
    bannerTitle: {
        position: 'absolute',
        top: 10 * PR,
        left: 30 * PR,
        color: '#fff',
        fontSize: 14 * PR,
        fontWeight: 'bold',
    },
    dotWrap: {
        position:'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingVertical: 2 * PR,
        marginBottom: 5 * PR,
    },
    dotItem: {
        width: 6 * PR,
        height: 6 * PR,
        borderRadius: 6 * PR,
        backgroundColor: '#fff',
    },
})

export default  BannerModel;