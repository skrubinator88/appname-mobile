import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, SafeAreaView, TouchableOpacity, View } from "react-native";
import Modal from 'react-native-modal';
import { CALLBACK_URL, MyWebView } from "./stripe";



export default function ({ showSetup, setShowSetup, onSuccessfulSession, uri }) {
    const [setupAccount, setSetupAccount] = useState(false)

    return (
        <Modal
            isVisible={showSetup}
            avoidKeyboard
            propagateSwipe
            onBackButtonPress={() => setShowSetup(false)}
            style={{ justifyContent: "center" }}>
            <SafeAreaView style={{ marginHorizontal: 8, marginVertical: 20, flexGrow: 1 }}>
                <View style={{ flexGrow: 1, padding: 8, backgroundColor: '#fff', borderRadius: 8, paddingTop: 28, alignItems: "stretch", }}>
                    {!setupAccount ?
                        <View style={{ height: '100%', justifyContent: 'center', padding: 20 }}>
                            <ActivityIndicator />
                        </View>
                        : null}
                    {uri &&
                        <MyWebView forAccount
                            style={{ flex: 1, paddingVertical: 12, display: setupAccount && uri ? 'flex' : 'none' }}
                            options={{
                                uri,
                                successUrl: CALLBACK_URL.SUCCESS,
                                cancelUrl: CALLBACK_URL.CANCELLED,
                            }}
                            onLoadingComplete={() => { if (!setupAccount) setSetupAccount(true) }}
                            onLoadingFail={() => setShowSetup(false)}
                            onSuccess={onSuccessfulSession}
                            onCancel={() => setShowSetup(false)}
                        />
                    }
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setShowSetup(false)} style={{ position: "absolute", top: 4, left: 4 }}>
                        <MaterialCommunityIcons size={24} color="red" name="close-circle" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    )
}