// Dependencies
import { useMemo } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import env from "../env";

function handleError(e) {
  console.log(e);
  // dispatch({ type: "ERROR", errorMsg: e.message });
}

exports.memo = ({ dispatch }) => {
  return useMemo(
    () => ({
      signIn: async (foundUser) => {
        try {
          const userToken = foundUser[0].userToken;
          const userID = foundUser[0].userName;
          const response = await fetch(`${env.API_URL}/users/${userID}`, {
            method: "GET",
            headers: {
              Authorization: `bearer ${userToken}`,
            },
          });

          const profile = await response.json();

          const userData = {
            userToken,
            userID,
            profile,
          };

          await AsyncStorage.setItem("userData", JSON.stringify(userData));

          dispatch({ type: "LOGIN", id: userID, token: userToken, profile: profile });
        } catch (e) {
          handleError(e);
        }
      },

      signOut: async () => {
        try {
          await AsyncStorage.removeItem("userData");
        } catch (e) {
          handleError(e);
        }
        dispatch({ type: "LOGOUT" });
      },

      changeRole: async (prevData, newRole) => {
        // Update role in back end database
        const { success } = await fetch(`${env.API_URL}/users/change_role`, {
          method: "PUT",
          body: JSON.stringify({ phone_number: prevData.userData.phone_number, role: newRole }),
        });

        if (success) {
          // Update role in app global store
          dispatch({ type: "CHANGE_ROLE", newRole });

          // Update role in local storage
          await AsyncStorage.setItem("userData", JSON.stringify({ ...prevData, userData: { ...prevData.userData, role: newRole } }));
        }
      },
    }),
    []
  );
};

exports.retrieve_user_info = async ({ dispatch }) => {
  try {
    const data = await AsyncStorage.getItem("userData");
    const userData = JSON.parse(data);

    if (userData) {
      const response = await fetch(`${env.API_URL}/users/${userData?.userID}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${userData?.userToken}`,
        },
      }).catch((e) => console.log(e));

      userData.profile = await response.json();

      dispatch({ type: "RETRIEVE_TOKEN", token: userData?.userToken, id: userData?.userID, profile: userData?.profile });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  } catch (e) {
    dispatch({ type: "LOGOUT" });
    handleError(e);
  }
};
