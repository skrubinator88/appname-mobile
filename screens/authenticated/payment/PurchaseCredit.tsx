import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo';
import { Body, Button, Container, Content, Header, Icon, Left, Text, Title, View } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Platform, StatusBar, StyleSheet } from 'react-native';
import { PaymentCreditView, PaymentMethodSelect, StripeCheckoutView } from '../components/payment';
import { ShowToast } from '../components/utils';
import { APPLICATION_CONTEXT } from "../lib";
import { PaymentMethod, TRANSACTION_PRODUCT_TYPE } from '../lib/transaction';
import { User } from '../lib/user';

export function PurchaseCredit({ onClose, paymentMethods }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({ showQuantityCalculator: true, quantity: 0, cost: 0, loading: false })
    const navigation = useNavigation()


    return (
        <Container style={{ backgroundColor: 'transparent' }}>
            <Content style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, backgroundColor: '#000e', justifyContent: 'center' }} >
                <View style={[styles.headerStyle, { backgroundColor: 'transparent', borderBottomWidth: 0, justifyContent: 'flex-end' }]}>
                    <Button style={{ alignSelf: 'flex-end' }} transparent onPress={() => {
                        if (state.loading) {
                            return Alert.alert('Cannot close session', "Cannot exit screen as payment is in progress")
                        }
                        onClose()
                    }}>
                        <Icon style={styles.headerButtonIcon} name='close' />
                    </Button>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', marginBottom: 20 }}>
                    {state.showQuantityCalculator ?
                        <PaymentCreditView onContinue={(quantity, cost) => setState({ ...state, quantity, cost, showQuantityCalculator: false })} />
                        :
                        <PaymentMethodSelect onPay={async (selected: PaymentMethod) => {
                            return await User.payForCredit(ctx, selected, state.cost, state.quantity).then(() => { setState({ ...state, showQuantityCalculator: true }) })
                        }} paymentMethods={paymentMethods} />
                    }
                </View>
            </Content>
            {/* // (
                //     <StripeCheckoutView productID={TRANSACTION_PRODUCT_TYPE.CREDIT_BUNDLE_PURCHASE} quantity={state.quantity}
                //         message={`Purchase ${ctx.name} Credit`}
                //         description={`${ctx.name} credits are in a bundle of 20 for $1.99. Proceed to purchase the desired amount of credit bundles.`}
                //         onSuccess={() => navigation.goBack()}
                //         onCancel={
                //             () => {
                //                 ShowToast({
                //                     text: 'Cancelled attempt to add new payment method!',
                //                     type: 'danger'
                //                 })
                //             }
                //         }
                //     />
                // ) */}
        </Container >
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        color: 'white',
        textTransform: 'capitalize',
        fontWeight: 'bold'
    },
    headerStyle: {
        backgroundColor: 'black',
        paddingTop: 0,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderBottomColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    headerButtonIcon: {
        color: 'white',
        fontSize: 32
    },
    drawerStyle: {
        backgroundColor: 'black'
    },
    drawerTop: {
        padding: 32,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#888',
        borderBottomWidth: StyleSheet.hairlineWidth
    }
})
