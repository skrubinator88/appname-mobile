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
          <TextSyled>Enter the 4-digit code sent to you at</TextSyled>
          <TextSyled>(xxx) xxx- xxxx</TextSyled>

          <ContainerMiddle>
            <TextInputStyled
              maxLength={1}
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
            />
            <TextInputStyled
              maxLength={1}
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
            />
            <TextInputStyled
              maxLength={1}
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
            />
            <TextInputStyled
              maxLength={1}
              underlineColorAndroid="transparent"
              keyboardType={"numeric"}
            />
          </ContainerMiddle>

          <ContainerBottom>
            <TextSyledBottom>Didn`t get it?</TextSyledBottom>
            <TextSyledBottomAction>Resend code</TextSyledBottomAction>
          </ContainerBottom>
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
  width: 50px;
`;

const Container = styled.View`
  flex: 1;
`;
const ContainerBottom = styled.View`
  flex: 0.1;
  align-items: center;
  justify-content: center;
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

const TextSyled = styled.Text`
  font-size: 27px;
`;
const TextSyledBottom = styled.Text`
  font-size: 17px;
`;
const TextSyledBottomAction = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: #4893ee;
`;

export default contractorApp;
