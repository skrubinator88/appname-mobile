import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, FlatList, Modal, Platform, RefreshControl, StatusBar, StyleSheet } from 'react-native'
import { PurchaseCredit } from './PurchaseCredit';

export function AccountPage() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({ loading: false, loadingMore: false, showCreditPurchase: false, items: new Array<Transaction>(), loadingMethods: false })
    const [methods, setMethods] = useState(new Array<PaymentMethod>())
    const route = useRoute(),
        navigation = useNavigation()

    const refreshMethods = useCallback(() => {
        setState({ ...state, loadingMethods: true })
        User.getPaymentMethods(ctx).then(methods => {
            setState({ ...state, loadingMethods: false })
            setMethods(methods)
        }).catch((e) => {
            setState({ ...state, loadingMethods: false })
        })
    }, [state])

    const refreshItems = useCallback(() => {
        setState({ ...state, loading: true })
        Promise.all([
            refreshMethods(),
            User.getTransactions(ctx, 1, Math.max(TRANSACTION_PAGE_LIMIT, state.items.length)).then(transactions => {
                setState({ ...state, loading: false, items: [...transactions] })
            }).catch(e => {
                ShowToast({
                    text: e.message || "Failed to load transactions!",
                    type: 'danger'
                })
                setState({ ...state, loading: false })
            })
        ])
    }, [state])

    const loadMore = useCallback(() => {
        setState({ ...state, loadingMore: true })
        User.getTransactions(ctx, Math.max(2, Math.ceil(state.items.length / TRANSACTION_PAGE_LIMIT) + 1)).then(transactions => {
            setState({ ...state, loadingMore: false, items: [...state.items, ...transactions] })
        }).catch(e => {
            ShowToast({
                text: e.message || "No new data!",
                type: 'danger'
            })
            setState({ ...state, loadingMore: false })
        })
    }, [state])

    useEffect(refreshItems, [])


    return (
        <Container style={{ backgroundColor: 'black' }}>
            <StatusBar barStyle='light-content' />
            <Header rounded searchBar noShadow={Platform.OS === 'ios' ? true : false} hasTabs={Platform.OS === 'ios' ? true : false} androidStatusBarColor='black' iosBarStyle='light-content' style={{ paddingTop: 0, backgroundColor: 'black' }}>
                <Left>
                    <Button disabled={state.loading} transparent onPress={() => { navigation.goBack() }}>
                        <Icon style={{ color: 'white' }} name='arrow-back' />
                    </Button>
                </Left>
                <Body />
            </Header>
            <Content bounces={false} scrollEnabled={false} style={{ backgroundColor: 'transparent' }} contentContainerStyle={[styles.contentStyle, { flex: 1 }]}>
                <FlatList contentContainerStyle={styles.contentStyle}
                    ListEmptyComponent={<EmptyPostItem backgroundColor='white' iconName='exchange' iconFamily='FontAwesome' message="No transaction available!" />}
                    removeClippedSubviews
                    style={{ flex: 1, backgroundColor: 'white' }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    ListHeaderComponent={
                        <TransactionViewHeader
                            methods={methods}
                            loadingMethods={state.loadingMethods}
                            onTopupAttempt={() => {
                                if (state.loadingMethods) {
                                    return ShowToast({ text: 'Payment methods are not ready yet!', type: 'danger' })
                                }
                                setState({ ...state, showCreditPurchase: true })
                            }}
                            onPressPaymentMethod={(p: PaymentMethod) => {
                                ActionSheet.show({
                                    options: ['Make Default', 'Remove', 'Cancel'],
                                    cancelButtonIndex: 2,
                                    destructiveButtonIndex: 1,
                                    title: `Manage Card - ****${p.mask}`
                                }, async (i) => {
                                    switch (i) {
                                        case 0:
                                            Alert.alert("Update Default Payment Method", "The payment method selected will become the default for future invoice payments", [
                                                {
                                                    text: 'confirm',
                                                    style: 'default',
                                                    onPress: () => {
                                                        User.setDefaultPaymentMethod(ctx, p.id).then(() => {
                                                            ShowToast({
                                                                text: 'Payment method has been set as default method for future subscription payments',
                                                                type: 'success'
                                                            })
                                                        }).catch(e => {
                                                            ShowToast({
                                                                text: e.message || 'Failed to update payment method!',
                                                                type: 'danger'
                                                            })
                                                        })
                                                    }
                                                },
                                                {
                                                    text: 'cancel',
                                                    style: 'cancel'
                                                }
                                            ])
                                            break
                                        case 1:
                                            Alert.alert("Remove Payment Method", "Future payment using this method may fail causing issues with your subscription. Ensure you add a new payment method after deleting.", [
                                                {
                                                    text: 'confirm',
                                                    style: 'default',
                                                    onPress: () => {
                                                        User.deletePaymentMethod(ctx, p.id).then(() => {
                                                            ShowToast({
                                                                text: 'Payment method marked for removal!',
                                                                type: 'success'
                                                            })
                                                        }).catch(e => {
                                                            ShowToast({
                                                                text: e.message || 'Failed to delete payment method!',
                                                                type: 'danger'
                                                            })
                                                        })
                                                    }
                                                },
                                                {
                                                    text: 'cancel',
                                                    style: 'cancel'
                                                }
                                            ])
                                            break
                                    }
                                })
                            }}
                            onSubscribeAttempt={() => navigation.navigate('SetupSubscription')}
                            onAddPayment={() => navigation.navigate('AddPaymentMethod')}
                        />
                    }
                    ListFooterComponent={<Button disabled={state.loadingMore || state.loading} rounded dark onPress={loadMore} style={{
                        marginVertical: 32,
                        alignSelf: 'center',
                        padding: 16
                    }}>{state.loadingMore ? <Spinner color='white' size='small' /> : <Text>Load More</Text>}</Button>}
                    data={state.items}
                    alwaysBounceVertical
                    scrollEnabled
                    refreshControl={<RefreshControl onRefresh={refreshItems} refreshing={state.loading} />}
                    keyExtractor={item => { return item.id }}
                    renderItem={({ item }) => {
                        return (
                            <TransactionItem transaction={item} />
                        )
                    }
                    }
                />
                {state.showCreditPurchase ?
                    (
                        <Modal visible={state.showCreditPurchase} transparent onDismiss={() => { }} >
                            <PurchaseCredit onClose={() => { setState({ ...state, showCreditPurchase: false }) }} paymentMethods={methods} />
                        </Modal>
                    ) : null
                }
            </Content>
        </Container>
    )
}


const styles = StyleSheet.create({
    contentStyle: {
        backgroundColor: '#dadada',
        alignItems: 'stretch',
        flexGrow: 1,
        justifyContent: 'flex-start'
    },
    headerButtonIcon: {
        color: 'white',
        fontWeight: 'bold'
    },
    content: {
        flexGrow: 1, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'stretch'
    },
    fullnameTitle: {
        color: 'white', margin: 8, textTransform: 'capitalize', fontWeight: 'bold', fontSize: 28
    },
    thumbnail: {
        height: 120,
        width: 120,
        borderRadius: 120,
        marginTop: 16,
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'black'
    },
    mediaStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    mediaButton: {
        margin: 8,
        backgroundColor: 'white',
    },
    mediaButtonText: {
        color: 'black',
        textTransform: 'uppercase',
        fontSize: 12,
        fontWeight: 'bold'
    }
})