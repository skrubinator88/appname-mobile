// Dependencies
import { useMemo } from "react";
import AsyncStorage from "@react-native-community/async-storage";

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
        const profile = foundUser[0].profile;
        const userData = {
          userToken,
          userID,
          profile,
        };
        try {
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
        } catch (e) {
          handleError(e, error_dispatch);
        }
        dispatch({ type: "LOGIN", id: userID, token: userToken, profile: profile });
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

exports.retrieve_user_token_local_storage = async ({ dispatch, error_dispatch }) => {
  let userData = null;
  try {
    const data = await AsyncStorage.getItem("userData");
    userData = JSON.parse(data);
  } catch (e) {
    handleError(e, error_dispatch);
  }
  dispatch({ type: "RETRIEVE_TOKEN", token: userData?.userToken, profile: userData?.profile, id: userData?.userID });
};
