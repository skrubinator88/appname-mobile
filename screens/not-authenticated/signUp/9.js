import React, { useState, useEffect } from "react";

import { Image, Dimensions } from "react-native";

import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import { SimpleLineIcons } from "@expo/vector-icons";

const width = Dimensions.get("screen").width;

// Components
import Text from "../../../components/text";

export default function SignUp9({ navigation, route }) {
  const { colors } = useTheme();
  return (
    <Container>
      <Text style={{ fontSize: 30 }}>All is set and done!</Text>

      <Text medium>
        Congratulations <Text style={{ fontWeight: "700" }}>{route.params.name}!</Text> {"\n"}Next, tap continue to take you to the log in
        screen.
      </Text>

      {/* <Image source={require("../../../assets/submitProfilePhoto.png")} style={{ borderRadius: 1000, width: 240, height: 240 }} /> */}
      <SimpleLineIcons name="check" size={width * 0.5} color={colors.primary} />

      <ButtonStyled onPress={(e) => navigation.popToTop()} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
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
