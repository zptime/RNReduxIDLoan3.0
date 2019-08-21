import React, { Component } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { setBasicAuth } from '../actions';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ip: '',
            token: '',
            isLogin: 0,
            basicAuth: 0,
            appChannel: null,
            cityData: null,
            state: ''
        }
    }

    componentWillMount () {
        // this._updateStore()
    }

    _updateStore () {
        const { dispatch, state } = this.props;
        const { ip, token, isLogin, basicAuth, appChannel, cityData } = this.props;
        dispatch(setBasicAuth(3))
        this.setState({ ip: state.ip + '...' + ip })
        this.setState({ token: state.token + '...' + token })
        this.setState({ isLogin: state.isLogin + '...' + isLogin })
        this.setState({ basicAuth: state.basicAuth + '...' + basicAuth })
        this.setState({ appChannel: JSON.stringify(state.appChannel) + '...' + JSON.stringify(appChannel) })
        this.setState({ cityData: JSON.stringify(state.cityData) + '...' + JSON.stringify(cityData) })
    }

    render() {
        let { dispatch } = this.props;
        return (
            <View>
                <Text>这是测试页</Text>
                <Text>哈哈哈</Text>
                <Button
                    title="Change basicAuth"
                    onPress={() => {
                        dispatch(setBasicAuth(2))
                        this._updateStore()
                    }
                }/>
                <ScrollView style={styles.scrollViewStyle}>
                    <Text style={styles.marginBottom10}>ip---{ this.state.ip }</Text>
                    <Text style={styles.marginBottom10}>token---{ this.state.token }</Text>
                    <Text style={styles.marginBottom10}>isLogin---{ this.state.isLogin }</Text>
                    <Text style={styles.marginBottom10}>basicAuth---{ this.state.basicAuth }</Text>
                    <Text style={styles.marginBottom10}>appChannel---{ this.state.appChannel }</Text>
                    <Text style={styles.marginBottom10}>cityData---{ this.state.cityData }</Text>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    let { ip, token, isLogin, basicAuth, appChannel, cityData } = state;
    return {
        ip,
        token,
        isLogin,
        basicAuth,
        appChannel,
        cityData,
        state
    };
};

// const mapStateToProps = state => ({
//     ip: state.ip
// });

// const mapDispatchToProps = dispatch => ({
//     toggleTodo: id => dispatch(toggleTodo(id))
// });

const styles = StyleSheet.create({
    scrollViewStyle: {
        // flex: 1,
        marginLeft:10,
        marginRight: 10,
        marginTop: 10
    },
    marginBottom10:{
        marginBottom: 10
    }
})

export default connect(mapStateToProps)(Home);