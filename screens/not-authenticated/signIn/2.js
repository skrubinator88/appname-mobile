import React, { useState, useEffect } from "react";
import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

export function SignInScreen2({ navigation }) {
  const [firstInput, setFirstInput] = useState("");
  const [secondInput, setSecondInput] = useState("");
  const [thirdInput, setThirdInput] = useState("");
  const [fourthInput, setFourthInput] = useState("");

  let firstTextInput;
  let secondTextInput;
  let thirdTextInput;
  let fourthTextInput;

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
            <TextInputStyled
              ref={(input) => {
                firstTextInput = input;
              }}
              maxLength={1}
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
              onChangeText={(text) => {
                setFirstInput(text);
                text.length == 1 && secondTextInput.focus();
              }}
            />
            <TextInputStyled
              ref={(input) => {
                secondTextInput = input;
              }}
              maxLength={1}
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
              focusable={true}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key == "Backspace") {
                  firstTextInput.focus();
                }
              }}
              onChangeText={(text) => {
                if (secondInput.length == 1 && text.length == 0) {
                  firstTextInput.focus();
                }
                setSecondInput(text);
                text.length == 1 && thirdTextInput.focus();
              }}
            />
            <TextInputStyled
              ref={(input) => {
                thirdTextInput = input;
              }}
              maxLength={1}
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
              focusable={true}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key == "Backspace") {
                  secondTextInput.focus();
                }
              }}
              onChangeText={(text) => {
                if (thirdInput.length == 1 && text.length == 0) {
                  secondTextInput.focus();
                }
                setThirdInput(text);
                text.length == 1 && fourthTextInput.focus();
              }}
            />
            <TextInputStyled
              ref={(input) => {
                fourthTextInput = input;
              }}
              maxLength={1}
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key == "Backspace") {
                  thirdTextInput.focus();
                }
              }}
              onChangeText={(text) => {
                if (fourthInput.length == 1 && text.length == 0) {
                  thirdTextInput.focus();
                }
                setFourthInput(text);
              }}
              onSubmitEditing={(e) => handleSubmit(e)}
            />
          </ContainerMiddle>
          <ButtonStyled onPress={(e) => handleSubmit(e)}>
            <Text style={{ color: "white" }}>Continue</Text>
          </ButtonStyled>
        </ContainerTopMiddle>

        <ContainerBottom>
          <TextStyledBottom>Didn`t get it?</TextStyledBottom>
          <TextStyledBottomAction>Resend code</TextStyledBottomAction>
        </ContainerBottom>
      </Container>
    </TouchableWithoutFeedback>
  );
}

const ContainerBottom = styled.View`
  flex: 0.1;
  align-items: center;
  justify-content: center;
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
