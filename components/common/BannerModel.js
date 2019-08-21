import React, { Component } from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Dimensions } from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { PR } from './../../assets/css/AppStyles';

class BannerModel extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;
        this.doAction = this.props.doAction;

        this.state = {
            activeSlide: 0,
        };
    }

    componentDidMount() {}

    componentWillUnmount() { }

    render() {
        return (
            <View style={styles.bannerWrap}>
                <Carousel
                    data={this.data}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={Dimensions.get('window').width}
                    loop={true}
                    autoplay={true}
                    useScrollView={true}
                    onSnapToItem={index => this.setState({ activeSlide: index })}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity activeOpacity={1} key={index} onPress={() => this.doAction(item)}>
                                <Image style={styles.bannerImg} source={{ uri: item.image_url }} />
                            </TouchableOpacity>
                        );
                    }}
                />
                <Pagination
                    dotsLength={this.data.length}
                    activeDotIndex={this.state.activeSlide}
                    containerStyle={styles.dotWrap}
                    dotStyle={styles.dotItem}
                    inactiveDotStyle={{
                        // Define styles for inactive dots here
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bannerWrap: {
        height: PR * 84,
    },
    bannerImg: {
        alignSelf: 'center',
        width: PR * 335,
        height: PR * 84,
        borderRadius: PR * 14,
    },
    dotWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingVertical: PR * 2,
    },
    dotItem: {
        width: PR * 6,
        height: PR * 6,
        borderRadius: PR * 6,
        backgroundColor: '#fff',
    },
})

export default BannerModel;