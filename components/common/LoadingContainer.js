import React, { Component } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import { PR } from './../../assets/css/AppStyles';

class LoadingContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spinValue: new Animated.Value(0)
        };
    }

    componentDidMount() {
        this._spin();
    }

    _spin() {
        this.state.spinValue.setValue(0);
        Animated.timing(
            this.state.spinValue,
            {
                toValue: 360,
                duration: 1000
            }
        ).start(() => this._spin());
    }

    render() {
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 360],//输入值
            outputRange: ['0deg', '360deg'] //输出值
        })
        return (
            <View style={styles.loadingModel}>
                <View style={styles.loadContent}>
                    <Animated.Image
                        style={[
                            styles.loadRotate,
                            { transform: [{rotate: spin }] }
                        ]}
                        source={require('./../../assets/img/icon_loading.png')}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loadingModel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)'
    },
    loadContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: PR * 180,
        height: PR * 90,
        borderRadius: PR * 12,
        backgroundColor: 'rgba(0, 0, 0, .7)'
    },
    loadRotate: {
        width: PR * 38,
        height: PR * 38
    },
})

export default LoadingContainer;