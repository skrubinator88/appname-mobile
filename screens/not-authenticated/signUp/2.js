import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "@react-navigation/native";

import { Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView, TextInput } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

import { RegistrationContext } from "../../../components/context";

import env from "../../../env";

// Components
import Header from "../../../components/header";

export default function ({ navigation }) {
  const { registrationState, methods } = useContext(RegistrationContext);
  const { updateForm, sendForm } = methods;

  const { colors } = useTheme();
  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [thirdInput, setThirdInput] = useState("");
  const [textInput, setTextInput] = useState("");

  let hiddenTextInput;
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

  const handleSubmit = async (e) => {
    if (textInput.length == 10) {
      const phone_number = textInput;
      updateForm({ phone_number });

      try {
        navigation.navigate("SignUp3");
        // const twilio = await fetch(`${env.API_URL}/v1/users/sms_registration?phone_number=${phone_number}&channel=sms`, {
        //   method: "POST",
        // });
      } catch (e) {
        console.log(e.message);
      }
      return;
    }
    // DISABLE AFTER DEV
    updateForm({ phone_number: "4049901671" });
    navigation.navigate("SignUp3");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <Container>
          <Header navigation={navigation} />

          <ContainerTopMiddle>
            <TextStyled>For authentication purposes, what is your phone number?</TextStyled>

            <ContainerMiddle>
              <HiddenTextInput
                keyboardType="phone-pad"
                maxLength={10}
                ref={(ref) => (hiddenTextInput = ref)}
                onChangeText={(text) => {
                  if (text.length <= 10) {
                    setTextInput(text);
                    let first = text.slice(0, 3);
                    let second = text.slice(3, 6);
                    let third = text.slice(6, 10);

                    setFirstInput(first);
                    setSecondInput(second);
                    setThirdInput(third);
                  }
                }}
              />
              <TextInputStyled {...handleSettingsProps(1, 3, firstInput)} />
              <TextInputStyled {...handleSettingsProps(2, 3, secondInput)} />
              <TextInputStyled {...handleSettingsProps(3, 4, thirdInput)} />
            </ContainerMiddle>

            <ButtonStyled onPress={(e) => handleSubmit(e)} style={{ backgroundColor: colors.primary }}>
              <Text style={{ color: "white" }}>Continue</Text>
            </ButtonStyled>
          </ContainerTopMiddle>
        </Container>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

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
