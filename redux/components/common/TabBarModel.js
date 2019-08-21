import React, { Component } from 'react';
import { Platform, Keyboard } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';
/*
 * 问题：android中，当界面中有输入框，唤起软键盘的时候位于底部的tab bar也会浮动到键盘的上方
 * 解决：当键盘唤起的时候让tab bar不可见，当键盘消失当时候再让tab bar显示出来
 * Keyboard模块专门用来处理键盘事件。通过这个模块我们就可以得知键盘要唤起，还是要消失。
 * keyboardDidShow 键盘即将出现
 * keyboardDidHide 键盘即将隐藏
*/

class TabBarModel extends Component {
    state = {
        visible: true
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.keyboardEventListeners = [
                Keyboard.addListener('keyboardDidShow', this.visible(false)),
                Keyboard.addListener('keyboardDidHide', this.visible(true))
            ];
        }
    }

    componentWillUnmount() {
        this.keyboardEventListeners && this.keyboardEventListeners.forEach((eventListener) => eventListener.remove());
    }

    visible = visible => () => this.setState({ visible });

    render() {
        return this.state.visible && <BottomTabBar {...this.props} />;
    }
}

export default TabBarModel;