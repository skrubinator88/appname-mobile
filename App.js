// IMPORTS
import React, { useEffect, useReducer } from "react";
import { View, ActivityIndicator, Text, TextInput } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthContext } from "./components/context";
// import { Screen45 } from "./views/45";
// import Example from "./screens/not-authenticated/signUp/schoolModal";
// import Example from "./views/27";

// Disable Font Scaling
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

import { NotAuthenticatedStackScreen } from "./screens/not-authenticated/root/stack";
import { AuthenticatedStackScreen } from "./screens/authenticated/root/stack";

import { YellowBox } from "react-native";
import _ from "lodash";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

// Theme
export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#548ff7",
  },
};

const initialLoginState = {
  isLoading: true,
  userName: null,
  userToken: null,
};

import loginReducer from "./reducers/loginReducer";

export default function App({ navigation }) {
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);
  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser) => {
        // parameter foundUser: Array, Length: 1, Contains: Username and Token properties
        // Fetch from Server API (DEMOSTRATION)
        const userToken = String(foundUser[0].userToken);
        const userName = foundUser[0].username;
        try {
          await AsyncStorage.setItem("userToken", userToken);
        } catch (e) {}
        dispatch({ type: "LOGIN", id: userName, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {}
        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );

  useEffect(() => {
    (async () => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        // console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    })();
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={Theme}>
        {loginState.userToken ? (
          <>
            <AuthenticatedStackScreen />
            {/* <Example /> */}
          </>
        ) : (
          <>
            <NotAuthenticatedStackScreen />
            {/* <Example /> */}
          </>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
