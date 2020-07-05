import React, { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";

import {
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

// Components
import Header from "../../../components/header";

export function SignInScreen({ navigation }) {
  const { colors } = useTheme();
  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [thirdInput, setThirdInput] = useState("");

  let firstTextInput;
  let secondTextInput;
  let thirdTextInput;

  const handleRef = (input, inputPosNumber) => {
    switch (inputPosNumber) {
      case 1:
        firstTextInput = input;
        break;
      case 2:
        secondTextInput = input;
        break;
      case 3:
        thirdTextInput = input;
        break;
    }
  };

  const handleChange = (text, inputPosNumber, maxLength) => {
    if (text.length == maxLength) {
      switch (inputPosNumber) {
        case 1:
          setFirstInput(text);
          secondTextInput.focus();
          break;
        case 2:
          if (secondInput.length == 1 && text.length == 0) {
            firstTextInput.focus();
          }
          setSecondInput(text);
          thirdTextInput.focus();
          break;
        case 3:
          if (thirdInput.length == 1 && text.length == 0) {
            secondTextInput.focus();
          }
          setThirdInput(text);
          break;
      }
    }

    if (text.length == 0) {
      switch (inputPosNumber) {
        case 2:
          setSecondInput(text);
          firstTextInput.focus();
          break;
        case 3:
          setThirdInput(text);
          secondTextInput.focus();
          break;
      }
    }
  };

  const handleSettingsProps = (inputPosNumber, maxLength) => {
    return {
      maxLength: maxLength,
      underlineColorAndroid: "transparent",
      keyboardType: "numeric",
      ref: (input) => {
        handleRef(input, inputPosNumber);
      },
      onChange: (e) => {
        handleChange(e.nativeEvent.text, inputPosNumber, maxLength);
      },
      onSubmitEditing: () => {
        handleSubmit();
      },
    };
  };

  const handleSubmit = (e) => {
    if (firstInput.length + secondInput.length + thirdInput.length != 10) {
      console.log("asd");
      return;
    }

    // Send phone number to backend
    const phoneNumber = `(${firstInput}) ${secondInput}-${thirdInput}`;
    navigation.navigate("SignIn2");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header navigation={navigation} />

          <ContainerTopMiddle>
            <TextStyled>Please enter your phone number</TextStyled>

            <ContainerMiddle>
              <TextInputStyled {...handleSettingsProps(1, 3)} />
              <TextInputStyled {...handleSettingsProps(2, 3)} />
              <TextInputStyled {...handleSettingsProps(3, 4)} />
            </ContainerMiddle>

            <ButtonStyled
              onPress={(e) => handleSubmit(e)}
              style={{ backgroundColor: colors.primary }}
            >
              <Text style={{ color: "white" }}>Continue</Text>
            </ButtonStyled>
          </ContainerTopMiddle>
        </Container>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const TextInputStyled = styled.TextInput`
  margin: 10px;
  border: black;
  border-radius: 1px;
  text-align: center;
  height: 50px;
  width: 70px;
  font-size: 23px;
`;

const ButtonStyled = styled.TouchableOpacity`
  padding: 15px;
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
  font-size: 20px;
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
