import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PR } from '../../../assets/css/AppStyles';

import PropTypes from 'prop-types';

class TitleModel extends Component {
    static propTypes = {
        data: PropTypes.shape({
            title: PropTypes.string.isRequired,
            subtitle: PropTypes.string.isRequired,
            isOperate: PropTypes.bool.isRequired
        }).isRequired,
        doAction: PropTypes.func
    };

    constructor(props){
        super(props);

        this.data = this.props.data;
        this.doAction = this.props.doAction;
    }

    render() {
        return (
            <View style={styles.titleWrap}>
                <Text style={styles.titleText}>{this.data.title}</Text>
                <Text style={styles.subTitleText}>{this.data.subtitle}</Text>
                {
                    this.data.isOperate &&
                    <TouchableOpacity style={styles.titleBtn} activeOpacity={1} onPress={() => this.doAction()}>
                        <Image style={styles.titleArrow} source={require('../../../assets/img/mask/icon_arrow4.png')}/>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    titleText: {
        color: '#3E587B',
        fontSize: 21 * PR,
        fontWeight: 'bold',
        marginRight: 10 * PR,
    },
    subTitleText: {
        color: '#8AA2C3',
        fontSize: 18 * PR,
    },
    titleBtn: {
        position: 'absolute',
        right: 0,
    },
    titleArrow: {
        width: 10 * PR,
        height: 15 * PR,
    },
})

export default  TitleModel;