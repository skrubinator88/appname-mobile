import React, { useState, useEffect } from "react";
import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

export function SignInScreen({ navigation }) {
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
      case 2:
        secondTextInput = input;
      case 3:
        thirdTextInput = input;
    }
  };

  const handleChange = (text, inputPosNumber, maxLength) => {
    if (text.length == maxLength) {
      switch (inputPosNumber) {
        case 1:
          setFirstInput(text);
          secondTextInput.focus();
        case 2:
          if (secondInput.length == 1 && text.length == 0) {
            firstTextInput.focus();
          }
          setSecondInput(text);
          thirdTextInput.focus();
        case 3:
          if (thirdInput.length == 1 && text.length == 0) {
            secondTextInput.focus();
          }
          setThirdInput(text);
      }
    }

    if (text.length == 0) {
      switch (inputPosNumber) {
        case 2:
          setSecondInput(text);
          firstTextInput.focus();
        case 3:
          setThirdInput(text);
          secondTextInput.focus();
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
    };
  };

  const handleSubmit = (e) => {
    // Send phone number to backend
    const phoneNumber = `(${firstInput}) ${secondInput}-${thirdInput}`;
    navigation.navigate("SignIn2");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
          <TextStyled>Please enter your phone number</TextStyled>

          <ContainerMiddle>
            <TextInputStyled {...handleSettingsProps(1, 3)} />
            <TextInputStyled {...handleSettingsProps(2, 3)} />
            <TextInputStyled {...handleSettingsProps(3, 4)} />
          </ContainerMiddle>

          <ButtonStyled onPress={(e) => handleSubmit(e)}>
            <Text style={{ color: "white" }}>Continue</Text>
          </ButtonStyled>
        </ContainerTopMiddle>
      </Container>
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
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "17px")};
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
  margin-top: 70px;
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
