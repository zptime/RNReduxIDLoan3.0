import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import { MainStyles, LastStyles } from './../../assets/css/AppStyles';

import HeaderModel from './../../components/common/HeaderModel'

class ContactusScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            headerConfig: {
                showBack: true,
                navigation: this.props.navigation,
            },
        }
    }

    componentWillMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <View style={MainStyles.mainModel}>
                <HeaderModel data={this.state.headerConfig} />
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>PENGATURAN</Text>
                </View>
                <View style={LastStyles.setContent}>
                    <Image style={LastStyles.setContentIcon} source={require('./../../assets/img/logo.png')} />
                    <Text style={LastStyles.setContentText}>Kami adalah sebuah perusahaan yang berkomitmen untuk membangun platform pinjaman kredit terbesar dan terlengkap di indonesia. Kami menyediakan layanan konsultasi tentang pinjaman,layanan pencarian untuk membantu pengguna dalam memecahkan permasalahan keuangan</Text>
                    <View style={LastStyles.contactus}>
                        {/* <View style={LastStyles.contactusItem}>
                            <Text style={LastStyles.contactusItemName}>Alamat:</Text>
                            <Text style={LastStyles.contactusItemText}>RT.2/RW.7, Pisangan Tim., Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13920</Text>
                        </View>
                        <View style={LastStyles.contactusItem}>
                            <Text style={LastStyles.contactusItemName}>Tlp:</Text>
                            <Text style={LastStyles.contactusItemText}>02788888888</Text>
                        </View> */}
                        <View style={LastStyles.contactusItem}>
                            <Text style={LastStyles.contactusItemName}>Email:</Text>
                            <Text style={LastStyles.contactusItemText}>xclcsu0920@gmail.com</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default ContactusScreen;