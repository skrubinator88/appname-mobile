// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const HelpStack = createStackNavigator();

// import pages
import PaymentScreen from "./";
import StripeModal from "./stripe";

export default function PaymentStackScreen() {
  return (
    <HelpStack.Navigator headerMode="none">
      <HelpStack.Screen name="Payment" component={PaymentScreen} />
      <HelpStack.Screen name="Stripe" component={StripeModal} />
    </HelpStack.Navigator>
  );
}
