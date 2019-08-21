import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator, createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';

import { MainStyles } from './../assets/css/AppStyles';

import TabBarModel from './components/common/TabBarModel';

import FirstScreen from './pages/screen/FirstScreen';
import SecondScreen from './pages/screen/SecondScreen';
import LastScreen from './pages/screen/LastScreen';

import CameraModel from './components/model/CameraModel';
import VideoModel from './components/model/VideoModel';
import AudioModel from './components/model/AudioModel';

// 通用页面
const ScreenConfig = {
    Camera: CameraModel,
    Video: VideoModel,
    Audio: AudioModel,
}

const FirstStack = createStackNavigator({
        First: FirstScreen
    }, {
        // headerMode: 'none' // 不带标题栏
    });

const SecondStack = createStackNavigator({
        Second: SecondScreen
    }, {
        headerMode: 'none'
    });

const LastStack = createStackNavigator(Object.assign({
        Last: LastScreen,
    }, ScreenConfig), {
        headerMode: 'none'
    });

const DrawerNavigator = createDrawerNavigator({
    First: FirstStack,
    Second: SecondStack,
    Last: LastStack
});

const TabNavigator = createBottomTabNavigator({
        First: FirstStack,
        Second: SecondStack,
        Last: LastStack
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            const { routeName } = navigation.state;

            let tabBarVisible = true;
            if (navigation.state.index > 0) {
                tabBarVisible = false;
            }

            let tabBarLabel = ''
            if (routeName === 'First') {
                tabBarLabel = '首页';
            }
            if (routeName === 'Second') {
                tabBarLabel = '聊天';
            }
            if (routeName === 'Last') {
                tabBarLabel = '通知';
            }

            return {
                tabBarLabel,
                tabBarIcon: ({ focused }) => {
                    let source = ''
                    if (routeName === 'First') {
                        source = focused ? require('./../assets/img/icon_first_active.png') : require('./../assets/img/icon_first.png')
                    }
                    if (routeName === 'Second') {
                        source = focused ? require('./../assets/img/icon_second_active.png') : require('./../assets/img/icon_second.png')
                    }
                    if (routeName === 'Last') {
                        source = focused ? require('./../assets/img/icon_last_active.png') : require('./../assets/img/icon_last.png')
                    }

                    return (
                        <Image style={MainStyles.menuIcon} source={source} />
                    )
                },
                tabBarVisible
            }
        },
        tabBarOptions: {
            activeTintColor: '#24D29B',
            inactiveTintColor: 'rgba(67, 213, 159, 0.5)',
            style: MainStyles.menuModel,
            tabStyle: MainStyles.menuItem,
            labelStyle: MainStyles.menuText
        },
        tabBarComponent: props => <TabBarModel {...props} />,
        initialRouteName: 'Last', // 初始化路由
    });

export default createAppContainer(TabNavigator);