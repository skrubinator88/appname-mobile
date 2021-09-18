import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TextField } from "@ubaids/react-native-material-textfield";
import "intl";
import 'intl/locale-data/jsonp/en';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import ModalImport from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import Confirm from "../../../components/confirm";
import { GlobalContext } from "../../../components/context";
import Text from "../../../components/text";
import { fetchDashboardLink, getPaymentInfo, initiateAccount, makePayment, payout } from "../../../controllers/PaymentController";
import { getTransactionStatus, getTransactionStatusColor } from "../../../functions";
import AccountModal from "./accountModal";


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

export function MethodView({ method, onPress, disabled }) {
    return (
        <PaymentItemRow key={method.id}>
            <PaymentItemRowLink disabled={disabled} onPress={onPress}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {CARD_ICON[method.brand]({ size: 20 })}
                    <Text small weight="700" style={{ marginStart: 4 }} textTransform='uppercase' color="#4a4a4a"> ****{method.mask}</Text>
                </View>

                <Text small weight="700" color="#4a4a4a">EXP: {`${method.month.padStart(2, '0')}/${method.year}`}</Text>
            </PaymentItemRowLink>
        </PaymentItemRow>
    )
}

export function ExternalAccountView({ account, onPress }) {
    return (
        <PaymentItemRow key={account.id} style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, marginVertical: 4, alignItems: 'stretch' }}>
            {account.isBank ?
                <PaymentItemRowLink onPress={onPress} style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch', paddingTop: 12, paddingBottom: 12, paddingLeft: 8, paddingRight: 8 }}>
                    <FontAwesome name='bank' style={{ textAlign: 'center' }} size={20} />
                    <View style={{ paddingHorizontal: 8, paddingVertical: 8, justifyContent: 'center', alignItems: 'stretch' }}>
                        {account.name && <Text small align='center' weight="bold" textTransform='capitalize' color="#111">{account.name}</Text>}
                        <View style={{ flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center' }}>
                            <Text small light align='center' textTransform='uppercase' color="#4a4a4a">{account.bankName}</Text>
                            <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'stretch', justifyContent: 'space-between' }}>
                                <Text small weight="700" color="#4a4a4a">{account.routingNumber}</Text>
                                <Text small weight="700" textTransform='uppercase' color="#4a4a4a"> ****{account.mask}</Text>
                            </View>
                        </View>
                    </View>
                </PaymentItemRowLink>
                :
                <PaymentItemRowLink onPress={onPress} style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 8, paddingRight: 8, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch' }}>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 8, justifyContent: 'center', alignItems: 'stretch' }}>
                        {account.name && <Text small weight="bold" textTransform='capitalize' color="#111">{account.name}</Text>}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                {CARD_ICON[account.brand.toLowerCase()]({ size: 20 })}
                                <Text small weight="700" style={{ marginStart: 4 }} textTransform='uppercase' color="#4a4a4a"> ****{account.mask}</Text>
                            </View>

                            <Text small weight="700" color="#4a4a4a">EXP: {`${account.month.padStart(2, '0')}/${account.year}`}</Text>
                        </View>
                    </View>
                </PaymentItemRowLink >
            }
        </PaymentItemRow >
    )
}

export function TransactionRecord({ transaction: txn, onPress = () => { } }) {
    return (
        <PaymentItemRow key={txn.id} style={[{ borderLeftWidth: 5, borderRightWidth: 5, marginVertical: 4, borderColor: 'transparent' }, txn.inbound ? { borderRightColor: getTransactionStatusColor(txn), } : { borderLeftColor: getTransactionStatusColor(txn), }]} >
            <PaymentItemRowLink activeOpacity={0.8} onPress={onPress}>
                <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'stretch' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {CARD_ICON[txn.brand]({ size: 20 })}
                            <Text small weight="600" style={{ marginStart: 4 }} textTransform='uppercase' color="#4a4a4a">****{txn.mask}</Text>
                        </View>

                        <Text small weight="600" color="#4a4a4a">EXP: {`${txn.month.padStart(2, '0')}/${txn.year}`}</Text>
                    </View>
                    <View style={{ margin: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text align='center' title weight="700" color="#444">{CurrencyFormatter.format(txn.inbound ? (txn.deployeeRevenue + txn.serviceCharge + txn.mobilizationFee) / 100 : txn.amount / 100)}</Text>
                        <Text align='center' small weight="500" color="#6a6a6a">{txn.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text small weight="500" textTransform='uppercase' color="#888">{getTransactionStatus(txn.status)}</Text>
                        <Text small weight="500" color="#8888">{moment(txn.dateCreated).calendar()}</Text>
                    </View>
                </View>
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

export function AccountView({ refreshing, visible = true, onSuccess = () => { }, forPaymentsModal = false }) {
    const { authState } = useContext(GlobalContext);

    const [showPayout, setShowPayout] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const [uri, setURI] = useState('');

    const dispatch = useDispatch();
    const payments = useSelector((state) => state.payment);
    const { balance, hasActiveAccount } = payments;
    const refresh = async () => {
        await getPaymentInfo(authState, dispatch).catch(e => {
            // Silently log error
            console.log("Load Failed", "Failed to fetch payment details", e)
        })
    }

    const getDashboardLink = useCallback(async () => {
        Confirm({
            title: 'Open Stripe Dashboard',
            message: 'You can open your Stripe dashboard to manage settings on your account',
            options: ['Open', 'Cancel'],
            cancelButtonIndex: 1,
            onPress: async (i) => {
                if (i === 0) {
                    setShowSetup(true);
                    try {
                        if (!payments.hasActiveAccount) {
                            await Promise.reject({ message: 'Your account must be setup to continue', code: 418 })
                        }

                        const fetchedURI = await fetchDashboardLink(authState);
                        if (!fetchedURI) {
                            throw new Error('Failed to fetch dashboard details');
                        }
                        setURI(fetchedURI);
                    } catch (e) {
                        console.log(e);
                        Alert.alert('Manage Account Failed', e.code === 418 ? e.message : 'There was an error displaying your dashboard', [{
                            onPress: () => setShowSetup(false), style: 'cancel',
                        }]);
                    }
                }
            },
        });

    }, [uri, authState, payments]);

    const onSuccessfulSession = useCallback(() => {
        if (!payments.hasActiveAccount) {
            // This will check if the account was not configured earlier, indicating it has been successfully set
            Alert.alert('Acount Setup Complete', 'You account will be available after verification is complete. This usually takes 5 minutes', [{
                onPress: () => {
                    refresh()
                    setShowSetup(false);
                },
                style: 'cancel',
            }])
        } else {
            setShowSetup(false);
        }
        setURI(null);
    }, [payments]);

    const setup = useCallback(async () => {
        setShowSetup(true);
        try {
            if (payments.hasActiveAccount) {
                // An account already exists. This option should not be available to users.
                await Promise.reject({ message: 'You already have an account', code: 418 });
            }

            const fetchedURI = await initiateAccount(authState);
            if (!fetchedURI) {
                throw new Error('Failed to fetch account details');
            }
            setURI(fetchedURI);
        } catch (e) {
            console.log(e);
            Alert.alert('Account Setup Failed', e.code === 418 ? e.message : 'Failed to setup your account', [{
                onPress: () => setShowSetup(false), style: 'cancel',
            }]);
        }
    }, [uri, authState, payments])

    useEffect(() => {
        if (forPaymentsModal) setup()
    }, [forPaymentsModal])

    if (forPaymentsModal) {
        return <AccountModal setURI={setURI} showSetup={showSetup && visible} setShowSetup={setShowSetup} onSuccessfulSession={() => {
            refresh();
            setShowSetup(false);
            onSuccess()
        }} uri={uri} />
    }

    return (
        <AccountSection>
            {hasActiveAccount &&
                <TouchableOpacity onPress={getDashboardLink} style={{ position: "absolute", top: 4, right: 4 }}>
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
                            setShowPayout(true);
                        } else {
                            setup();
                        }
                    }}>
                    <Text small bold color='#fff' >{hasActiveAccount ? "PAYOUT" : "SETUP PAYOUT"}</Text>
                </TouchableOpacity>
            }
            <PayoutSelector show={showPayout} onSubmit={() => setShowPayout(false)} onCancel={() => setShowPayout(false)} />
            <AccountModal setURI={setURI} showSetup={showSetup} setShowSetup={setShowSetup} onSuccessfulSession={onSuccessfulSession} uri={uri} />
        </AccountSection>
    );
}

export function PaymentMethodSelector({ jobID, recipient, description, onClose, onSuccess }) {
    const { authState } = useContext(GlobalContext);
    const [selectMethod, setSelectMethod] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const payments = useSelector((state) => state.payment);

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
                                            editable={!loading}
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

export const PayoutSelector = ({ show, onCancel: onCancelProp, onSubmit: onSubmitProp }) => {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [selectAccount, setSelectAccount] = useState(false)
    const { authState } = useContext(GlobalContext)

    const payments = useSelector((state) => state.payment)

    const onCancel = useCallback(() => {
        if (loading) {
            return Alert.alert('Payout Processing', 'Cannot dismiss while payout request is being processed')
        }
        setSelectAccount(false)
        setAmount('')
        onCancelProp()
    }, [])
    const onSubmit = useMemo(() => () => {
        setSelectAccount(false)
        setAmount('')
        onSubmitProp()
    }, [])

    const onSubmitPayout = useCallback(async () => {
        if (amount) {
            if (!selectAccount) {
                Alert.alert('Payout Failed', 'Invalid account specified')
                return;
            }

            const payoutAmount = parseFloat(amount).toFixed(2);
            if (Number.isNaN(payoutAmount) || isNaN(payoutAmount)) {
                Alert.alert('Payout Failed', 'Invalid amount specified')
                return;
            }
            await new Promise((res) => {
                Confirm({
                    title: "Confirm Payout",
                    message: `Send $${payoutAmount} to your selected account?`,
                    options: ["Yes", "No"],
                    cancelButtonIndex: 1,
                    onPress: async (number) => {
                        if (number === 0) {
                            setLoading(true);
                            try {
                                await payout({ destination: selectAccount.id, amount: payoutAmount * 100 }, authState);
                                Alert.alert('Payout Successful', 'Payout was initiated successfully', [{ style: 'cancel', onPress: onSubmit }]);
                            } catch (e) {
                                Alert.alert('Payout Failed', e.message || "Failed to initiate payout", [{ style: 'cancel', onPress: onCancel }]);
                            }
                        }
                        res();
                    },
                    onCancel: res,
                });
            });

            setLoading(false);
        }
    }, [loading, selectAccount, amount]);

    return show ?
        (
            <ModalImport coverScreen avoidKeyboard swipeDirection='down' onSwipeComplete={onCancel} isVisible={show}>
                <View style={{ backgroundColor: "#fff", borderRadius: 40, paddingVertical: 16 }}>
                    <View style={{ justifyContent: 'space-between', padding: 4, marginHorizontal: 4, alignItems: 'stretch', }}>
                        <Text small textTransform="uppercase" style={{ marginBottom: 8, textAlign: "center" }} bold>PAYOUT</Text>

                        <Text align='center' light small marginBottom="5px">Specify amount you want transferred into your account. 12.5% of the specified amount is charged for instant payout</Text>
                    </View>
                    {loading ?
                        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                            <ActivityIndicator />
                        </View>
                        :
                        !selectAccount ?
                            <View style={{ justifyContent: 'center', padding: 20 }}>
                                {payments.externalAccounts && payments.externalAccounts.length >= 1 ?
                                    payments.externalAccounts.map(a => <ExternalAccountView key={a.id} account={a} onPress={() => setSelectAccount(a)} />)
                                    :
                                    <Text align='center' light marginBottom="5px">No account available! Update your dashboard to select an account!</Text>
                                }
                            </View>
                            :
                            <View style={{ justifyContent: 'center', padding: 20 }}>
                                <Text>Enter mount You Intend To Pay</Text>
                                <TextField
                                    disabled={loading}
                                    editable={!loading}
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
                                    onPress={onSubmitPayout}>
                                    <Text small bold color='#fff' >PAY</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: 'white', borderColor: 'red', borderWidth: StyleSheet.hairlineWidth, marginTop: 8, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}
                                    onPress={onCancel}>
                                    <Text small bold textTransform='uppercase' style={{ color: "red" }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                    }
                    {loading && <Text align='center' light small style={{ marginVertical: 8, fontSize: 12 }}>Do not exit this view while payout is processing</Text>}
                </View >
            </ModalImport>
        ) : null
};

const SectionTitle = styled.View`
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
