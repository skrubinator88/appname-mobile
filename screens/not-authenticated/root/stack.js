import React, { useReducer, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

export const RootStack = createStackNavigator();

// Screens
import { RootScreen } from "./index";
import { SignInScreen } from "../signIn";
import { SignInScreen2 } from "../signIn/2";
import SignUpScreenIndex from "../signUp";
import SignUpScreen1 from "../signUp/1";
import SignUpScreen2 from "../signUp/2";
import SignUpScreen3 from "../signUp/3";
import SignUpScreen4 from "../signUp/4";
import SignUpScreen5 from "../signUp/5";
import SignUpScreen6 from "../signUp/6";
import AddSkills from "../signUp/addSkills";

import { RegistrationContext } from "../../../components/context";
import registrationReducer from "../../../reducers/registrationReducer";

const initialState = {
  role: "",
  first_name: "",
  last_name: "",
  occupation: "",
  city: "",
  state: "",
  email: "",
  phone_number: "",
  profile_bio: "",
  date_created: "",
  account_status: "Pending",
  formSended: false,
  work_history: [],
  educational_background: [],
  skills: [],
  licenses: [],
};

export function NotAuthenticatedStackScreen({ navigation }) {
  const [registrationState, dispatch] = useReducer(registrationReducer, initialState);
  const registrationContext = React.useMemo(
    () => ({
      updateForm: (form, formSended_Boolean) => {
        dispatch({ type: "UPDATE", form, formSended_Boolean });
      },
      pushItemFormField: (item, field) => {
        dispatch({ type: "PUSH", item, field });
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

        <RootStack.Screen name="SignUpIndex" component={SignUpScreenIndex} />
        <RootStack.Screen name="SignUp1" component={SignUpScreen1} />
        <RootStack.Screen name="SignUp2" component={SignUpScreen2} />
        <RootStack.Screen name="SignUp3" component={SignUpScreen3} />
        <RootStack.Screen name="SignUp4" component={SignUpScreen4} />
        <RootStack.Screen name="SignUp5" component={SignUpScreen5} />
        <RootStack.Screen name="SignUp6" component={SignUpScreen6} />
        <RootStack.Screen name="AddSkills" component={AddSkills} />

        {/* <RootStack.Screen name="Sign Up" component={SignUpStackScreen} /> */}
      </RootStack.Navigator>
    </RegistrationContext.Provider>
  );
}
