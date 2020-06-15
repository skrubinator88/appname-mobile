import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";

import { createStackNavigator } from "@react-navigation/stack";
export const SignUpStack = createStackNavigator();

export function SignUpStackScreen() {
  return (
    <Container>
      <Text>Sign Up Screen</Text>
    </Container>
  );
}
