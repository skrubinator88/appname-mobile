import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

export const RootStack = createStackNavigator();

import { AntDesign } from "@expo/vector-icons";

// Screens
import { RootScreen } from "./index";
import { SignInScreen } from "../signIn";
import { SignInScreen2 } from "../signIn/2";
import { SignUpScreen } from "../signUp";
import { SignUpContractorsScreen } from "../signUp/contractors/";
import { SignUpContractorScreen2 } from "../signUp/contractors/2";
import { SignUpContractorScreen3 } from "../signUp/contractors/3";
import { SignUpContractorScreen4 } from "../signUp/contractors/4";

import { RegistrationContext } from "../../../components/context";

export function NotAuthenticatedStackScreen({ navigation }) {
  return (
    <RegistrationContext.Provider value={{}}>
      <RootStack.Navigator headerMode="none">
        <RootStack.Screen name="Root" component={RootScreen} />

        {/* Sign In */}
        <RootStack.Screen name="SignIn" component={SignInScreen} />
        <RootStack.Screen name="SignIn2" component={SignInScreen2} />

        {/* Sign Up */}

        <RootStack.Screen name="SignUp" component={SignUpScreen} />
        <RootStack.Screen name="SignUpContractor" component={SignUpContractorsScreen} />
        <RootStack.Screen name="SignUpContractor2" component={SignUpContractorScreen2} />
        <RootStack.Screen name="SignUpContractor3" component={SignUpContractorScreen3} />
        <RootStack.Screen name="SignUpContractor4" component={SignUpContractorScreen4} />

        {/* <RootStack.Screen name="Sign Up" component={SignUpStackScreen} /> */}
      </RootStack.Navigator>
    </RegistrationContext.Provider>
  );
}
