import moment, { unix } from 'moment';
import { Badge, Body, Button, Card, CardItem, CheckBox, Container, Content, Header, Icon, Input, Item, Left, Radio, Right, Spinner, Text, Title, View } from 'native-base';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Modal, Platform, StatusBar, StyleSheet } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { HorizontalView, ShowToast } from '../components/utils';
import { APPLICATION_CONTEXT } from "../lib";
import { Subscription } from '../lib/subscription';
import { CARD_ICON, CurrencyFormatter, NumberFormatter, PaymentMethod, Transaction, TRANSACTION_PRODUCT_TYPE, TRANSACTION_STATUS } from '../lib/transaction';
import { User } from '../lib/user';
import { Wallet, WALLET_UNIT_RATE } from '../lib/wallet';
import { EmptyPostItem } from './post';

const STRIPE_PUBLIC_KEY = 'pk_test_51HdfqZD7hKWg06ZYtjRqJCPDqw0l8HmR5BZMRbEzqwbOnGmWXz2iYR9tpjhbxmrZI3txHvHNl11sRxFYy3ckmzxl00jAFNd5I8'

export function StripeCheckoutView({ onSuccess, onCancel, setup = false, quantity, productID, message = "Create a new Subscription", description = '' }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({ loading: false, session: '', callback: { SUCCESS: '', CANCELLED: '' } })
    let webView: WebView | null

    const STRIPE_CHECKOUT_HTML = `
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
        <style>
        * { font-size:16px}
        body { width:100%;overflow:hidden}
        button { width:100%; font-size:2em}
        </style>
    </head>
    <body>
        <script src="https://js.stripe.com/v3/"></script>
            <section class='hero is-dark is-fullheight is-capitalized has-text-centered has-background-black is-bold'>
                <div class='hero-body'>
                    <div class='container is-fluid'>
                        <h4 class='title'>${message}</h4>
                        <div class='subtitle mt-4'>${description}</div>
                        <button class='button mt-4 has-text-weight-bold is-uppercase is-rounded is-success' id='checkout-button' type='button'>Proceed To Checkout</button>
                    </div>
                </div>
            </section>
            <script>
               window.onload = function(){
                    try{
                        var checkout = document.getElementById('checkout-button')
                        var stripe = Stripe("${STRIPE_PUBLIC_KEY}");
                        checkout.onclick = function(){
                            checkout.classList.toggle('is-loading')
                            checkout.setAttribute('disabled','')
                            stripe.redirectToCheckout({ sessionId: "${state.session}" })
                            .then(function(result){
                                    if (result.error) {
                                        window.ReactNativeWebView.postMessage(result.error.message);
                                    }
                            })
                            .catch(function(error){
                                window.ReactNativeWebView.postMessage(error)
                                console.error('Error:', error);
                            });
                        }
                    }catch(e){
                        window.ReactNativeWebView.postMessage(e.message)
                    }    
                }
            </script>
    </body>
</html>
`

    const onNavHandler = useCallback((event: WebViewNavigation) => {
        const { url } = event
        if (!url || !state.callback.SUCCESS || !state.callback.CANCELLED || !webView) {
            return true
        }
        // Match a successful URL
        if (url.includes(state.callback.SUCCESS)) {
            webView.stopLoading()
            onSuccess()
            return false
        }
        // Match a cancelled URL
        if (url.includes(state.callback.CANCELLED)) {
            webView.stopLoading()
            webView.injectJavaScript(`
                document.write('${STRIPE_CHECKOUT_HTML}')
            `)
            onCancel()
            return false
        }
        return true
    }, [state])

    useEffect(() => {
        setState({ ...state, loading: true })

        if (setup) {
            User.addCardCheckoutSession(ctx).then(async (res) => {
                setState({
                    ...state, loading: false, session: res.session, callback: res.callback
                })
            }).catch(e => {
                console.log(e, 'error from session creation!')
                setState({ ...state, loading: false })
                ShowToast({
                    text: e.message || 'Failed to add card!',
                    type: 'danger'
                })
            })
        } else {
            User.startCheckoutSession(ctx, productID, quantity).then(async (res) => {
                setState({
                    ...state, loading: false, session: res.session, callback: res.callback
                })
            }).catch(e => {
                console.log(e, 'error from session creation!')
                setState({ ...state, loading: false })
                ShowToast({
                    text: e.message || 'Failed to create payment session!',
                    type: 'danger'
                })
            })
        }
    }, [])

    return (!state.loading && state.session ?
        <Content contentContainerStyle={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
            <WebView
                renderLoading={() => (
                    <View style={{ ...StyleSheet.absoluteFillObject, flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
                        <Spinner color='white' />
                    </View>
                )}
                onShouldStartLoadWithRequest={onNavHandler}
                startInLoadingState
                ref={ref => webView = ref}
                originWhitelist={['*']} containerStyle={{ backgroundColor: 'red' }}
                source={{ html: STRIPE_CHECKOUT_HTML }}
                onMessage={e => { console.info(e.nativeEvent.data, 'Logged info from webview') }}
            />
        </Content>
        :
        <Content contentContainerStyle={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
            <Spinner color='white' />
        </Content>
    )
}

export function SubscriptionView({ onSubscribeAttempt }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState<{
        loading: boolean,
        subscription: Subscription | null
    }>({ loading: true, subscription: null })

    useEffect(() => {
        setState({ ...state, loading: true })
        Subscription.getSubscription(ctx).then(subscription => {
            setState({ ...state, loading: false, subscription })
        }).catch((e) => {
            setState({ ...state, loading: false })
        })
    }, [])

    const onUnSubscribeAttempt = useCallback(() => {
        if (!state.subscription) {
            return
        }

        Alert.alert(`Cancel ${ctx.user?.role} subscription?`, 'You can subscribe at a later time to continue enjoying the benefits of this service', [
            {
                text: 'Confirm',
                style: 'destructive',
                onPress: () => {
                    setState({ ...state, loading: true })
                    Subscription.cancelSubscription(ctx, state?.subscription?.id).then(() => {
                        if (ctx.user?.role === 'manager') {
                            ctx.logoutUser()
                        }
                        setState({ ...state, loading: false })
                    }).catch((e) => {
                        setState({ ...state, loading: false })
                    })
                }
            },
            {
                text: 'Cancel',
                style: 'cancel'
            }
        ])
    }, [state.subscription])

    return (
        <Card style={{ borderRadius: 12, paddingVertical: 28, paddingHorizontal: 8, margin: 4 }}>
            {state.loading ?
                (
                    <CardItem cardBody style={{ flex: 1, borderRadius: 8, backgroundColor: 'white', justifyContent: 'center' }}>
                        <Spinner color='black' />
                    </CardItem>
                ) :
                state.subscription ?
                    (
                        <CardItem cardBody style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'stretch',
                            borderRadius: 8,
                        }}>
                            <View style={{
                                alignItems: 'center',
                                flex: 1,
                                justifyContent: 'center',
                                borderRadius: 8,
                            }}>
                                <Icon name={'briefcase'} style={{ fontSize: 40, color: '#444', margin: 2 }} />
                                <HorizontalView style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 22, color: '#222', fontWeight: 'bold', textTransform: 'capitalize', marginEnd: 8 }} >{state.subscription.productID === TRANSACTION_PRODUCT_TYPE.MANAGER_SUBSCRIPTION ? "Manager Subscription" : 'Player Subscription'}</Text>
                                    {state.loading ? null :
                                        state.subscription && state.subscription.active && state.subscription.confirmValidSubscription() ?
                                            <Badge success>
                                                <Text>Active</Text>
                                            </Badge>
                                            :
                                            <Badge danger>
                                                <Text>Inactive</Text>
                                            </Badge>
                                    }
                                </HorizontalView>
                                {state.subscription.active && state.subscription.confirmValidSubscription() ?
                                    <Text style={{ fontSize: 16, color: '#888', textTransform: 'capitalize' }} >{`${unix(state.subscription.dueTimestamp).isAfter() ? 'Expires' : 'Expired'} ${unix(state.subscription.dueTimestamp).calendar()}`}</Text>
                                    : null}
                                {ctx.user?.role === 'player' && (!state.subscription.active || !state.subscription.confirmValidSubscription()) ?
                                    (
                                        <Button rounded onPress={onSubscribeAttempt} bordered dark style={{ margin: 8, alignSelf: 'center' }}>
                                            <Text>Subscribe</Text>
                                        </Button>
                                    ) : null}
                                {state.subscription.active && state.subscription.confirmValidSubscription() ?
                                    (
                                        <Button rounded onPress={onUnSubscribeAttempt} bordered dark style={{ margin: 8, alignSelf: 'center' }}>
                                            <Text>{state.subscription.active ? 'Cancel Subscription' : 'Subscribe'}</Text>
                                        </Button>
                                    ) : null}
                            </View>
                        </CardItem>
                    ) :
                    (
                        <CardItem cardBody style={{ flex: 1, borderRadius: 8, backgroundColor: 'white', justifyContent: 'center' }}>
                            <View style={{
                                alignItems: 'center',
                                flex: 1,
                                justifyContent: 'center',
                                borderRadius: 8,
                            }}>
                                <Icon type='MaterialCommunityIcons' name={'alert-circle'} style={{ fontSize: 40, color: '#a44', margin: 8 }} />
                                <Text style={{ fontSize: 20, color: '#222', textTransform: 'capitalize' }} >No active {ctx.user?.role} subscription!</Text>
                                <Button rounded onPress={onSubscribeAttempt} bordered dark style={{ margin: 8, alignSelf: 'center' }}>
                                    <Text>Click here to subscribe</Text>
                                </Button>
                            </View>
                        </CardItem>
                    )
            }
        </Card>
    )
}

export function WalletView({ onTopupAttempt }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState<{
        loading: boolean,
        wallet: Wallet | null
    }>({ loading: true, wallet: null })

    useEffect(() => {
        setState({ ...state, loading: true })
        Wallet.getWallet(ctx).then(wallet => {
            setState({ ...state, loading: false, wallet })
        }).catch((e) => {
            setState({ ...state, loading: false })
        })
    }, [])

    return (
        <Card style={{
            borderRadius: 12, paddingVertical: 28, paddingHorizontal: 8, margin: 4,
        }}>
            {state.loading ?
                (
                    <CardItem cardBody style={{ flex: 1, borderRadius: 8, backgroundColor: 'white', justifyContent: 'center' }}>
                        <Spinner color='black' />
                    </CardItem>
                ) :
                state.wallet ?
                    (
                        <CardItem cardBody style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'stretch',
                            borderRadius: 8,
                        }}>
                            <View style={{
                                alignItems: 'center',
                                flex: 1,
                                justifyContent: 'center',
                                borderRadius: 8,
                            }}>
                                <HorizontalView style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name={'coins'} type='FontAwesome5' style={{ fontSize: 18, color: '#444', marginEnd: 4 }} />
                                    <Text style={{ fontSize: 24, color: '#222', fontWeight: 'bold', textTransform: 'capitalize', marginEnd: 8 }} >{NumberFormatter.format(state.wallet.value)}</Text>
                                </HorizontalView>
                                <HorizontalView style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 16, color: '#888', textTransform: 'capitalize' }} > {state.wallet.active ? `${ctx.name} credits available` : 'Wallet has been deactivated'}</Text>
                                    <Icon name={'primitive-dot'} type='Octicons' style={{
                                        fontSize: 18,
                                        color: state.wallet.active ? '#4b4' : '#b44',
                                        marginStart: 8
                                    }} />
                                </HorizontalView>
                                <Button rounded onPress={onTopupAttempt} dark bordered style={{ marginTop: 8, alignSelf: 'center' }}>
                                    <Text>Buy Credits</Text>
                                </Button>
                            </View>
                        </CardItem>
                    ) :
                    (
                        <CardItem cardBody style={{ flex: 1, borderRadius: 8, backgroundColor: 'white', justifyContent: 'center' }}>
                            <View style={{
                                alignItems: 'center',
                                flex: 1,
                                justifyContent: 'center',
                                borderRadius: 8,
                            }}>
                                <Icon type='MaterialCommunityIcons' name={'alert-circle'} style={{ fontSize: 40, color: '#a44', margin: 8 }} />
                                <Text style={{ fontSize: 20, color: '#222', textTransform: 'capitalize' }} >No wallet available!</Text>
                            </View>
                        </CardItem>
                    )
            }
        </Card>
    )
}

export function PaymentMethodView({ onPress, onAddPayment, paymentMethods, loading }) {

    return (
        <Card style={{
            borderRadius: 12, paddingVertical: 16, paddingHorizontal: 8, margin: 4, paddingTop: 4
        }}>
            <CardItem header style={{ paddingTop: 0, paddingRight: 0, justifyContent: 'space-between' }}>
                <Text style={{ flex: 1, fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>Payment Methods</Text>
                <Button rounded onPress={onAddPayment} dark bordered style={{ margin: 8, alignSelf: 'center', }}>
                    <Icon type='FontAwesome' name='plus' style={{ color: 'black' }} />
                </Button>
            </CardItem>
            {
                loading ?
                    (
                        <CardItem cardBody style={{ flex: 1, borderRadius: 8, backgroundColor: 'white', justifyContent: 'center' }}>
                            <Spinner color='black' />
                        </CardItem>
                    ) :
                    paymentMethods.length > 0 ?
                        (
                            paymentMethods.map((v, i) => {
                                const timestamp = moment(v.createdAt)
                                return (
                                    <CardItem key={v.id} button onLongPress={() => onPress(v)} onPress={() => { ShowToast({ text: 'Long press to manage payment method' }) }} first={i === 0} last={i === (paymentMethods.length - 1)} style={{
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        alignItems: 'stretch',
                                        marginVertical: 4
                                    }}>
                                        <HorizontalView style={{ alignItems: 'center' }}>
                                            {CARD_ICON[v.brand]}
                                            <Text style={{ marginStart: 8 }} >{`****${v.mask}`}</Text>
                                        </HorizontalView>
                                        <Right>
                                            <Text style={{ color: '#444' }}  >{`Added ${timestamp.fromNow()}`}</Text>
                                        </Right>
                                    </CardItem>
                                )
                            })
                        ) :
                        (
                            <CardItem style={{ flex: 1, borderRadius: 8, paddingTop: 0, paddingBottom: 12, justifyContent: 'center' }}>
                                <View style={{
                                    alignItems: 'center',
                                    flex: 1,
                                    justifyContent: 'center',
                                    borderRadius: 8,
                                }}>
                                    <Icon type='MaterialCommunityIcons' name={'alert-circle'} style={{ fontSize: 40, color: '#a44', margin: 8 }} />
                                    <Text style={{ fontSize: 20, color: '#222', textTransform: 'capitalize' }} >No payment method added yet!</Text>
                                </View>
                            </CardItem>
                        )
            }
        </Card >
    )
}

export function PaymentMethodSelect({ paymentMethods, onPay }) {
    const [state, setState] = useState<{ loading: boolean, selected: null | PaymentMethod }>({ loading: false, selected: null })

    return (
        <Card style={{
            borderRadius: 12, padding: 16, marginLeft: 16, marginRight: 16
        }}>
            <CardItem header>
                <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>Select payment method</Text>
            </CardItem>
            <CardItem cardBody style={{
                flex: 1,
                alignItems: 'stretch',
                marginVertical: 4
            }}>
                <View style={{
                    alignItems: 'center',
                    flex: 1,
                    // justifyContent: 'center',
                }}>
                    {paymentMethods.length > 0 ?
                        (
                            paymentMethods.map((v: PaymentMethod, i) => {
                                const timestamp = moment(v.createdAt)
                                return (
                                    <CardItem key={`${v.id}${i}`} button onPress={() => setState({ ...state, selected: v })} first={i === 0} last={i === (paymentMethods.length - 1)} style={{
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        alignItems: 'stretch',
                                        marginVertical: 4,
                                        paddingEnd: 0,
                                        paddingLeft: 0,
                                    }}>
                                        <HorizontalView style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Radio color={state.selected?.id === v.id ? 'blue' : 'black'} selected={state.selected?.id === v.id} />
                                            <HorizontalView style={{ justifyContent: 'flex-start', marginStart: 8, alignItems: 'center', }}>
                                                {CARD_ICON[v.brand]}
                                                <Text style={{ marginStart: 8 }} >{`****${v.mask}`}</Text>
                                            </HorizontalView>
                                        </HorizontalView>
                                        <Right>
                                            <Text style={{ color: '#444' }}  >{`Added ${timestamp.fromNow()}`}</Text>
                                        </Right>
                                    </CardItem>
                                )
                            })
                        ) :
                        (
                            <CardItem style={{ flex: 1, borderRadius: 8, paddingTop: 0, paddingBottom: 12, justifyContent: 'center' }}>
                                <View style={{
                                    alignItems: 'center',
                                    flex: 1,
                                    justifyContent: 'center',
                                    borderRadius: 8,
                                }}>
                                    <Icon type='MaterialCommunityIcons' name={'alert-circle'} style={{ fontSize: 40, color: '#a44', margin: 8 }} />
                                    <Text style={{ fontSize: 20, color: '#222', textTransform: 'capitalize' }} >No payment method added yet!</Text>
                                </View>
                            </CardItem>
                        )}

                    <Button disabled={state.loading} success rounded block onPress={async () => {
                        setState({ ...state, loading: true })
                        try {
                            await onPay(state.selected)
                            Alert.alert('Payment Successful!', 'We are currently processing credit purchase.')
                        } catch (e) {
                            Alert.alert('Payment failed!', e.message || 'Failed to make payment successfully.')
                        }
                        setState({ ...state, loading: false })
                    }} style={{ marginVertical: 8 }}>
                        {state.loading ? <Spinner color='white' /> : <Text>PAY</Text>}
                    </Button>
                </View>
            </CardItem>
        </Card >
    )
}

export function PaymentCreditView({ onContinue }) {
    const [state, setState] = useState({ loading: true, cost: 0, credits: '' })

    return (
        <Card style={{
            borderRadius: 12, padding: 16, marginLeft: 16, marginRight: 16
        }}>
            <CardItem header>
                <Text style={{ flex: 1, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase' }}>Select amount of credit for purchase</Text>
            </CardItem>
            <CardItem cardBody style={{
                flex: 1,
                alignItems: 'stretch',
                marginVertical: 4
            }}>
                <View style={{
                    alignItems: 'center',
                    flex: 1,
                    // justifyContent: 'center',
                }}>
                    <HorizontalView style={{ alignItems: 'center' }}>
                        <Text style={{ flex: 1, textAlign: 'center' }} >{`Cost: ${CurrencyFormatter.format(isNaN(state.cost) ? 0 : state.cost / 100)}`}</Text>
                    </HorizontalView>
                    <Item rounded last style={{ marginVertical: 16 }}>
                        <Icon name='coins' type='FontAwesome5' />
                        <Input keyboardType='decimal-pad'
                            autoCapitalize='none'
                            placeholder="Credits to purchase"
                            value={state.credits}
                            onChangeText={credits => {
                                setState({ ...state, credits, cost: Math.round((parseInt(credits) / WALLET_UNIT_RATE) * 199) })
                            }}
                        />
                    </Item>
                    <Text style={{ marginStart: 8, marginVertical: 8, fontSize: 14, flex: 1, textAlign: 'center' }} >{`Enter desired credits to purchase in multiples of ${WALLET_UNIT_RATE}`}</Text>
                    <Button success rounded block onPress={() => {
                        const credits = Number.parseInt(state.credits)
                        if (Number.isNaN(credits) || credits % WALLET_UNIT_RATE !== 0) {
                            Alert.alert('Invalid credit value requested', 'Credit count must be a multiple of ' + WALLET_UNIT_RATE)
                            return
                        }
                        onContinue(credits, state.cost)
                    }} style={{ marginVertical: 8 }}>
                        <Text>Continue Purchase</Text>
                    </Button>
                </View>
            </CardItem>
        </Card >
    )
}

export function TransactionItem({ transaction }: { transaction: Transaction }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const timestamp = moment(transaction.createdAt)
    const description = useMemo(() => {
        switch (transaction.productID) {
            case TRANSACTION_PRODUCT_TYPE.CREDIT_BUNDLE_PURCHASE:
                return `x${transaction.quantity * WALLET_UNIT_RATE} credit purchase`
            case TRANSACTION_PRODUCT_TYPE.MANAGER_SUBSCRIPTION:
                return `Payment for manager subscription`
            case TRANSACTION_PRODUCT_TYPE.PLAYER_SUBSCRIPTION:
                return `Payment for player subscription`
            default:
                return `Payment on ${ctx.name}`
        }
    }, [transaction])
    return (
        <View style={{ backgroundColor: transaction.status === TRANSACTION_STATUS.SUCCESS ? '#cffacf' : '#facfcf', padding: 12, marginBottom: 4 }} >
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 20 }}>{CurrencyFormatter.format(transaction.amount / 100)}</Text>

            <HorizontalView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 4 }}>
                <Text style={{ textAlign: 'center', marginEnd: 8 }}>{description}</Text>
                {transaction.status === TRANSACTION_STATUS.SUCCESS ?
                    <Badge success>
                        <Icon name="check" type='FontAwesome' style={{ fontSize: 15, color: "#fff", lineHeight: 20 }} />
                    </Badge>
                    :
                    <Badge danger>
                        <Icon name="close" type='FontAwesome' style={{ fontSize: 15, color: "#fff", lineHeight: 20 }} />
                    </Badge>
                }
            </HorizontalView>

            <HorizontalView style={{ justifyContent: 'space-between', marginTop: 4 }}>
                <HorizontalView style={{ alignItems: 'center' }}>
                    <Icon name={'clock'} style={{ marginEnd: 4, fontSize: 12, color: '#444' }} />
                    <Text style={{ color: '#222' }} >{timestamp.calendar()}</Text>
                </HorizontalView>
                <HorizontalView style={{ alignItems: 'center' }}>
                    {CARD_ICON[transaction.paymentBrand]}
                    <Text style={{ marginStart: 8, color: '#222' }} >{`****${transaction.paymentMask}`}</Text>
                </HorizontalView>
            </HorizontalView>
        </View>
    )
}

export function TransactionViewHeader({ loadingMethods, onSubscribeAttempt, onTopupAttempt, onPressPaymentMethod, onAddPayment, methods }) {
    return (
        <>
            <SubscriptionView onSubscribeAttempt={onSubscribeAttempt} />
            <WalletView onTopupAttempt={onTopupAttempt} />
            <PaymentMethodView loading={loadingMethods} onPress={onPressPaymentMethod} onAddPayment={onAddPayment} paymentMethods={methods} />
        </>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        color: 'white',
        textTransform: 'capitalize',
        fontWeight: 'bold'
    },
    headerButtonIcon: {
        color: 'white'
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
