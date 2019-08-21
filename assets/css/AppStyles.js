import { Dimensions, StyleSheet } from 'react-native';

const PR = Dimensions.get('window').width / 375;

const Colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD',
};

// 全局样式
const MainStyles = StyleSheet.create({
    mainModel: {
        flex: 1,
    },
    mainTitle: {
        paddingHorizontal: PR * 20,
        marginBottom: PR * 10,
    },
    mainTitleText: {
        fontSize: PR * 20,
        color: '#333',
        fontWeight: 'bold',
    },
    menuModel: {
        borderTopColor: '#f2f2f2',
    },
    menuItem: {
        paddingVertical: PR * 5,
    },
    menuIcon: {
        width: PR * 22,
        height: PR * 22,
    },
    menuText: {
        fontSize: PR * 11,
    }
});

// First
const FirstStyles = StyleSheet.create({
    listWrap: {
        marginHorizontal: PR * 20,
    },
    listHack: {
        height: PR * 10,
    },
    nothingWrap: {
        height: Dimensions.get('window').height - PR * 150,
    },
})

// Second
const SecondStyles = StyleSheet.create({
    listWrap: {
        marginTop: PR * 10,
        marginHorizontal: PR * 20,
    },
    listHack: {
        height: PR * 10,
    },
    scoreWrap: {
        marginHorizontal: PR * 20,
    },
    detailTab: {
        paddingHorizontal: PR * 20,
        backgroundColor: '#FFF',
    },
    detailMore: {
        paddingHorizontal: PR * 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailMoreText: {
        backgroundColor: '#CDE5DD',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: PR * 102,
        height: PR * 42,
        color: '#FFF',
        fontSize: PR * 15,
        fontWeight: 'bold',
        borderRadius: PR * 6,
    },
    detailMoreArrow: {
        width: PR * 6,
        height: PR * 9,
    },
    detailContainer: {
        paddingVertical: PR * 10,
        paddingHorizontal: PR * 20,
    },
    detailItem: {
        marginBottom: PR * 10,
    },
    detailItemLine: {
        backgroundColor: '#F2F2F2',
        height: PR * 10,
    },
    detailService: {
        position: 'absolute',
        right: PR * 20,
        top: '50%',
        marginTop: -PR * 10,
    },
    detailServiceIcon: {
        width: PR * 17,
        height: PR * 20,
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
    detailTitleColor: {
        color: '#333',
        fontSize: PR * 15,
        fontWeight: 'normal',
    },
    detailTitleBtn: {
        position: 'absolute',
        right: 0,
        marginTop: PR * 2,
        width: PR * 50,
        height: PR * 22,
        paddingTop: PR * 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: PR * 12,
        backgroundColor: '#ADD5C7',
        borderRadius: PR * 22,
    },
    detailContent: {
        paddingHorizontal: PR * 10,
    },
    btnComment: {
        position: 'absolute',
        right: PR * 20,
        bottom: PR * 70,
        width: PR * 39,
        height: PR * 39,
    },
    btnCommentIcon: {
        width: PR * 39,
        height: PR * 39,
    },
    downloadBtn: {
        height: PR * 48,
        backgroundColor: '#24D29B',
        color: '#FFF',
        fontSize: PR * 17,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    recommendDetail: {
        backgroundColor: '#F2F2F2',
        borderRadius: PR * 6,
        flexDirection: 'row',
        padding: PR * 20,
        marginVertical: PR * 10,
        marginHorizontal: PR * 20,
    },
    recommendInfoIcon: {
        width: PR * 79,
        height: PR * 64,
        marginRight: PR * 20,
    },
    recommendInfo: {
        flex: 1,
    },
    recommendName: {
        fontSize: PR * 15,
        color: '#666',
        fontWeight: 'bold',
    },
    recommendText: {
        fontSize: PR * 12,
        color: '#999',
    },
    recommendList: {
        marginHorizontal: PR * 20,
        paddingBottom: PR * 10,
    },
    FAQTabWrap: {
        flexDirection: 'row',
        marginHorizontal: PR * 20,
        overflow: 'hidden',
    },
    FAQTabItem: {
        borderRadius: PR * 34,
    },
    FAQTabItemActive: {
        backgroundColor: '#24D29B',
    },
    FAQTabText: {
        fontSize: PR * 18,
        color: '#333',
        fontWeight: 'bold',
        lineHeight: PR * 34,
        paddingHorizontal: PR * 10,
    },
    FAQTabTextHack: {
        color: '#FFF',
    },
    FAQTabMask: {
        position: 'absolute',
        top: 0,
        right: -PR * 1,
        bottom: 0,
        width: PR * 22,
    },
    FAQListItem: {
        marginBottom: PR * 20,
    },
    FAQListItemTitle: {
        fontSize: PR * 15,
        color: '#666',
        lineHeight: PR * 24,
        fontWeight: 'bold',
        paddingLeft: PR * 35,
        marginBottom: PR * 10,
    },
    FAQListItemText: {
        fontSize: PR * 15,
        color: '#666',
        lineHeight: PR * 24,
        paddingLeft: PR * 35,
    },
    FAQListItemIcon: {
        position: 'absolute',
        top: PR * 2,
        left: 0,
        width: PR * 21,
        height: PR * 22,
    },
    FAQBtn: {
        height: PR * 48,
        backgroundColor: '#24D29B',
        color: '#FFF',
        fontSize: PR * 17,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
})

// Last
const LastStyles = StyleSheet.create({
    lastModel: {
        flex: 1,
    },
    listWrap: {
        marginVertical: PR * 10,
        marginHorizontal: PR * 20,
    },
    userInfoItem: {
        marginHorizontal: PR * 20,
        marginBottom: PR * 10,
        backgroundColor: '#EDF6F3',
        borderRadius: PR * 6,
        padding: PR * 15,
        justifyContent: 'center',
    },
    userInfoItemHack: {
        height: PR * 81,
    },
    userInfoText: {
        fontSize: PR * 15,
        color: '#333',
        fontWeight: 'bold',
    },
    userInfoValue: {
        flexDirection: 'row',
        position: 'absolute',
        right: PR * 15,
        alignItems: 'center',
    },
    userInfoIcon: {
        width: PR * 51,
        height: PR * 51,
        borderRadius: PR * 51,
        marginRight: PR * 10,
    },
    userInfoArrow: {
        width: PR * 6,
        height: PR * 9,
    },
    userInfoPhone: {
        fontSize: PR * 15,
        color: '#3ACA9C',
        fontWeight: 'bold',
    },
    logoutBtn: {
        position: 'absolute',
        right: PR * 20,
        bottom: PR * 20,
        left: PR * 20,
        height: PR * 48,
        borderWidth: PR * 1,
        borderColor: '#24D29B',
        borderRadius: PR * 48,
        justifyContent: 'center',
    },
    logoutText: {
        textAlign: 'center',
        fontSize: PR * 17,
        color: '#24D29B',
    },
    setContent: {
        paddingTop: PR * 10,
        paddingHorizontal: PR * 20,
    },
    setContentIcon: {
        width: PR * 79,
        height: PR * 79,
        marginBottom: PR * 10,
        borderRadius: PR * 79,
    },
    setContentName: {
        fontSize: PR * 20,
        color: '#666',
        fontWeight: 'bold',
    },
    setContentText: {
        fontSize: PR * 15,
        color: '#666',
        lineHeight: PR * 24,
    },
    contactus: {
        marginVertical: PR * 20,
    },
    contactusItem: {
        flexDirection: 'row',
        paddingVertical: PR * 10,
    },
    contactusItemName: {
        width: PR * 70,
        fontSize: PR * 15,
        color: '#24D29B',
        fontWeight: 'bold',
        lineHeight: PR * 24,
    },
    contactusItemText: {
        flex: 1,
        fontSize: PR * 15,
        color: '#666',
        fontWeight: 'bold',
        lineHeight: PR * 24,
    },
    privacyContentItem: {
        paddingHorizontal: PR * 20,
        marginBottom: PR * 10,
    },
    privacyContentTitle: {
        fontSize: PR * 14,
        color: '#ADD5C7',
        fontWeight: 'bold',
    },
    privacyContentText: {
        marginTop: PR * 5,
        fontSize: PR * 12,
        color: '#999',
    },
    orderTabWrap: {
        flexDirection: 'row',
        marginHorizontal: PR * 20,
        overflow: 'hidden',
    },
    orderTabItem: {
        borderRadius: PR * 34,
        marginRight: PR * 5,
    },
    orderTabItemActive: {
        backgroundColor: '#24D29B',
    },
    orderTabText: {
        fontSize: PR * 18,
        color: '#333',
        fontWeight: 'bold',
        lineHeight: PR * 34,
        paddingHorizontal: PR * 10,
    },
    orderTabTextHack: {
        color: '#FFF',
    },
    orderTabMask: {
        position: 'absolute',
        top: 0,
        right: -PR * 1,
        bottom: 0,
        width: PR * 22,
    },
    orderProduct: {
        flexDirection: 'row',
        marginHorizontal: PR * 20,
        alignItems: 'center',
    },
    orderProductIcon: {
        width: PR * 33,
        height: PR * 33,
        borderRadius: PR * 33,
        marginRight: PR * 10,
    },
    orderProductText: {
        fontSize: PR * 15,
        color: '#333',
    },
    orderState: {
        backgroundColor: '#EDF6F3',
        marginVertical: PR * 10,
        marginHorizontal: PR * 20,
        borderRadius: PR * 6,
        padding: PR * 15
    },
    orderStateInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: PR * 10,
    },
    orderStateName: {
        paddingVertical: PR * 2,
        fontSize: PR * 18,
        color: '#ADD5C7',
        fontWeight: 'bold',
        borderBottomColor: '#ADD5C7',
        borderBottomWidth: PR * 2,
    },
    orderStateMore: {
        paddingHorizontal: PR * 5,
        backgroundColor: '#ADD5C7',
        lineHeight: PR * 22,
        borderRadius: PR * 22,
        color: '#FFF',
        fontSize: PR * 12,
        fontWeight: 'bold',
    },
    orderStateText: {
        marginTop: PR * 5,
        color: '#ADD5C7',
        fontSize: PR * 13,
    },
    orderConfirmWrap: {
        paddingBottom: PR * 20,
        marginHorizontal: PR * 20,
    },
    orderConfirmModel: {
        backgroundColor: '#F2F2F2',
        borderRadius: PR * 6,
        padding: PR * 15,
        marginTop: PR * 10,
    },
    orderConfirmItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: PR * 40,
    },
    orderConfirmItemName: {
        marginRight: PR * 10,
        fontSize: PR * 15,
        color: '#ADD5C7',
    },
    orderConfirmItemValue: {
        flex: 1,
        textAlign: 'right',
        fontSize: PR * 15,
        color: '#666',
    },
    orderConfirmItemValueHack: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    orderConfirmContracts: {
        color: '#24D29B',
        fontSize: PR * 15,
        marginLeft: PR * 2,
    },
    orderConfirmHint: {
        paddingVertical: PR * 20,
        flexDirection: 'row',
    },
    orderConfirmHintIcon: {
        width: PR * 14,
        height: PR * 14,
        marginHorizontal: PR * 10,
    },
    orderConfirmHintText: {
        flex: 1,
        fontSize: PR * 12,
        color: '#ADD5C7',
        lineHeight: PR * 15,
    },
    orderDetailAction: {
        height: PR * 48,
        backgroundColor: '#24D29B',
        color: '#FFF',
        fontSize: PR * 17,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    hotProductWrap: {
        marginHorizontal: PR * 20,
    },
    submitAction: {
        backgroundColor: '#24D29B',
        borderRadius: PR * 48
    },
    submitText: {
        color: '#fff',
        fontSize: PR * 17,
        textAlign: 'center',
        lineHeight: PR * 48
    },
})

// Feedback
const FeedbackStyles = StyleSheet.create({
    feedbackContainer: {
        paddingHorizontal: PR * 20
    },
    feedbackItem: {
        marginBottom: PR * 20,
    },
    feedbackTitleDot: {
        width: PR * 6,
        height: PR * 6,
    },
    feedbackTitleText: {
        fontSize: PR * 18,
        color: '#ADD5C7',
        fontWeight: 'bold',
    },
    feedbackContent: {
        paddingHorizontal: PR * 10,
    },
    feedbackDetail: {
        marginTop: PR * 15,
        paddingHorizontal: PR * 15,
        paddingVertical: PR * 10,
        height: PR * 134,
        backgroundColor: '#EDF6F3',
        borderRadius: PR * 6,
        textAlignVertical: 'top',
    },
    uploadList: {
        flexDirection: 'row',
        marginTop: PR * 10,
        marginLeft: PR * 10,
    },
    uploadItem: {
        width: PR * 84,
        height: PR * 84,
        borderRadius: PR * 6,
        overflow: 'hidden',
        marginRight: PR * 10,
    },
    itemImg: {
        width: PR * 84,
        height: PR * 84
    },
    itemDel: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: PR * 28,
        height: PR * 28,
        alignItems: 'flex-end'
    },
    itemDelIcon: {
        width: PR * 14,
        height: PR * 14,
    },
    itemAdd: {
        width: PR * 84,
        height: PR * 84,
    },
    feedbackContact: {
        padding: PR * 10,
        borderBottomWidth: PR* 1,
        borderBottomColor: '#F2F2F2',
        color: '#333',
        fontSize: PR * 15,
    },
    feedbackTip: {
        marginHorizontal: PR * 10,
        marginBottom: PR * 20,
        fontSize: PR * 13,
        lineHeight: PR * 18,
        color: '#ADD5C7'
    },
    submitAction: {
        backgroundColor: '#24D29B',
        borderRadius: PR * 48
    },
    submitText: {
        color: '#fff',
        fontSize: PR * 17,
        textAlign: 'center',
        lineHeight: PR * 48
    },
})

// Login
const LoginStyles = StyleSheet.create({
    loginWrap: {
        marginTop: PR * 80,
        paddingHorizontal: PR * 20,
    },
    loginItem: {
        marginBottom: PR * 20,
    },
    loginItemText: {
        fontSize: PR * 18,
        color: '#333',
        fontWeight: 'bold',
    },
    loginItemValue: {
        flexDirection: 'row',
        borderBottomColor: '#f2f2f2',
        borderBottomWidth: PR * 1,
        alignItems: 'center',
    },
    loginItemColor: {
        color: '#24D29B',
        fontSize: PR * 15,
        marginRight: PR * 10,
    },
    loginItemInput: {
        flex: 1,
        fontSize: PR * 15,
    },
    codeBtn: {
        width: PR * 84,
        height: PR * 28,
        backgroundColor: 'rgba(36, 210, 155, 0.6)',
        borderRadius: PR * 28,
        justifyContent: 'center',
    },
    codeBtnActive: {
        backgroundColor: 'rgba(36, 210, 155, 1)'
    },
    codeBtnText: {
        color: '#fff',
        fontSize: PR * 12,
        textAlign: 'center',
    },
    submitBtn: {
        height: PR * 48,
        backgroundColor: 'rgba(36, 210, 155, 0.6)',
        borderRadius: PR * 48,
        justifyContent: 'center',
    },
    submitBtnActive: {
        backgroundColor: 'rgba(36, 210, 155, 1)'
    },
    submitBtnText: {
        color: '#fff',
        fontSize: PR * 17,
        textAlign: 'center',
    },
})

export {
    PR,
    Colors,
    MainStyles,
    FirstStyles,
    SecondStyles,
    LastStyles,
    FeedbackStyles,
    LoginStyles,
}