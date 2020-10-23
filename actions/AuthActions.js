// Dependencies
import { useMemo } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import env from "../env";

function handleError(e, dispatch) {
  console.log(e);
  dispatch({ type: "ERROR", errorMsg: e.message });
}

exports.memo = ({ dispatch, error_dispatch }) => {
  return useMemo(
    () => ({
      signIn: async (foundUser) => {
        const userToken = foundUser[0].userToken;
        const userID = foundUser[0].userName;
        const userData = {
          userToken,
          userID,
        };
        try {
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
        } catch (e) {
          handleError(e, error_dispatch);
        }
        dispatch({ type: "LOGIN", id: userID, token: userToken });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userData");
        } catch (e) {
          handleError(e, error_dispatch);
        }
        dispatch({ type: "LOGOUT" });
      },
    }),
    []
  );
};

exports.retrieve_user_info = async ({ dispatch, error_dispatch }) => {
  let userData = null;
  try {
    const data = await AsyncStorage.getItem("userData");
    userData = JSON.parse(data);

    const response = await fetch(`${env.API_URL}/users/${userData?.userID}`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${userData?.userToken}`,
      },
    });
    userData.profile = await response.json();
  } catch (e) {
    handleError(e, error_dispatch);
  }
  dispatch({ type: "RETRIEVE_TOKEN", token: userData?.userToken, id: userData?.userID, profile: userData?.profile });
};
