import React, { useState, useEffect, useContext, useRef, useCallback } from "react";

import { Image, Button, Alert, TextInput, View, ActivityIndicator } from "react-native";

import { Platform, Dimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

import StripeCheckout from "react-native-stripe-checkout-webview";

// Components
import Header from "../../../components/header";
import Text from "../../../components/text";
import env from "../../../env";
import { GlobalContext } from "../../../components/context";

const CALLBACK_URL = {
  // SUCCESS: process.env.BASE_HOST_URI + '/api/payments/session/success',
  SUCCESS: 'https://stripe.com/success?sc_checkout=success',
  CANCELLED: 'https://stripe.com/cancel?sc_checkout=cancel',
}

export default function StripeCheckoutScreen({ children, close = () => { } }) {
  const { authState } = useContext(GlobalContext);
  const [CHECKOUT_SESSION_ID, setCheckOutSessionID] = useState("");
  const [show, setShow] = useState(true);

  useEffect(() => {
    const signal = new AbortController();
    if (!CHECKOUT_SESSION_ID) {
      (async () => {
        const { sessionID } = await fetch(`${env.API_URL}/payments/setup_card`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${authState.userToken}`
          },
          body: JSON.stringify({ first_name: authState.userData.first_name, last_name: authState.userData.last_name }),
          signal: signal.signal
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error((await res.json()).message)
          }
          return res.json()
        }).catch(e => {
          console.error(e)
          Alert.alert('Payment Setup Failed', 'An error occurred while setting up your payment method', [{
            onPress: close,
            style: 'cancel'
          }])
        })
        if (sessionID) {
          console.log(sessionID)
          setCheckOutSessionID(sessionID);
        }
      })();
    }
    return () => signal.abort()
  }, []);

  return (
    <View style={{ flexGrow: 1, padding: 8, backgroundColor: '#fff', borderRadius: 8, alignItems: "stretch", }}>
      {!CHECKOUT_SESSION_ID ?
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <ActivityIndicator />
        </View>
        :
        <>
          {!show ?
            <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
              <ActivityIndicator />
            </View>
            : null}
          <MyWebView
            style={{ flex: 1, display: show ? 'flex' : 'none' }}
            stripePublicKey={env.STRIPE.PUBLIC_KEY}
            options={{
              sessionID: CHECKOUT_SESSION_ID,
              successUrl: CALLBACK_URL.SUCCESS,
              cancelUrl: CALLBACK_URL.CANCELLED,
            }}
            onLoadingComplete={() => setShow(true)}
            onLoadingFail={() => Alert.alert('Payment Setup Failed', 'An error occurred while setting up your payment method', [{ onPress: close, style: 'cancel' }])}
            onSuccess={close}
            onCancel={() => Alert.alert('Payment Setup Failed', 'Payment method setup was not completed', [{ onPress: close, style: 'cancel' }])}
          />
        </>
      }
      {!CHECKOUT_SESSION_ID || !show ? children : null}
    </View>
  );
}

export function MyWebView({ options, stripePublicKey, onSuccess, onCancel, onLoadingComplete, onLoadingFail, style }) {
  const webViewRef = useRef()
  const STRIPE_CHECKOUT_HTML = `
  <html>
  <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://js.stripe.com/v3/"></script>
    </head>
      <body>
              <script>
                 window.addEventListener('load', function(){
                      try{
                              var stripe = Stripe("${stripePublicKey}");
                              stripe.redirectToCheckout({ sessionId: "${options.sessionID}" })
                              .then(function(result){
                                      if (result.error) {
                                        return  window.ReactNativeWebView.postMessage('ping');
                                      }
                                      
                                      window.ReactNativeWebView.postMessage('pong');
                              })
                              .catch(function(error){
                                  window.ReactNativeWebView.postMessage('ping')
                                  console.error('Error:', error);
                              });
                      }catch(e){
                          window.ReactNativeWebView.postMessage('ping')
                      }
                    })   
              </script>
      </body>
  </html>

  `

  const onNavHandler = useCallback((event) => {
    const { url } = event
    if (!url || !options.successUrl || !options.cancelUrl || !webViewRef.current) {
      return true
    }
    // Match a successful URL
    if (url.includes(options.successUrl)) {
      webViewRef.current.stopLoading()
      onSuccess()
      return false
    }
    // Match a cancelled URL
    if (url.includes(options.cancelUrl)) {
      webViewRef.current.stopLoading()
      onCancel()
      return false
    }
    return true
  }, [options])

  return (
    <WebView
      onShouldStartLoadWithRequest={onNavHandler}
      style={[{ alignItems: 'stretch', alignSelf: 'stretch', position: 'relative', paddingVertical: 4 }, style]}
      containerStyle={{ alignItems: 'stretch', flexGrow: 1, position: 'relative' }}
      source={{
        html: STRIPE_CHECKOUT_HTML
        // uri: 'https://google.com'
      }}
      onMessage={(e) => {
        switch (e.nativeEvent.data) {
          case 'pong':
            // Load and redirest to Stripe was successful
            setTimeout(onLoadingComplete, 1000)
            break
          case 'ping':
            // An error occurred
            onLoadingFail()
            break
        }
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      originWhitelist={'*'}
      onError={onLoadingFail}
      onHttpError={onLoadingFail}
      ref={webViewRef}
    />
  )
}

// Payments Section
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

const PaymentItemRow = styled.View`
  background: white;
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const PaymentItemRowLink = styled.View`
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
