import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import { Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";

// Components
import Header from "../../../../components/header";

import { AuthContext } from "../../../../components/context";

export function SignUpContractorScreen3({ navigation }) {
  const { colors } = useTheme();
  const authContext = useContext(AuthContext);

  const [pinCode, setPinCode] = useState("");
  let pinInputRef;

  const handleSettingsPinCodeProps = {
    ref: (input) => {
      pinInputRef = input;
    },
    value: pinCode.toString(),
    onTextChange: (code) => setPinCode(code),
    onFulfill: () => {
      handleSubmit();
    },
    restrictToNumbers: true,
    cellSpacing: 10,
    cellStyle: {
      borderWidth: 1,
      borderRadius: 1,
      borderColor: "#999",
    },
    cellStyleFocused: {
      borderColor: "#4893ee",
    },
    textStyle: {
      fontSize: 24,
      color: "#333",
    },
    textStyleFocused: {
      color: "crimson",
    },
  };

  const handleSubmit = (e) => {
    // Send phone number to backend
    // const phoneNumber = `(${firstInput}) ${secondInput}-${thirdInput}`;
    // navigation.navigate("SignIn2");
    // authContext.signIn([{ userToken: "adkjfhlakjdhf", userName: "User" }]);
    navigation.navigate("SignUpContractor4");
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header navigation={navigation} />
          <ContainerTopMiddle>
            <TextStyled>Enter the 4-digit code sent to you at:</TextStyled>
            <TextStyled style={{ marginTop: 0 }}>( xxx ) xxx - xxxx</TextStyled>
            <ContainerMiddle>
              <SmoothPinCodeInput {...handleSettingsPinCodeProps} />
            </ContainerMiddle>
            <ButtonStyled onPress={(e) => handleSubmit(e)} style={{ backgroundColor: colors.primary }}>
              <Text style={{ color: "white" }}>Continue</Text>
            </ButtonStyled>

            <ContainerBottom>
              <TextStyledBottom>Didn't get it?</TextStyledBottom>
              <TextStyledBottomAction style={{ color: colors.primary }}>Resend code</TextStyledBottomAction>
            </ContainerBottom>
          </ContainerTopMiddle>
        </Container>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const ContainerBottom = styled.View`
  ${() => {
    switch (Platform.OS) {
      case "ios":
        return `
        flex: 1; 
        justify-content: center;
        `;
        break;
      case "android":
        return `
        margin: 30px 0;
        `;
        break;
    }
  }}
  align-items: center;
`;

const TextStyledBottom = styled.Text`
  font-size: 17px;
`;
const TextStyledBottomAction = styled.Text`
  font-size: 17px;
  font-weight: bold;
`;

const ButtonStyled = styled.TouchableOpacity`
  padding: ${() => (Platform.OS == "ios" ? "15px" : "10px")};
  width: 80%;
  border-radius: 6px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
`;
const Text = styled.Text`
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "17px")};
`;

const ContainerMiddle = styled.View`
  align-items: center;
  margin: 50px;
  justify-content: center;
  flex-direction: row;
`;

const ContainerTopMiddle = styled.View`
  flex: 1;
  padding: 20px;
  padding-left: 20px;
`;

const TextStyled = styled.Text`
  margin: 20px 0;
  font-size: 31px;
`;
