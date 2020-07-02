// IMPORTS
import React, { useEffect, useReducer } from "react";

import AsyncStorage from "@react-native-community/async-storage";

export function store() {
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
}
export const initialLoginState = {
  isLoading: true,
  userName: null,
  userToken: null,
};

export const loginReducer = (prevState, action) => {
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

export const [loginState, dispatch] = useReducer(
  loginReducer,
  initialLoginState
);

export const authContext = React.useMemo(
  () => ({
    signIn: async (foundUser) => {
      // parameter foundUser: Array, Length: 1, Contains: Username and Token properties
      console.log("Sign In");
      // Fetch from Server API (DEMOSTRATION)
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

export function usingEffect(dispatch) {
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
}
