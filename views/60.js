import React, { Component } from "react";

import { Image, Button, Alert, TextInput, View } from "react-native";

import { Platform, Dimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

// Components
import Container from "../components/headerAndContainer";
import Text from "../components/text";

const isIos = Platform.OS === "ios";
const SPACER_SIZE = Dimensions.get("window").height / 2; //arbitrary size

export function Screen60({ navigation }) {
  return (
    <Container
      navigation={true}
      nextTitle="Save"
      color="white"
      title="Payment"
      titleWeight="300"
      headerBackground="#3869f3"
      nextProvider="Entypo"
      nextIcon="dots-three-horizontal"
      nextSize={25}
      nextAction={() => {}}
    >
      {/* Payments Section */}

      <PaymentSection>
        <SectionTitle>
          <View style={{ margin: 10 }}>
            <Text small bold color="#474747">
              PAYMENT METHODS
            </Text>
          </View>
        </SectionTitle>

        <PaymentItemRow>
          <PaymentItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              APPLE PAY
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </PaymentItemRowLink>
        </PaymentItemRow>

        <PaymentItemRow>
          <PaymentItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              PAYPAL
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </PaymentItemRowLink>
        </PaymentItemRow>

        <PaymentItemRow>
          <PaymentItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              VISA ****0593
            </Text>
            <Text small weight="700" color="#4a4a4a">
              EXP: 00/00
            </Text>
          </PaymentItemRowLink>
        </PaymentItemRow>

        <PaymentItemRow>
          <PaymentItemRowLink>
            <Text small weight="700" color="#3869f3">
              ADD PAYMENT METHOD
            </Text>
          </PaymentItemRowLink>
        </PaymentItemRow>
      </PaymentSection>

      {/* Preffered Section */}

      <PaymentSection>
        <SectionTitle>
          <View style={{ margin: 10 }}>
            <Text small bold color="#474747">
              PREFERRED METHODS
            </Text>
          </View>
        </SectionTitle>

        <PaymentItemRow>
          <PaymentItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              APPLE PAY
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </PaymentItemRowLink>
        </PaymentItemRow>
      </PaymentSection>
    </Container>
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
