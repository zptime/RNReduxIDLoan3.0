import React from 'react';
import { View, Text, Image, SectionList, TouchableOpacity, StyleSheet, Modal } from 'react-native';

import { PR, MainStyles } from './../../assets/css/AppStyles';

import NothingModel from './../common/NothingModel';

const ContactModel = ({ data = [], state, activeIndex, doAction }) => {
    const ContactModel = state &&
        <Modal
            animationType='fade'
            transparent={true}
            visible={state}
            onRequestClose={() => doAction(null)}
        >
            <View style={styles.contactModel}>
                <View style={MainStyles.mainTitle}>
                    <Text style={MainStyles.mainTitleText}>Silakan pilih kontak darurat</Text>
                </View>
                <View style={styles.contactContent}>
                    <SectionList
                        style={styles.contactList}
                        showsVerticalScrollIndicator={false}
                        sections={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.contactListHeader}>{title}</Text>
                        )}
                        ListEmptyComponent={() => <View style={styles.contactListHack}><NothingModel /></View>}
                        renderItem={({ item }) =>
                            <TouchableOpacity activeOpacity={1} style={styles.contactListItem} onPress={() => doAction('select', item)}>
                                <Image style={styles.contactListIcon} source={require('./../../assets/img/icon_contact.png')} />
                                <Text style={styles.contactListValue}>
                                    <Text style={styles.contactListName}>{item.name}{'\n'}</Text>
                                    <Text style={styles.contactListPhone}>{item.phone}</Text>
                                </Text>
                                <Text style={styles.contactListBtn}>Pilih</Text>
                            </TouchableOpacity>
                        }
                    />
                    <Text style={styles.closeBtn} onPress={() => doAction(null)}>BATAL</Text>
                    {/* <View style={styles.contactIndex}>
                        {
                            data.map((item, index) => {
                                return (
                                    <Text key={index} style={[styles.contactIndexItem, activeIndex === item.title && styles.contactIndexItemActive]} onPress={() => doAction('change', item)}>{item.title}</Text>
                                )
                            })
                        }
                    </View> */}
                </View>
            </View>
        </Modal>
    return (
        ContactModel
    );
}

const styles = StyleSheet.create({
    contactModel: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#FFF',
    },
    contactContent: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: PR * 90,
    },
    contactList: {
        flex: 1,
        marginHorizontal: PR * 20,
        borderRadius: PR * 6,
    },
    contactListHeader: {
        color: '#ADD5C7',
        fontSize: PR * 15,
        paddingLeft: PR * 20,
        lineHeight: PR * 30,
        marginTop: PR * 5,
    },
    contactListItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: PR * 15,
        backgroundColor: '#EDF6F3',
    },
    contactListHack: {
        marginTop: '50%',
    },
    contactListIcon: {
        width: PR * 44,
        height: PR * 44,
        marginRight: PR * 10,
    },
    contactListValue: {
        flex: 1,
    },
    contactListName: {
        fontSize: PR * 12,
        color: '#ADD5C7',
    },
    contactListPhone: {
        fontSize: PR * 15,
        color: '#000',
        lineHeight: PR * 24,
    },
    contactListBtn: {
        width: PR * 49,
        height: PR * 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: '#ADD5C7',
        borderRadius: PR * 22,
        color: '#FFF',
        fontSize: PR * 12,
    },
    contactIndex: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactIndexItem: {
        width: PR * 20,
        lineHeight: PR * 20,
        textAlign: 'center',
    },
    contactIndexItemActive: {
        fontWeight: 'bold',
        color: '#24D29B'
    },
    closeBtn: {
        position: 'absolute',
        left: PR * 20,
        right: PR * 20,
        bottom: PR * 20,
        lineHeight: PR * 48,
        borderRadius: PR * 48,
        borderWidth: PR * 1,
        textAlign: 'center',
        borderColor: '#24D29B',
        color: '#24D29B',
        fontSize: PR * 17,
        fontWeight: 'bold',
    },
})

export default ContactModel;