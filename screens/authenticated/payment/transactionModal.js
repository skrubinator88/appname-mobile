import moment from "moment";
import React from "react";
import { View } from "react-native";
import Modal from 'react-native-modal';
import Text from "../../../components/text";
import { getTransactionStatus, getTransactionStatusColor } from "../../../functions";
import { CurrencyFormatter } from "./components";



export const TransactionDetailsView = ({ status, total, dateCreated, serviceCharge, mobilizationFee, tax, inbound, deployeeRevenue }) => {
    return (
        <View style={[
            { justifyContent: 'center', alignItems: 'stretch', padding: 8, backgroundColor: 'white', },
            inbound ? {
                borderLeftColor: '#4f8c4f',
                borderLeftWidth: 4,
            } : null
        ]}>
            <View style={{ justifyContent: 'center', margin: 12 }}>
                <Text textTransform='uppercase' align='center' light>Details of transaction {inbound ? 'received' : 'sent'}</Text>
            </View>
            <Text color={getTransactionStatusColor({ status, inbound })} textTransform='uppercase' align='center' title bold>{getTransactionStatus(status)}</Text>
            <View style={{ paddingHorizontal: 4, paddingVertical: 12 }}>
                {inbound ? (
                    <View style={{ flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text textTransform='uppercase' light>revenue</Text>
                        <Text textTransform='uppercase'>{CurrencyFormatter.format((deployeeRevenue + serviceCharge + mobilizationFee) / 100)}</Text>
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text textTransform='uppercase' light>Cost</Text>
                        <Text textTransform='uppercase'>{CurrencyFormatter.format((total - (serviceCharge + mobilizationFee + tax)) / 100)}</Text>
                    </View>
                )}
                <View style={{ flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text textTransform='uppercase' light>{inbound ? 'mobilization' : 'demobilization'} fee</Text>
                    <Text textTransform='uppercase'>{inbound ? '-' : '+'}{CurrencyFormatter.format(mobilizationFee / 100)}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text textTransform='uppercase' light>service charge</Text>
                    <Text textTransform='uppercase'>{inbound ? '-' : '+'}{CurrencyFormatter.format(serviceCharge / 100)}</Text>
                </View>
                {inbound ? (
                    <View style={{ flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text textTransform='uppercase' >Profit</Text>
                        <Text textTransform='uppercase' medium>{CurrencyFormatter.format(deployeeRevenue / 100)}</Text>
                    </View>
                ) : (
                    <>
                        <View style={{ flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text textTransform='uppercase' light>tax</Text>
                            <Text textTransform='uppercase'>+{CurrencyFormatter.format(tax / 100)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 4, justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text textTransform='uppercase' >total</Text>
                            <Text textTransform='uppercase' medium>{CurrencyFormatter.format(total / 100)}</Text>
                        </View>
                    </>
                )}
            </View>
            <Text textTransform='uppercase' align='center' style={{ marginBottom: 8 }} small light>{moment(dateCreated).calendar()}</Text>
        </View>
    )
}

export const TransactionDetailsModal = ({ show, onClose, children = <></> }) => {
    return (
        <Modal
            avoidKeyboard
            statusBarTranslucent
            isVisible={show}
            swipeDirection={['down', 'up', 'left', 'right']}
            onSwipeComplete={onClose}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            style={{ margin: 0, justifyContent: 'center' }}>
            {children}
        </Modal>
    )
}