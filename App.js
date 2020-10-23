// Dependencies
import React, { useEffect, useReducer } from "react";
import { View, ActivityIndicator, Text, TextInput, BackHandler } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

// Disable Font Scaling
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// Disable warnings
import { YellowBox } from "react-native";
import _ from "lodash";
YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") != -1) {
    return;
  }
  if (message.indexOf("VirtualizedLists") != -1) {
    return;
  }
  _console.warn(message);
};
// console.disableYellowBox = true;

// Theme
export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#548ff7",
  },
};

// Imported Store
import { GlobalContext } from "./components/context";

// Imported Actions
import AuthActions from "./actions/AuthActions";
import ErrorActions from "./actions/ErrorActions";

// Reducers
import AuthReducer from "./reducers/AuthReducer";
import ErrorReducer from "./reducers/ErrorReducer";

// Components
// import Example from "./views/chat";
import Example from "./screens/authenticated/chat/";
import { NotAuthenticatedStackScreen } from "./screens/not-authenticated/root/stack";
import { AuthenticatedStackScreen } from "./screens/authenticated/root/stack";

// Redux
import { Provider } from "react-redux";
import { rootStore } from "./rdx-store/root.store";

export default function App({ navigation }) {
  // Store
  const [authState, auth_dispatch] = useReducer(AuthReducer, { isLoading: true });
  const [errorState, error_dispatch] = useReducer(ErrorReducer, { errorMsg: "" });

  const thisComponentAuthState = { dispatch: auth_dispatch, setError: error_dispatch };
  const thisComponentErrorState = { dispatch: error_dispatch };

  // Actions
  const authActions = AuthActions.memo(thisComponentAuthState);
  const errorActions = ErrorActions.memo(thisComponentErrorState);

  // Retrieve token stored in local memory
  useEffect(() => {
    // Retrieve token from local storage and fetch user data from database
    AuthActions.retrieve_user_info(thisComponentAuthState);
  }, []);

  if (authState.isLoading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (errorState.message) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{errorState.message}</Text>
      </View>
    );
  }

  return (
    <GlobalContext.Provider value={{ authActions, authState, errorActions }}>
      <NavigationContainer theme={Theme}>
        {authState.userToken ? (
          <>
            <Provider store={rootStore}>
              {/* <Example /> */}
              <AuthenticatedStackScreen />
            </Provider>
          </>
        ) : (
          <>
            <NotAuthenticatedStackScreen />
            {/* <Example /> */}
          </>
        )}
      </NavigationContainer>
    </GlobalContext.Provider>
  );
}
