import React, { Component } from "react";

import { Image, Button, Alert, TextInput, View, SafeAreaView } from "react-native";

import { Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

// Components
import Text from "../../../components/text";

export default function ({ navigation }) {
  const { colors } = useTheme();

  return (
    <Container>
      <Text style={{ fontSize: 30 }}>Perform a background check</Text>

      <Text medium>
        All personal information is protected and remains private. We do not run credit checks, so your credit wil not be affected. All
        provided information is safe, secure and never shared.
      </Text>

      <Image source={require("../../../assets/backgroundCheck.png")} />

      <ButtonStyled onPress={(e) => navigation.navigate("SignUp8")} style={{ backgroundColor: colors.primary }}>
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
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;
