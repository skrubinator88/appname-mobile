import React, { Component } from "react";

import { Text, Image, Button, Alert, TextInput, View } from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
class contractorApp extends Component {
  SignIn = () => {
    Alert.alert("AQUI VA AXIOS");
  };
  

  render() {
    let secondTextInput;
    let thirdTextInput;
    return (
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
            maxLength={3}
            underlineColorAndroid="transparent"
            keyboardType={"numeric"}
            onChangeText={(e) => e.length == 3 && secondTextInput.focus()}
            blurOnSubmit={false}
          />
          <TextInputStyled
            ref={(input) => {
              secondTextInput = input;
            }}
            maxLength={3}
            underlineColorAndroid="transparent"
            keyboardType={"numeric"}
            focusable={true}
            onChangeText={(e) => e.length == 3 && thirdTextInput.focus()}
          />
          <TextInputStyled
            ref={(input) => {
              thirdTextInput = input;
            }}
            maxLength={4}
            underlineColorAndroid="transparent"
            keyboardType={"numeric"}
            onSubmitEditing={() => {
              navigation.navigate("signInScreenConfirmation");
            }}
          />
        </ContainerMiddle>
        <ButtonStyled>
          <TextStyledBtn style={{ color: "white" }}>Continue</TextStyledBtn>
        </ButtonStyled>
      </ContainerTopMiddle>
    </Container>
    );
  }
}
const TextInputStyled = styled.TextInput`
  margin: 10px;
  border: black;
  border-radius: 10px;
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
const TextStyledBtn = styled.Text`
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

export default contractorApp;
