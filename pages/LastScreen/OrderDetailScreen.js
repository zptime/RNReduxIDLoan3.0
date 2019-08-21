import React, { Component } from 'react';
import { FlatList, View, Text, Image, DeviceEventEmitter, RefreshControl } from 'react-native';

import Toast from 'react-native-root-toast';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';
import { FormatNumber, FormatDate } from './../../assets/js/AppConfig';

import { AxiosPost } from './../../api';
import Global from './../../assets/js/Global';

import HeaderModel from './../../components/common/HeaderModel';
import OrderStateModel from './../../components/last/OrderStateModel';
import AuthSelectModel from './../../components/second/AuthSelectModel';
import ProductItemModel from './../../components/second/ProductItemModel';

class OrderDetailScreen extends Component {
    constructor(props) {
        super(props);

        this._onRefresh = this._onRefresh.bind(this);
        this._orderStateAction = this._orderStateAction.bind(this);
        this._selectAction = this._selectAction.bind(this);
        this._listAction = this._listAction.bind(this);

        this.statusConfig = [
            { status: 0, text: 'Menunggu No.Rekening' },
            // { status: 1, text: '' },
            { status: 2, text: 'Menunggu Review' },
            { status: 3, text: 'Review Ditolak' },
            // { status: 4, text: '' },
            // { status: 5, text: '' },
            { status: 6, text: 'Proses Transfer' },
            { status: 7, text: 'Peminjaman gagal' },
            { status: 8, text: 'Proses Pelunasan' },
            { status: 9, text: 'Sudah Lunas' },
        ];

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
            refreshing: true,
            id: 0,
            detailData: null,
            statusText: '',
            selectOption: null,
            selectKey: '',
            selectTitle: '',
            showSelect: false,
            payType: 1,
            payTypeOption: [],
            hotProductData: [],
        }
    }

    componentWillMount() {
        this._getRouterParam(); // 获取路由跳转传递的参数

        // 监听认证状态
        this.isStateListener = DeviceEventEmitter.addListener('orderState', (state) => {
            if (state === 1) {
                this._getData(this.state.id); // 重新获取数据
            }
        });
    }

    componentWillUnmount() {
        this.isStateListener && this.isStateListener.remove();
        this.setState = () => { return }; // 重置setState方法，防止内存泄漏
    }

    _getRouterParam() {
        const { navigation } = this.props;
        const id = navigation.getParam('id', '0');

        this.setState({ id });

        this._getData(id); // 获取数据
    }

    _getData(id) {
        AxiosPost('/order/detail', {
            para: { id }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 订单状态
                let statusText = '';
                this.statusConfig.map(value => {
                    if (value.status === response.status) {
                        statusText = value.text;
                    }
                });

                // 订单提示
                let statusHint = null;
                if (response.status === 0) {
                    statusHint = 'Silahkan masukkan nomor rekening Anda, Sebelum dapat di transfer!';
                }

                if (response.status === 2) {
                    statusHint = 'Setelah sudah ada hasilnya, Kami akan memberitahu Anda, Silahkan Tunggu!';
                }

                if (response.status === 3) {
                    statusHint = 'Mohon Maaf, Peminjaman Anda ditolak, Mohon mencoba produk lainnya.';
                }

                if (response.status === 6) {
                    statusHint = 'Pengajuan Anda disetujui, Akan di transfer dalam waktu 24 jam';
                }

                if (response.status === 7) {
                    statusHint = 'Yang Anda ajukan gagal, harap membuka aplikasi untuk mengajukan pinjaman lagi.';
                }

                if (response.status === 8) {
                    if (response.repay_plan.can_pay_day >= 0) {
                        statusHint = `Silahkan sebelum tanggal ${FormatDate(new Date(response.repay_plan.due_time * 1000), 'yyyy/MM/dd')} Melakukan Pelunasan`;
                    } else {
                        statusHint = `Sudah Telat ${-(response.repay_plan.can_pay_day)} hari, Biaya Keterlambatan Rp ${response.repay_plan.overdue_fee / 100}`;
                    }
                }

                if (response.status === 9) {
                    statusHint = 'Pelunasan Tepat Waktu, Limit Kredit Bertambah!';
                }

                // 贷款期限 年月转为日
                let loanTerm = 0;
                if (response.term_type === 1) {
                    loanTerm = response.loan_term;
                }

                if (response.term_type === 2) {
                    loanTerm = response.loan_term * 30;
                }

                if (response.term_type === 3) {
                    loanTerm = response.loan_term * 360;
                }

                // 付款方式
                let payTypeOption = [];
                response.repay_option.map(item => {
                    payTypeOption.push({ label: item.repay_desc, value: item.repay_type });
                });

                this.setState({
                    refreshing: false,
                    detailData: response,
                    statusText,
                    statusHint,
                    loanTerm,
                    payTypeOption,
                })

                this._getUserInfo(); // 获取用户信息
                this._getProductData(response.status); // 获取热门产品
            }
        }).catch(error => {
            this.setState({
                refreshing: false,
            })
        })
    }

    _onRefresh() {
        this.setState({ refreshing: true });
        this._getData(this.state.id); // 获取首页数据
    }

    _orderStateAction(state) {
        this.setState({
            showStateMore: state
        });
    }

    _getUserInfo() {
        AxiosPost('/user/info').then(res => {
            let { code, response } = res;
            if (code === 0) {
                this.setState({
                    user_name: response.name,
                    user_phone: response.user_phone
                });
            }
        })
    }

    _goWebView(param) {
        const { navigate } = this.props.navigation;

        navigate('WebView', { param });
    }

    _showSelect(selectKey, selectTitle, selectValue) {
        this.setState({
            selectOption: this.state[`${selectKey}Option`],
            selectKey,
            selectTitle,
            selectValue,
            showSelect: true
        });
    }

    _selectAction(key, item) {
        let state = {
            showSelect: false
        };

        if (item) {
            state[key] = item.value;

            let repay_periods = [];
            if (this.state.detailData.repay_plan.current_period_no) {
                repay_periods.push(this.state.detailData.repay_plan.current_period_no);
            }

            AxiosPost('/order/repay', {
                para: {
                    order_id: this.state.id,
                    repay_type: item.value,
                    repay_periods,
                }
            }).then(res => {
                let { code, message, response } = res;
                if (code === 0) {
                    this._goWebView({
                        uri: response.pay_url,
                        pay_code: response.pay_code,
                        pay_amount: FormatNumber(response.pay_amount / 100),
                        pay_type: item.value,
                        user_name: this.state.user_name,
                        user_phone: `***${this.state.user_phone.slice(-4)}`,
                    })
                } else if (code === 1) {
                    Toast.show(message, { duration: 4000 });
                }
            })
        }

        this.setState(state);
    }

    _goBindCard() {
        const { navigate } = this.props.navigation;

        navigate('BindCard', {
            order_id: this.state.id,
            platform_id: this.state.detailData.platform_id,
        });
    }

    _getProductData(status) {
        AxiosPost('/platform/internal-category-detail', {
            para: {
                platform_id: this.state.detailData.platform_id,
            }
        }).then(res => {
            let { code, response } = res;
            if (code === 0) {
                // 获取曝光产品id列表
                let exposureList = [];
                let hotProductData = [];

                if (status !== 0 && status !== 8) {
                    hotProductData = response;
                    hotProductData.map(item => {
                        exposureList.push(item.id.toString());
                    })
                }

                this.setState({
                    hotProductData,
                    exposureList,
                    showDataMore: true,
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    _onViewableItemsChanged = ({ changed }) => {
        changed.map(value => {
            if (value.isViewable && this.state.exposureList.includes(value.key)) {
                let exposureList = [];
                this.state.exposureList.map(item => {
                    if (item !== value.key) {
                        exposureList.push(item);
                    }
                })
                this.setState({ exposureList });

                this._platformExposure({
                    platform_id: value.item.id,
                    category_id: 0,
                    campaign_url: value.item.campaign_url,
                });
            }
        })
    }

    _platformExposure(para) {
        AxiosPost('/platform/exposure', { para })
    }

    _listAction(item) {
        const { navigate } = this.props.navigation;

        // 跳转默认产品详情
        if (item.jump_type === 0 || item.jump_type === 1) {
            navigate('DefultDetail', { id: item.id, category_id: this.state.hotCategoryId, campaign_url: item.campaign_url });
        }

        // 跳转Api产品详情
        if (item.jump_type === 2) {
            if (Global.basicAuth === 1) {
                navigate('ApiDetail', { id: item.id, category_id: this.state.hotCategoryId });
            } else { // 实名认证
                navigate('AuthDetail', { authType: 1 });
            }
        }
    }

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    data={this.state.hotProductData}
                    extraData={this.state}
                    keyExtractor={item => item.id.toString()}
                    ListHeaderComponent={() => <View>
                        <View style={MainStyles.mainTitle}>
                            <Text style={MainStyles.mainTitleText}>Rincian Pinjaman</Text>
                        </View>
                        {
                            this.state.detailData &&
                            <View style={LastStyles.orderProduct}>
                                <Image style={LastStyles.orderProductIcon} source={{ uri: this.state.detailData.plate_icon }} />
                                <Text style={LastStyles.orderProductText}>{this.state.detailData.plate_name}</Text>
                            </View>
                        }
                        {
                            this.state.detailData &&
                            <View style={LastStyles.orderState}>
                                <View style={LastStyles.orderStateInfo}>
                                    <Text style={LastStyles.orderStateName}>{this.state.statusText}</Text>
                                    <Text style={LastStyles.orderStateMore} onPress={() => this._orderStateAction(true)}>Rincian</Text>
                                </View>
                                {
                                    this.state.statusHint &&
                                    <Text style={LastStyles.orderStateText}>{this.state.statusHint}</Text>
                                }
                                {
                                    this.state.detailData.remark !== null &&
                                    <Text style={LastStyles.orderStateText}>{this.state.detailData.remark}</Text>
                                }
                            </View>
                        }
                        {
                            this.state.detailData &&
                            <View style={LastStyles.orderConfirmWrap}>
                                <View style={LastStyles.orderConfirmModel}>
                                    <View style={LastStyles.orderConfirmItem}>
                                        <Text style={LastStyles.orderConfirmItemName}>Jumlah Pinjaman</Text>
                                        <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {FormatNumber(this.state.detailData.loan_amount / 100)}</Text>
                                    </View>
                                    <View style={LastStyles.orderConfirmItem}>
                                        <Text style={LastStyles.orderConfirmItemName}>Jangka Waktu Pinjaman</Text>
                                        <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>{this.state.loanTerm} Hari</Text>
                                    </View>
                                    <View style={LastStyles.orderConfirmItem}>
                                        <Text style={LastStyles.orderConfirmItemName}>Waktu Pengajuan</Text>
                                        <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>{FormatDate(new Date(this.state.detailData.created_at * 1000), 'yyyy/MM/dd')}</Text>
                                    </View>
                                    {
                                        this.state.detailData.status !== 0 &&
                                        <View style={LastStyles.orderConfirmItem}>
                                            <Text style={LastStyles.orderConfirmItemName}>No. Rekening Bank</Text>
                                            <Text numberOfLines={1} ellipsizeMode={'middle'} style={LastStyles.orderConfirmItemValue}>{this.state.detailData.bank_short}({this.state.detailData.bank_card.slice(-4)})</Text>
                                        </View>
                                    }
                                    {
                                        this.state.detailData.contracts.length > 0 &&
                                        <View style={LastStyles.orderConfirmItem}>
                                            <Text style={LastStyles.orderConfirmItemName}>Perjanjian</Text>
                                            <View style={LastStyles.orderConfirmItemValueHack}>
                                                {
                                                    this.state.detailData.contracts.map((item, index) => {
                                                        return (
                                                            <Text key={index} style={LastStyles.orderConfirmContracts} onPress={() => this._goWebView({ uri: item.link })}>{`《`}{item.name}{`》`}</Text>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    }
                                </View>
                                {
                                    (this.state.detailData.status === 8 || this.state.detailData.status === 9) &&
                                    this.state.detailData.repay_plan &&
                                    this.state.detailData.repay_plan.repayment_plan &&
                                    this.state.detailData.repay_plan.repayment_plan[0] &&
                                    <View style={LastStyles.orderConfirmModel}>
                                        <View style={LastStyles.orderConfirmItem}>
                                            <Text style={LastStyles.orderConfirmItemName}>Bunga</Text>
                                            <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {FormatNumber(this.state.detailData.repay_plan.repayment_plan[0].interest / 100)}</Text>
                                        </View>
                                        <View style={LastStyles.orderConfirmItem}>
                                            <Text style={LastStyles.orderConfirmItemName}>Biaya Layanan</Text>
                                            <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {FormatNumber(this.state.detailData.repay_plan.repayment_plan[0].service_fee / 100)}</Text>
                                        </View>
                                        <View style={LastStyles.orderConfirmItem}>
                                            <Text style={LastStyles.orderConfirmItemName}>Biaya Keterlambatan</Text>
                                            <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {FormatNumber(this.state.detailData.repay_plan.repayment_plan[0].overdue_fee / 100)}</Text>
                                        </View>
                                        <View style={LastStyles.orderConfirmItem}>
                                            <Text style={LastStyles.orderConfirmItemName}>Jumlah Pengembalian</Text>
                                            <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {FormatNumber(this.state.detailData.repay_plan.repayment_plan[0].total_amount / 100)}</Text>
                                        </View>
                                        <View style={LastStyles.orderConfirmItem}>
                                            <Text style={LastStyles.orderConfirmItemName}>Saldo yang Sudah dibayarkan</Text>
                                            <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>Rp {FormatNumber(this.state.detailData.repay_plan.repayment_plan[0].already_paid / 100)}</Text>
                                        </View>
                                        <View style={LastStyles.orderConfirmItem}>
                                            <Text style={LastStyles.orderConfirmItemName}>Tanggal jatuh tempo</Text>
                                            <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>{FormatDate(new Date(this.state.detailData.repay_plan.repayment_plan[0].due_time * 1000), 'yyyy/MM/dd')}</Text>
                                        </View>
                                        {
                                            this.state.detailData.repay_plan.repayment_plan[0].finish_pay_time !== 0 &&
                                            <View style={LastStyles.orderConfirmItem}>
                                                <Text style={LastStyles.orderConfirmItemName}>Tanggal pembayaran aktual</Text>
                                                <Text numberOfLines={1} style={LastStyles.orderConfirmItemValue}>{FormatDate(new Date(this.state.detailData.repay_plan.repayment_plan[0].finish_pay_time * 1000), 'yyyy/MM/dd')}</Text>
                                            </View>
                                        }
                                    </View>
                                }
                            </View>
                        }
                        {
                            this.state.hotProductData &&
                            this.state.hotProductData.length > 0 &&
                            <View style={MainStyles.mainTitle}>
                                <Text style={MainStyles.mainTitleText}>Rekomendasi Populer</Text>
                            </View>
                        }
                    </View>}
                    renderItem={({ item }) => <View style={LastStyles.hotProductWrap}><ProductItemModel item={item} doAction={this._listAction} /></View>}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                />
                {
                    this.state.detailData &&
                    this.state.detailData.status === 8 &&
                    <Text style={LastStyles.orderDetailAction} onPress={() => this._showSelect('payType', 'Silahkan pilih metode pembayaran', this.state.payType)}>Pelunasan Segera</Text>
                }
                {
                    this.state.detailData &&
                    this.state.detailData.status === 0 &&
                    <Text style={LastStyles.orderDetailAction} onPress={() => this._goBindCard()}>ikat akun bank</Text>
                }
                {
                    this.state.showStateMore &&
                    <OrderStateModel data={this.statusConfig} activeIndex={this.state.detailData.status} doAction={this._orderStateAction} />
                }
                <AuthSelectModel
                    data={this.state.selectOption}
                    state={this.state.showSelect}
                    selectKey={this.state.selectKey}
                    selectValue={this.state.selectValue}
                    title={this.state.selectTitle}
                    doAction={this._selectAction}
                />
            </View>
        );
    }
}

export default OrderDetailScreen;