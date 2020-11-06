import React, { useState, useEffect } from "react";

import { Image, Button, Alert, TextInput, View, ActivityIndicator } from "react-native";

import { Platform, Dimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";

import StripeCheckout from "react-native-stripe-checkout-webview";

// Components
import Header from "../../../components/header";
import Text from "../../../components/text";
import env from "../../../env";

export default function PaymentScreen({ navigation }) {
  const [CHECKOUT_SESSION_ID, setCheckOutSessionID] = useState("");
  const [show, setShow] = useState(0);

  useEffect(() => {
    (async () => {
      const { id } = await fetch(`${env.API_URL}/payments/create_session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setCheckOutSessionID(id);
    })();
  }, []);

  return (
    <>
      <Header
        navigation={navigation}
        color="white"
        title="Payment"
        titleWeight="300"
        headerBackground="#3869f3"
        nextProvider="Entypo"
        nextSize={25}
        nextAction={() => {}}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", display: show ? "none" : "flex" }}>
        <ActivityIndicator />
      </View>
      <View style={{ flex: show, opacity: show }}>
        <StripeCheckout
          stripePublicKey={env.STRIPE.PUBLIC_KEY}
          checkoutSessionInput={{
            sessionId: CHECKOUT_SESSION_ID,
          }}
          onLoadingComplete={() => setShow(1)}
          onSuccess={({ checkoutSessionId }) => navigation.goBack()}
          onCancel={() => navigation.goBack()}
          options={{ htmlContentLoading: "" }}
        />
      </View>
    </>
  );
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
