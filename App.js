// IMPORTS
import React, { useState, useEffect, createContext, useReducer } from "react";
import { View, Platform, ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-community/async-storage";

// Navigation
// navigator.push("screenName") || navigation.navigate("screenName") Adds another screen into the stack.
// navigator.pop() || navigation.goBack() remove one screen from the stack. In other words goes back to previous screen.
// navigation.popToTop() goes back to first screen in stack

// Passing data to routes
// navigation.navigate('RouteName', { /* params go here */ }) // pass data as params (props) between screens. (props.route): route.params
// Note: navigation.navigate("routeName", {}) if the screen is below, it will work as goBack() function and you can send data back

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import HomeScreen from "./screens/authenticated/homeScreen";
import SignInScreen from "./screens/not_authenticated/signInScreen";
import SignUpScreen from "./screens/not_authenticated/signUpScreen";
import ResetPasswordScreen from "./screens/not_authenticated/resetPasswordScreen";

import { AuthContext } from "./components/context";

const Stack = createStackNavigator();
function fetchAuthFromServer() {}

export default function App() {
  // User auth fetched from server (Simulation)
  // const [isLoading, setIsLoading] = useState(true);
  // const [userToken, setUserToken] = useState(null); //"AYjyMzY3ZDhiNmJkNTY";
  // const isSignOut = false;

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
      signIn: async (userName, password) => {
        // Fetch from Server API
        let userToken = null;
        if (userName == "user" && password == "pass") {
          userToken = "AYjyMzY3ZDhiNmJkNTY";
          try {
            await AsyncStorage.setItem("userToken", userToken);
          } catch (e) {
            console.log(e);
          }
        }
        dispatch({ type: "LOGIN" });
      },
      signOut: async () => {
        // setUserToken(null);
        // setIsLoading(false);
        console.log("signed Out");
        dispatch({ type: "LOGOUT", id: userName, token: userToken });
      },
      signUp: () => {
        // Set user token
        setUserToken("AYjyMzY3ZDhiNmJkNTY");
        setIsLoading(false);
        console.log("signing Up");
      },
    }),
    []
  );

  useEffect(() => {
    // Get TOKEN from AsyncStorage
    setTimeout(async () => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (e) {
        console.log(e);
      }
    }, 1000);
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
        {loginState.userToken === null ? (
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="Home" component={SignInScreen} />
          </Stack.Navigator>
        ) : (
          <HomeScreen />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
