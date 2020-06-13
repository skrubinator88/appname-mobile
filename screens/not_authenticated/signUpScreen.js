import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const SignUpStack = createStackNavigator();

export function SignUpStackScreen() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>Sign Up Screen</Text>
    </View>
  );
}
