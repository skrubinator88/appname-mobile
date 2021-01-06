// Dependencies
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import _ from "lodash";
import React, { useEffect, useReducer } from "react";
import { ActivityIndicator, Text, TextInput, View, AppState, YellowBox } from "react-native";
import * as ExpoNotif from "expo-notifications";
// Redux
import { Provider } from "react-redux";
// Imported Actions
import AuthActions from "./actions/AuthActions";
import ErrorActions from "./actions/ErrorActions";
// Imported Store
import { GlobalContext } from "./components/context";
import { rootStore } from "./rdx-store/root.store";
// Reducers
import AuthReducer from "./reducers/AuthReducer";
import ErrorReducer from "./reducers/ErrorReducer";
import { AuthenticatedStackScreen } from "./screens/authenticated/root/stack";
import { NotAuthenticatedStackScreen } from "./screens/not-authenticated/root/stack";

// Disable Font Scaling
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

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

let appState = AppState.currentState
ExpoNotif.setNotificationHandler({
  handleNotification: (n) => {
    if (n.request.trigger.type === 'push' && appState === 'active') {
      console.log('discarding notification when app is active ======>')
      const behavior = null
      return behavior
    } else {
      return {
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowAlert: true,
      }
    }
  }
})

export async function schedulePushNotification(push = true) {
  await ExpoNotif.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', push },
    },
    trigger: null,
  });
}



export default function App({ navigation }) {
  // Store
  const [authState, auth_dispatch] = useReducer(AuthReducer, { isLoading: true });
  const [errorState, error_dispatch] = useReducer(ErrorReducer, { errorMsg: "" });

  const thisComponentAuthState = { dispatch: auth_dispatch };
  const thisComponentErrorState = { dispatch: error_dispatch };

  // Actions
  const authActions = AuthActions.memo(thisComponentAuthState);
  const errorActions = ErrorActions.memo(thisComponentErrorState);


  const notificationHandler = React.useRef(async (n) => {
    console.log(n.request, "notificaiton handler")
  })
  const notificationResponseHandler = React.useRef((res) => {
    if (res.actionIdentifier === ExpoNotif.DEFAULT_ACTION_IDENTIFIER) {
      // TODO: decide what to do when notification is received
    }
    console.log('response for notification', res)
  })


  // Effect for registering notification handlers
  React.useLayoutEffect(() => {
    let subscriptions

    Promise.all(
      [
        ExpoNotif.addNotificationReceivedListener(notificationHandler.current),
        ExpoNotif.addNotificationResponseReceivedListener(notificationResponseHandler.current),
        async () => {
          if (Platform.OS === 'android') {
            await ExpoNotif.setNotificationChannelAsync(`GigChasers-Notification`, {
              name: `GigChasers-Notification`,
              sound: 'default',
              importance: AndroidImportance.MAX,
              bypassDnd: false,
              lockscreenVisibility: AndroidNotificationVisibility.PRIVATE,
              vibrationPattern: [0, 250, 250, 250],
            })
          }
        },
      ]
    ).then((subscriptions) => {
      subscriptions = subscriptions
    }).catch((e) => {
      console.log(e, 'Failed to set notification listener')
    })

    return () => {
      if (subscriptions) {
        subscriptions.map(v => v.remove())
      }
    }
  }, [])


  // Retrieve token stored in local memory
  // TODO: This is a great place to retrieve previously stored active job data for users
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
