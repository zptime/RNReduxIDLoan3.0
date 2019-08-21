import React, { Component } from 'react';
import { View, Button } from 'react-native';

import { MainStyles } from '../../../assets/css/AppStyles';
import HomeScreen from '../Home';

class FirstScreen extends Component {
    static navigationOptions = ({navigation}) => {
        let headerRight = (
            <Button title="Save"/>
        );
        return {
            headerTitle: 'FirstScreen',
            headerStyle: {
                backgroundColor: '#000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerRight: headerRight,
        }
    }

    constructor(props) {
        super(props);

        this.state = {}
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={MainStyles.mainModel}>
                <Button
                    title='跳转到页面2'
                    onPress={() => {
                        navigate('Second',{ name: 'Second' })
                    }}
                />
                <Button
                    title='跳转到页面3'
                    onPress={() => {
                        navigate('Last',{ name: 'Last' })
                    }}
                />
                <HomeScreen/>
            </View>
        );
    }
}

export default FirstScreen;