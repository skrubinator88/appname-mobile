import React, { useState, useEffect, useContext } from "react";
import {
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";

import { AuthContext } from "../../../components/context";

export function SignInScreen2({ navigation }) {
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
    authContext.signIn([{ userToke: "adkjfhlakjdhf", userName: "User" }]);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <ContainerTop>
            <AntDesign
              name="arrowleft"
              size={30}
              color="black"
              onPress={() => navigation.goBack()}
            />
          </ContainerTop>
          <ContainerTopMiddle>
            <TextStyled>Enter the 4-digit code sent to you at:</TextStyled>
            <TextStyled style={{ marginTop: 0 }}>( xxx ) xxx - xxxx</TextStyled>
            <ContainerMiddle>
              <SmoothPinCodeInput {...handleSettingsPinCodeProps} />
            </ContainerMiddle>
            <ButtonStyled onPress={(e) => handleSubmit(e)}>
              <Text style={{ color: "white" }}>Continue</Text>
            </ButtonStyled>

            <ContainerBottom>
              <TextStyledBottom>Didn't get it?</TextStyledBottom>
              <TextStyledBottomAction>Resend code</TextStyledBottomAction>
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

const TextInputStyled = styled.TextInput`
  margin: 10px;
  border: black;
  border-radius: 1px;
  text-align: center;
  height: 50px;
  width: 50px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "17px")};
`;

const TextStyledBottom = styled.Text`
  font-size: 17px;
`;
const TextStyledBottomAction = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: #4893ee;
`;

const ButtonStyled = styled.TouchableOpacity`
  background-color: #548ff7;
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

const ContainerTop = styled.View`
  margin-top: ${() => (Platform.OS == "ios" ? "40px" : "70px")};
  margin-left: 30px;
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
