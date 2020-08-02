import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";
import { Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView } from "react-native";
import styled from "styled-components/native";

import env from "../../../env";

// Components
import Header from "../../../components/header";

import { RegistrationContext } from "../../../components/context";

export default function ({ navigation }) {
  const { registrationState, methods } = useContext(RegistrationContext);
  const { colors } = useTheme();

  const [textInput, setTextInput] = useState("");
  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [thirdInput, setThirdInput] = useState("");
  const [fourthInput, setFourthInput] = useState("");

  let hiddenTextInput;
  let firstTextInput;
  let secondTextInput;
  let thirdTextInput;
  let fourthTextInput;

  const phoneNumberRender = () => {
    const first = registrationState.phone_number.slice(0, 3);
    const second = registrationState.phone_number.slice(3, 6);
    const third = registrationState.phone_number.slice(6, 10);

    return `(${first}) ${second} - ${third}`;
  };

  const handleSettingsProps = (inputPosNumber, maxLength, value) => {
    return {
      value: value,
      maxLength: maxLength,
      underlineColorAndroid: "transparent",
      keyboardType: "numeric",
      ref: (input) => {
        handleRef(input, inputPosNumber);
      },

      onFocus: () => {
        hiddenTextInput.focus();
      },
      onSubmitEditing: () => {
        handleSubmit();
      },
    };
  };

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

  const handleSubmit = async () => {
    // const code = textInput.toString();
    // const twilio = await fetch(`${env.API_URL}/v1/users/sms_verification?phone_number=${registrationState.phone_number}&code=${code}`, {
    //   method: "POST",
    // });
    // const response = await twilio.json();
    // if (response.data.valid) navigation.navigate("SignUp4");
    navigation.navigate("SignUp4");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header navigation={navigation} />
          <ContainerTopMiddle>
            <TextStyled>Enter the 4-digit code sent to you at:</TextStyled>
            <TextStyled style={{ marginTop: 0 }}>{phoneNumberRender()}</TextStyled>
            <ContainerMiddle>
              <HiddenTextInput
                keyboardType="numeric"
                maxLength={4}
                ref={(ref) => (hiddenTextInput = ref)}
                onChangeText={(text) => {
                  if (text.length <= 10) {
                    setTextInput(text);
                    let first = text.slice(0, 1);
                    let second = text.slice(1, 2);
                    let third = text.slice(2, 3);
                    let fourth = text.slice(3, 4);

                    setFirstInput(first);
                    setSecondInput(second);
                    setThirdInput(third);
                    setFourthInput(fourth);
                  }
                }}
              />
              <TextInputStyled {...handleSettingsProps(1, 1, firstInput)} />
              <TextInputStyled {...handleSettingsProps(2, 1, secondInput)} />
              <TextInputStyled {...handleSettingsProps(3, 1, thirdInput)} />
              <TextInputStyled {...handleSettingsProps(4, 1, fourthInput)} />
            </ContainerMiddle>
            <ButtonStyled onPress={() => handleSubmit()} style={{ backgroundColor: colors.primary }}>
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

const HiddenTextInput = styled.TextInput`
  position: absolute;
  opacity: 0;
`;

const TextInputStyled = styled.TextInput`
  margin: 10px;
  border: black;
  border-radius: 1px;
  text-align: center;
  height: 50px;
  width: 50px;
  font-size: 23px;
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
