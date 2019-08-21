import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import { MainStyles } from './../assets/css/AppStyles';

import FirstScreen from './../pages/FirstScreen';
import CategoryScreen from './../pages/FirstScreen/CategoryScreen';
import SecondScreen from './../pages/SecondScreen';
import DefultDetailScreen from './../pages/SecondScreen/DefultDetailScreen';
import ApiDetailScreen from './../pages/SecondScreen/ApiDetailScreen';
import FeedbackScreen from './../pages/SecondScreen/FeedbackScreen';
import AuthDetailScreen from './../pages/SecondScreen/AuthDetailScreen';
import ProductDetailScreen from './../pages/SecondScreen/ProductDetailScreen';
import ProductCommentScreen from './../pages/SecondScreen/ProductCommentScreen';
import SubmitCommentScreen from './../pages/SecondScreen/SubmitCommentScreen';
import OrderConfirmScreen from './../pages/SecondScreen/OrderConfirmScreen';
import FAQScreen from './../pages/SecondScreen/FAQScreen';
import LastScreen from './../pages/LastScreen';
import UserInfoScreen from './../pages/LastScreen/UserInfoScreen';
import OrderListScreen from './../pages/LastScreen/OrderListScreen';
import OrderDetailScreen from './../pages/LastScreen/OrderDetailScreen';
import BindCardScreen from './../pages/LastScreen/BindCardScreen';
import CommentListScreen from './../pages/LastScreen/CommentListScreen';
import DownloadScreen from './../pages/LastScreen/DownloadScreen';
import FeedbackListScreen from './../pages/LastScreen/FeedbackListScreen';
import SetScreen from './../pages/LastScreen/SetScreen';
import ContactusScreen from './../pages/LastScreen/ContactusScreen';
import PrivacyScreen from './../pages/LastScreen/PrivacyScreen';
import LoginScreen from './../pages/LoginScreen';
import WebViewScreen from './../pages/WebViewScreen';

// 通用页面
const ScreenConfig = {
    DefultDetail: DefultDetailScreen,
    ApiDetail: ApiDetailScreen,
    AuthDetail: AuthDetailScreen,
    OrderConfirm: OrderConfirmScreen,
    OrderDetail: OrderDetailScreen,
    BindCard: BindCardScreen,
    Feedback: FeedbackScreen,
    FAQ: FAQScreen,
    ProductDetail: ProductDetailScreen,
    ProductComment: ProductCommentScreen,
    Login: LoginScreen,
    WebView: WebViewScreen,
}

const FirstStack = createStackNavigator(Object.assign({
        First: FirstScreen,
        Category: CategoryScreen,
        SubmitComment: SubmitCommentScreen,
    }, ScreenConfig), {
        headerMode: 'none'
    });

const SecondStack = createStackNavigator(Object.assign({
        Second: SecondScreen,
        SubmitComment: SubmitCommentScreen,
    }, ScreenConfig), {
        headerMode: 'none'
    });

const LastStack = createStackNavigator(Object.assign({
        Last: LastScreen,
        UserInfo: UserInfoScreen,
        OrderList: OrderListScreen,
        CommentList: CommentListScreen,
        Download: DownloadScreen,
        FeedbackList: FeedbackListScreen,
        Set: SetScreen,
        Contactus: ContactusScreen,
        Privacy: PrivacyScreen,
    }, ScreenConfig), {
        headerMode: 'none'
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
                tabBarLabel = 'BERANDA';
            }
            if (routeName === 'Second') {
                tabBarLabel = 'PINJAMAN';
            }
            if (routeName === 'Last') {
                tabBarLabel = 'SAYA';
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
            inactiveTintColor: '#999',
            style: MainStyles.menuModel,
            tabStyle: MainStyles.menuItem,
            labelStyle: MainStyles.menuText
        },
    });

export default createAppContainer(TabNavigator);