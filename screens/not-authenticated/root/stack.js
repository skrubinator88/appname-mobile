import React, { useContext } from "react";
import { Text, Image, Alert } from "react-native";
import styled from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";

export const RootStack = createStackNavigator();

// Screens
import { RootScreen } from "./index";
import { SignInScreen } from "../signIn";
import { SignInScreen2 } from "../signIn/2";
// import { SignUpScreen } from "../../single-screens/not-authenticated/signUpStackScreen";

export function NotAuthenticatedStackScreen({ navigation }) {
  return (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name="Root" component={RootScreen} />

      <RootStack.Screen name="SignIn" component={SignInScreen} />
      <RootStack.Screen name="SignIn2" component={SignInScreen2} />

      {/* <RootStack.Screen name="Sign Up" component={SignUpStackScreen} /> */}
    </RootStack.Navigator>
  );
}
