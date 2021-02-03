import React, { useState, useEffect } from "react";

import { Image, Dimensions, SafeAreaView, View } from "react-native";

import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";
import { SimpleLineIcons } from "@expo/vector-icons";

const width = Dimensions.get("screen").width;

// Components
import Text from "../../../components/text";
import Header from "../../../components/header";

export default function BackgroundCheck({ navigation, route }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header navigation={navigation} />

      <Text style={{ fontSize: 30, textAlign: "center" }}>Perform a Background Check</Text>
      <Container>
        <Text medium>
          First, make sure you have a credit card registered in the{" "}
          <Text style={{ color: colors.primary }} onPress={() => navigation.navigate("Payment")}>
            Payment section.{" "}
          </Text>
          {"\n"}Then hit continue.
        </Text>

        <Image source={require("../../../assets/backgroundCheck.png")} style={{ width: width * 0.5, height: width * 0.5 }} />
        {/* <SimpleLineIcons name="check" size={width * 0.5} color={colors.primary} /> */}

        <ButtonStyled
          onPress={(e) => navigation.navigate("Background Check Pricing")}
          style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
        >
          <Text style={{ color: "white" }}>Continue</Text>
        </ButtonStyled>
      </Container>
    </View>
  );
}

const Container = styled.View`
  background: white;
  flex: 1;
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
