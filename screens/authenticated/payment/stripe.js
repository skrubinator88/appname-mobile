import moment from "moment";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { WebView } from "react-native-webview";
import styled from "styled-components/native";
import { GlobalContext } from "../../../components/context";
import env from "../../../env";





export const CALLBACK_URL = {
  // SUCCESS: process.env.BASE_HOST_URI + '/api/payments/session/success',
  SUCCESS: 'https://stripe.com/success?sc_checkout=success',
  CANCELLED: 'https://stripe.com/cancel?sc_checkout=cancel',
}

export default function StripeCheckoutScreen({ children, close = () => { } }) {
  const { authState } = useContext(GlobalContext);
  const [CHECKOUT_SESSION_ID, setCheckOutSessionID] = useState("");
  const [show, setShow] = useState(false);

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
          return { sessionID: '' }
        })
        if (sessionID) {
          setCheckOutSessionID(sessionID);
        }
      })();
    }
    return () => signal.abort()
  }, []);

  return (
    <View style={{ flexGrow: 1, padding: 8, backgroundColor: '#fff', justifyContent: 'center', borderRadius: 8, alignItems: "stretch", }}>
      {!CHECKOUT_SESSION_ID ?
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <ActivityIndicator />
        </View>
        :
        <>
          {!show ?
            <View style={{ height: '100%', justifyContent: 'center', padding: 20 }}>
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
            onCancel={(e) => Alert.alert('Payment Setup Failed', e?.message || 'Payment method setup was not completed', [{ onPress: close, style: 'cancel' }])}
          />
        </>
      }
      {!CHECKOUT_SESSION_ID || !show ? children : null}
    </View>
  );
}

export function MyWebView({ options, forAccount, stripePublicKey, onSuccess, onCancel, onLoadingComplete, onLoadingFail, style, timeout = 300000 }) {
  const webViewRef = useRef()
  const timeoutRef = useRef({ timeout, triggerID: undefined })
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
                              window.ReactNativeWebView.postMessage('setup');
                              stripe.redirectToCheckout({ sessionId: "${options.sessionID}" })
                              .then(function(result){
                                      if (result.error) {
                                        return  window.ReactNativeWebView.postMessage('ping');
                                      }                                      
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current.triggerID) {
        clearTimeout(timeoutRef.current.triggerID)
      }
    }
  }, [])

  return (
    <WebView
      onShouldStartLoadWithRequest={onNavHandler}
      style={[{ alignItems: 'stretch', alignSelf: 'stretch', position: 'relative', paddingVertical: 4 }, style]}
      containerStyle={{ alignItems: 'stretch', flexGrow: 1, position: 'relative' }}
      source={forAccount ? {
        uri: options.uri
      } : {
        html: STRIPE_CHECKOUT_HTML
      }}
      onMessage={forAccount ? null : (e) => {
        switch (e.nativeEvent.data) {
          case 'setup':
            if (!forAccount) {
              timeoutRef.current.triggerID = setTimeout(() => onCancel(new Error(`Your session has expired\r\n\r\nWhen you try again, complete process within ${moment.duration(timeout, 'milliseconds').humanize()}`)), timeoutRef.current.timeout)
            }
            break
          case 'ping':
            // An error occurred
            onLoadingFail()
            break
        }
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      bounces={false}
      onLoadEnd={!forAccount ? (e) => {
        if (e.nativeEvent.url.startsWith('https://checkout.stripe.com')) {
          onLoadingComplete()
        }
      } : null}
      originWhitelist={'*'}
      onLoad={onLoadingComplete}
      onError={onLoadingFail}
      onHttpError={onLoadingFail}
      ref={webViewRef}
    />
  )
}
