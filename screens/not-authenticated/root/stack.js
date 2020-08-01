import React, { useReducer, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

export const RootStack = createStackNavigator();

// Screens
import { RootScreen } from "./index";
import { SignInScreen } from "../signIn";
import { SignInScreen2 } from "../signIn/2";
import { SignUpScreen } from "../signUp";
import { SignUpContractorsScreen } from "../signUp/contractors/";
import { SignUpContractorScreen2 } from "../signUp/contractors/2";
import { SignUpContractorScreen3 } from "../signUp/contractors/3";
import { SignUpContractorScreen4 } from "../signUp/contractors/4";
import { SignUpContractorScreen5 } from "../signUp/contractors/5";
import SignUpContractorScreen6 from "../signUp/contractors/6";
import AddSkills from "../signUp/contractors/addSkills";

import { RegistrationContext } from "../../../components/context";
import registrationReducer from "../../../reducers/registrationReducer";

export function NotAuthenticatedStackScreen({ navigation }) {
  const [registrationState, dispatch] = useReducer(registrationReducer, { formSended: false });
  const registrationContext = React.useMemo(
    () => ({
      updateForm: (form, formSended_Boolean) => {
        dispatch({ type: "UPDATE", form, formSended_Boolean });
      },
    }),
    []
  );

  return (
    <RegistrationContext.Provider value={{ registrationState, methods: registrationContext }}>
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
        <RootStack.Screen name="SignUpContractor5" component={SignUpContractorScreen5} />
        <RootStack.Screen name="SignUpContractor6" component={SignUpContractorScreen6} />
        <RootStack.Screen name="AddSkills" component={AddSkills} />

        {/* <RootStack.Screen name="Sign Up" component={SignUpStackScreen} /> */}
      </RootStack.Navigator>
    </RegistrationContext.Provider>
  );
}
