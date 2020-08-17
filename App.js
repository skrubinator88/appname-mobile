// IMPORTS
import React, { useEffect, useReducer } from "react";
import { View, ActivityIndicator, Text, TextInput, BackHandler } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AuthContext } from "./components/context";
// import { Screen45 } from "./views/45";
// import Example from "./screens/not-authenticated/signUp/schoolModal";
import Example from "./views/work";

// Disable Font Scaling
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// Disable back press action
import { NotAuthenticatedStackScreen } from "./screens/not-authenticated/root/stack";
import { AuthenticatedStackScreen } from "./screens/authenticated/root/stack";

import { YellowBox } from "react-native";
import _ from "lodash";

// Disable warnings
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
};

import loginReducer from "./reducers/loginReducer";

export default function App({ navigation }) {
  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser) => {
        const userToken = foundUser[0].userToken;
        const userID = foundUser[0].userName;
        const profile = foundUser[0].profile;
        const userData = {
          userToken,
          userID,
          profile,
        };
        try {
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", id: userID, token: userToken, profile: profile });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userData");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
      },
      setErrorMessage: async (message) => {
        dispatch({ type: "ERROR", message });
      },
    }),
    []
  );

  useEffect(() => {
    (async () => {
      let userData = null;
      try {
        const data = await AsyncStorage.getItem("userData");
        userData = JSON.parse(data);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userData?.userToken, profile: userData?.profile, id: userData?.userID });
    })();
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (loginState.errorMessage) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{loginState.errorMessage}</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ authContext, globalState: loginState }}>
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
