// IMPORTS
import React, { useEffect, useReducer } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

// Navigation
// navigation.navigate("screenName") Adds another screen into the stack.
// navigation.goBack() remove one screen from the stack. In other words goes back to previous screen.
// navigation.popToTop() goes back to first screen in stack

// Passing data to routes
// navigation.navigate('RouteName', { /* params go here */ }) // pass data as params (props) between screens. (props.route): route.params
// Note: navigation.navigate("routeName", {}) if the screen is below, it will work as goBack() function and you can send data back

// REACT NATIVE NAVIGATION 5 IMPORTS
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NotAuthenticatedStackScreen } from "./screens/not-authenticated/root/stack";
import { AuthenticatedStackScreen } from "./screens/authenticated/root/stack";

// // Context
import { AuthContext } from "./components/context";

const Drawer = createDrawerNavigator();

export default function App({ navigation }) {
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser) => {
        // parameter foundUser: Array, Length: 1, Contains: Username and Token properties
        console.log("Sign In");
        // Fetch from Server API (DEMOSTRATION)
        console.log(foundUser);
        const userToken = String(foundUser[0].userToken);
        const userName = foundUser[0].username;
        try {
          await AsyncStorage.setItem("userToken", userToken);
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGIN", id: userName, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userToken");
        } catch (e) {
          console.log(e);
        }
        dispatch({ type: "LOGOUT" });
        console.log("signed Out");
      },
      signUp: () => {
        console.log("Sign Up");
      },
    }),
    []
  );

  useEffect(() => {
    // setTimeout(async () => {
    setTimeout(async () => {
      let userToken = null;
      try {
        // Get TOKEN from AsyncStorage
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    }, 1000);
    // }, 1000);
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
      <NavigationContainer>
        {loginState.userToken ? (
          <AuthenticatedStackScreen />
        ) : (
          <NotAuthenticatedStackScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
