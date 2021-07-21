// Dependencies
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import _ from "lodash";
import React, { useEffect, useReducer } from "react";
import { ActivityIndicator, Text, TextInput, View, AppState, LogBox, Platform, An } from "react-native";
import * as ExpoNotif from "expo-notifications";
// Redux
import { Provider } from "react-redux";
// Imported Actions
import AuthActions from "./actions/AuthActions";
import AppActions from "./actions/AppActions";
import ErrorActions from "./actions/ErrorActions";
// Imported Store
import { GlobalContext } from "./components/context";
import { rootStore } from "./rdx-store/root.store";
// Reducers
import AuthReducer from "./reducers/AuthReducer";
import AppReducer from "./reducers/AppReducer";
import ErrorReducer from "./reducers/ErrorReducer";
import { AuthenticatedStackScreen } from "./screens/authenticated/root/stack";
import { NotAuthenticatedStackScreen } from "./screens/not-authenticated/root/stack";
import Prompts from "./components/Prompts";
import { default as Example } from "./components/Example";
import { AndroidImportance, AndroidNotificationVisibility } from "expo-notifications";
import SVG from "./assets/gig-logo";

// // Disable Font Scaling
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// // Ignore Some Warnings
LogBox.ignoreLogs(["Setting a timer", "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation"]);

// // Theme
const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#548ff7",
    contractor: "#548ff7",
    project_manager: "green",
  },
};

let appState = AppState.currentState;
ExpoNotif.setNotificationHandler({
  handleNotification: (n) => {
    const behavior = {
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowAlert: true,
    };

    if (n.request.trigger.type === "push" && appState === "active") {
      if (n.request.content.data.type === "newmessage") {
        console.log("not discarding notification when app is active ======>");
        return null;
      } else return behavior;
    } else {
      return behavior;
    }
  },
});

export default function App() {
  // Store
  const [authState, auth_dispatch] = useReducer(AuthReducer, { isLoading: true });
  const [app_dispatch] = useReducer(AppReducer, {});
  const [error_dispatch] = useReducer(ErrorReducer, { errorMsg: "" });

  const thisComponentAuthState = { dispatch: auth_dispatch };
  const thisComponentAppState = { dispatch: app_dispatch };
  const thisComponentErrorState = { dispatch: error_dispatch };

  // Actions
  const authActions = AuthActions.memo(thisComponentAuthState);
  const appActions = AppActions.memo(thisComponentAppState);
  const errorActions = ErrorActions.memo(thisComponentErrorState);

  const notificationHandler = React.useRef(async (n) => {
    console.log(n.request, "notification handler");
  });
  const notificationResponseHandler = React.useRef((res) => {
    if (res.actionIdentifier === ExpoNotif.DEFAULT_ACTION_IDENTIFIER) {
      // TODO: decide what to do when notification is received
    }
    console.log("response for notification", res);
  });

  // Effect for registering notification handlers
  React.useLayoutEffect(() => {
    let subscriptions;

    Promise.all([
      ExpoNotif.addNotificationReceivedListener(notificationHandler.current),
      ExpoNotif.addNotificationResponseReceivedListener(notificationResponseHandler.current),
      async () => {
        if (Platform.OS === "android") {
          await ExpoNotif.setNotificationChannelAsync(`GigChasers-Notification`, {
            name: `GigChasers-Notification`,
            sound: "default",
            importance: AndroidImportance.MAX,
            bypassDnd: false,
            lockscreenVisibility: AndroidNotificationVisibility.PRIVATE,
            vibrationPattern: [0, 250, 250, 250],
          });
        }
      },
    ])
      .then((subs) => {
        subscriptions = subs;
      })
      .catch((e) => {
        console.log(e, "Failed to set notification listener");
      });

    return () => {
      if (subscriptions) {
        subscriptions.map((v) => v && v.remove ? v.remove() : null);
      }
    };
  }, []);

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

  return (
    <>
      <Prompts />
      <ActionSheetProvider>
        <GlobalContext.Provider value={{ authActions, appActions, authState, errorActions }}>
          <NavigationContainer theme={Theme}>
            {authState.userToken ? (
              <>
                <Provider store={rootStore}>
                  <AuthenticatedStackScreen />
                </Provider>
              </>
            ) : (
              <>
                <NotAuthenticatedStackScreen />
              </>
            )}
          </NavigationContainer>
        </GlobalContext.Provider>
      </ActionSheetProvider>
    </>
  );
}
