import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TextField } from "@ubaids/react-native-material-textfield";
import "intl";
import 'intl/locale-data/jsonp/en';
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import Confirm from "../../../components/confirm";
import { GlobalContext } from "../../../components/context";
import Text from "../../../components/text";
import { initiateAccount, makePayment } from "../../../controllers/PaymentController";
import { CALLBACK_URL, MyWebView } from "./stripe";


export const CARD_ICON = {
    amex: (props) => <FontAwesome name='cc-amex' {...props} />,
    diners: (props) => <FontAwesome name='cc-diners-club' {...props} />,
    discover: (props) => <FontAwesome name='cc-discover' {...props} />,
    jcb: (props) => <FontAwesome name='cc-jcb' {...props} />,
    mastercard: (props) => <FontAwesome name='cc-mastercard' {...props} />,
    unionpay: (props) => <FontAwesome name='credit-card-alt' {...props} />,
    visa: (props) => <FontAwesome name='cc-visa' {...props} />,
    unknown: (props) => <FontAwesome name='credit-card' {...props} />
}
export const CurrencyFormatter = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const NumberFormatter = Intl.NumberFormat()

export function MethodView({ method, onPress }) {
    return (
        <PaymentItemRow key={method.id}>
            <PaymentItemRowLink onPress={onPress}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {CARD_ICON[method.brand]({ size: 20 })}
                    <Text small weight="700" style={{ marginStart: 4 }} textTransform='uppercase' color="#4a4a4a">{method.brand} ****{method.mask}</Text>
                </View>

                <Text small weight="700" color="#4a4a4a">EXP: {`${method.month.padStart(2, '0')}/${method.year}`}</Text>
            </PaymentItemRowLink>
        </PaymentItemRow>
    )
}

export function PreferredMethodView({ method }) {
    return (
        <PaymentSection>
            <SectionTitle>
                <View style={{ margin: 10 }}>
                    <Text small bold color="#474747">PREFERRED METHODS</Text>
                </View>
            </SectionTitle>

            <PrefferedPaymentItemRow>
                <Column creditCardIcon>
                    {CARD_ICON[method.brand]({ color: '#3869f3', size: 70 })}
                </Column>
                <Column creditCardIconDescription>
                    <Text textTransform='uppercase' medium bold color="#474747">{method.brand} ****{method.mask}</Text>
                    <Text medium color="#474747">{`${method.month}/${method.year}`}</Text>
                </Column>
            </PrefferedPaymentItemRow>
        </PaymentSection>
    )
}

export function AccountView({ refreshing, balance = 0, hasActiveAccount, hasAccount }) {
    const { authState } = useContext(GlobalContext);
    const [setupAccount, setSetupAccount] = useState(false)
    const [showSetup, setShowSetup] = useState(false)
    const [uri, setURI] = useState('')

    const setup = useCallback(async () => {
        setShowSetup(true)
        try {
            const uri = await initiateAccount(authState)
            setURI(uri)
        } catch (e) {
            console.log(e)
            Alert.alert('Account Setup Failed', 'Failed to setup your account')
            setShowSetup(false)
        }
    }, [authState, uri])

    return (
        <AccountSection>

            {hasAccount &&
                <TouchableOpacity onPress={setup} style={{ position: "absolute", top: 4, right: 4 }}>
                    <FontAwesome size={24} color="#3869f8" name="external-link-square" />
                </TouchableOpacity>
            }

            <View style={{ margin: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="ios-wallet" size={60} />
                <Text small light>ACCOUNT</Text>
                {!refreshing && <Text title bold color="#474747">{CurrencyFormatter.format(balance / 100)}</Text>}
            </View>

            {refreshing ?
                <View style={{ padding: 20 }} >
                    <ActivityIndicator color='#3869f3' size='small' />
                </View>
                :
                <TouchableOpacity style={{ backgroundColor: '#3869f3', marginBottom: 12, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        if (hasActiveAccount) {

                        } else {
                            setup()
                        }
                    }}>
                    <Text small bold color='#fff' >{hasActiveAccount ? "PAYOUT" : "SETUP PAYOUT"}</Text>
                </TouchableOpacity>
            }
            {showSetup ?
                <Modal
                    animationType="fade"
                    transparent
                    visible
                    onRequestClose={() => setShowSetup(false)}
                    onDismiss={() => setShowSetup(false)}
                    style={{ height: "100%", backgroundColor: "#0004", justifyContent: "center" }}
                >
                    <ScrollView bounces={false} contentContainerStyle={{ justifyContent: "center", flexGrow: 1, backgroundColor: "#0004" }}>
                        <SafeAreaView style={{ marginHorizontal: 8, marginVertical: 120, flexGrow: 1 }}>
                            <KeyboardAvoidingView behavior="padding" style={{ justifyContent: "center", margin: 8, flex: 1 }}>
                                <View style={{ flexGrow: 1, padding: 8, backgroundColor: '#fff', borderRadius: 8, alignItems: "stretch", }}>
                                    {!setupAccount || !uri ?
                                        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                            <ActivityIndicator />
                                        </View>
                                        : null}
                                    {uri ? <MyWebView forAccount
                                        style={{ flex: 1, paddingVertical: 8, display: setupAccount && uri ? 'flex' : 'none' }}
                                        options={{
                                            uri,
                                            successUrl: CALLBACK_URL.SUCCESS,
                                            cancelUrl: CALLBACK_URL.CANCELLED,
                                        }}
                                        onLoadingComplete={() => setSetupAccount(true)}
                                        onLoadingFail={() => setShowSetup(false)}
                                        onSuccess={() => {
                                            setShowSetup(false)
                                            Alert.alert('Acount Setup Complete', 'You account will be available after verification is complete')
                                        }}
                                        onCancel={() => setShowSetup(false)}
                                    />
                                        : null}
                                    <TouchableOpacity onPress={() => setShowSetup(false)} style={{ position: "absolute", top: 4, left: 4 }}>
                                        <MaterialCommunityIcons size={24} color="red" name="close-circle" />
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    </ScrollView>
                </Modal>
                : null}
        </AccountSection>
    )
}

export function PaymentMethodSelector({ jobID, recipient, description, onClose, onSuccess, onError }) {
    const { authState } = useContext(GlobalContext);
    const [selectMethod, setSelectMethod] = useState(false)
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const payments = useSelector((state) => state.payment)
    const actionSheet = useActionSheet()

    const onSubmit = useCallback(async () => {
        Confirm({
            title: 'Confirm payment',
            message: 'Do you want to continue with payment?',
            options: ['Yes', 'No'],
            destructiveButtonIndex: 1,
            onPress: async (i) => {
                switch (i) {
                    case 0:
                        try {
                            setLoading(true)
                            const value = parseInt(amount, 10)
                            if (Number.isNaN(value) || !value || value <= 0) {
                                throw new Error('Invalid payment amount specified')
                            }

                            await makePayment({
                                amount: value * 100,
                                description,
                                jobID,
                                method: selectMethod,
                                recipient
                            }, authState, dispatch)

                            setLoading(false)
                            onSuccess(value)
                            Alert.alert('Payment Successful', 'Your money is on its way!')
                        } catch (e) {
                            console.log(e)
                            setLoading(false)
                            Alert.alert('Payment Failed', e.message)
                            // onError(e)
                        }
                        break
                }
            }
        })
    }, [authState, amount, selectMethod])

    return (
        <Modal
            animationType="fade"
            transparent
            visible
            onRequestClose={onClose}
            onDismiss={onClose}
            style={{ height: "100%", backgroundColor: "#0004", justifyContent: "center" }}
        >
            <ScrollView bounces={false} contentContainerStyle={{ justifyContent: "center", flexGrow: 1, backgroundColor: "#0004" }}>
                <SafeAreaView style={{ marginHorizontal: 8, marginVertical: 120 }}>
                    <KeyboardAvoidingView behavior="padding" style={{ justifyContent: "center", margin: 8, flex: 1 }}>
                        <View style={{ flexGrow: 1, padding: 8, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 8, alignItems: "stretch", }}>
                            {loading ?
                                <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                    <ActivityIndicator />
                                </View>
                                :
                                !selectMethod ?
                                    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                        {payments.methods.map(m => <MethodView key={m.id} method={m} onPress={() => setSelectMethod(m)} />)}
                                    </View>
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                        <Text>Enter mount You Intend To Pay</Text>
                                        <TextField
                                            disabled={loading}
                                            label="PAY"
                                            prefix="$"
                                            labelFontSize={14}
                                            placeholder="0.00"
                                            labelTextStyle={{ color: "grey", fontWeight: "700" }}
                                            keyboardType="numeric"
                                            onChangeText={(text) => {
                                                setAmount(text);
                                            }}
                                            value={amount}
                                        />
                                        <TouchableOpacity style={{ backgroundColor: '#3869f3', marginTop: 8, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={onSubmit}>
                                            <Text small bold color='#fff' >PAY</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                            <TouchableOpacity onPress={onClose} style={{ position: "absolute", top: 4, left: 4 }}>
                                <MaterialCommunityIcons size={24} color="red" name="close-circle" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ScrollView>
        </Modal>
    )
}


const SectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const AccountSectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PaymentSection = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const AccountSection = styled.View`
  justify-content: center;
  align-items: center;
  border-width: ${StyleSheet.hairlineWidth / 2}px;
  border-color: #3869f3;
  margin: 20px;
  border-radius: 8px;
  padding: 4px;
  background-color: white;
`;

const PaymentItemRow = styled.View`
  background: white;
  padding: 20px 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const PaymentItemRowLink = styled.TouchableOpacity`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Preferred Section

const PrefferedPaymentItemRow = styled.View`
  background: white;
  padding: 0 5%;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #f5f5f5;
`;

const Column = styled.View`
  padding: 10px;
  ${({ creditCardIcon, creditCardIconDescription }) => {
        if (creditCardIcon) return "flex: 1";
        if (creditCardIconDescription) return "flex: 3";
    }}
`;
