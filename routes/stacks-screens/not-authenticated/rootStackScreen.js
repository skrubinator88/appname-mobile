import React, { useContext } from "react";
import { Text, Image, Alert } from "react-native";
import styled from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";

export const RootStack = createStackNavigator();

// Screens
import { RootScreen } from "../../single-screens/not-authenticated/rootScreen";
import { SignInScreen } from "../../single-screens/not-authenticated/signInScreen";
// import { SignUpScreen } from "../../single-screens/not-authenticated/signUpStackScreen";

export function RootStackScreen({ navigation }) {
  return (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name="Root Screen" component={RootScreen} />

      <RootStack.Screen name="Sign In" component={SignInScreen} />
      {/* <RootStack.Screen name="Sign In" component={SignInStackScreen} /> */}

      {/* <RootStack.Screen name="Sign Up" component={SignUpStackScreen} /> */}
    </RootStack.Navigator>
  );
}
