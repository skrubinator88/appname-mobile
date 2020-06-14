import React, { Component } from "react";

import { Text, Image, Button, Alert, TextInput, View } from "react-native";

import styled from "styled-components/native";

import { FontAwesome } from "@expo/vector-icons";

class contractorApp extends Component {
  SignIn = () => {
    Alert.alert("AQUI VA AXIOS");
  };

  render() {
    return (
      <Container>
        <ContainerTop>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </ContainerTop>
        <ContainerTopMiddle>
          <TextStyled>Please enter your phone number</TextStyled>

          <ContainerMiddle>
            <TextInputStyled
              maxLength="1"
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
            />
            <TextInputStyled
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
            />
            <TextInputStyled
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
            />
          </ContainerMiddle>
          <ButtonStyled title={"Continue"} onPress={this.SignIn} />
        </ContainerTopMiddle>
      </Container>
    );
  }
}
const TextInputStyled = styled.TextInput`
  margin: 10px;
  border: black;
  text-align: center;
  height: 50px;
  width: 70px;
`;

const ButtonStyled = styled.Button`
  flex: 0.5;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Container = styled.View`
  flex: 1;
`;
const ContainerMiddle = styled.View`
  align-items: center;
  justify-content: center;

  flex: 0.5;
  flex-direction: row;
`;

const ContainerTop = styled.View`
  flex: 0;
  margin-top: 50px;
  margin-left: 40px;
  margin-bottom: 30px;
`;
const ContainerTopMiddle = styled.View`
  flex: 1;
  padding: 30px;
  padding-left: 20px;
`;

const TextStyled = styled.Text`
  font-size: 30px;
`;

export default contractorApp;
