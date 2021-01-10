import React, { useState, useEffect, useContext } from "react";
import env from "../../../env";

import { Image, Dimensions } from "react-native";

import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import { SimpleLineIcons } from "@expo/vector-icons";

const width = Dimensions.get("screen").width;

import { GlobalContext } from "../../../components/context";
import { RegistrationContext } from "../../../components/context";

// Components
import Text from "../../../components/text";

export default function SignUp9({ navigation, route }) {
  // Registration Context
  const { registrationState, methods } = useContext(RegistrationContext);

  // Global Context
  const { authActions, authState, errorActions } = useContext(GlobalContext);
  const { colors } = useTheme();

  const signIn = () => {
    (async () => {
      const body = {
        phone_number: registrationState.phone_number,
        code: null,
        clientServerKey: env.SERVER_KEY,
      };

      const res = await fetch(`${env.API_URL}/users/login`, {
        method: "POST",
        credentials: "same-origin",
        // signal: signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const user_login_data = await res.json();

      if (user_login_data.token) {
        // clearTimeout(fetchExpirationTime);
        const response = await fetch(`${env.API_URL}/users/${user_login_data.userName}`, {
          method: "GET",
          // signal: signal,
          headers: {
            Authorization: `bearer ${user_login_data.token}`,
          },
        });
        const user_profile = await response.json();
        if (user_profile) {
          authActions.signIn([{ userToken: user_login_data.token, userName: user_login_data.userName, profile: user_profile }]);
        }
      }
    })();
  };

  return (
    <Container>
      <Text style={{ fontSize: 30 }}>All is set and done!</Text>

      <Text medium>
        Congratulations <Text style={{ fontWeight: "700" }}>{route.params.name}!</Text> {"\n"}Next, tap continue to take you to the next
        screen.
      </Text>

      {/* <Image source={require("../../../assets/submitProfilePhoto.png")} style={{ borderRadius: 1000, width: 240, height: 240 }} /> */}
      <SimpleLineIcons name="check" size={width * 0.5} color={colors.primary} />

      <ButtonStyled onPress={(e) => signIn()} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
        <Text style={{ color: "white" }}>Continue</Text>
      </ButtonStyled>
    </Container>
  );
}

const Container = styled.View`
  background: white;
  flex: 1;
  padding: 7%;
  align-items: center;
  justify-content: space-evenly;
`;

const ButtonStyled = styled.TouchableOpacity`
  padding: 15px;
  width: 80%;
  border-radius: 6px;
  border: 1px solid;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;
