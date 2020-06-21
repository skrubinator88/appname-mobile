import React, { Component } from "react";

import { Text, Image, Button, Alert, TextInput, View } from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
export function SignUpScreen({ navigation }) {

  return (
    <Container>
      <ContainerTop>
        <TextStyledTittle>What would you like to do?</TextStyledTittle>
      </ContainerTop>
      <ContainerTopMiddle>
        <TextStyledContent>
          With CONTRACTOR APP, you choose how yo want to work. You can be an
          employer and create, post, and manage jobs, or you can be an
          employee and find work.
          </TextStyledContent>
        <ContainerMiddle>
          <ButtonStyled onPress={(e) => { Alert.alert("Still in Development", "This section still is in progress") }}>
            <TextStyledBtn style={{ color: "white" }} >
              I want to post jobs
              </TextStyledBtn>
          </ButtonStyled>
          <ButtonStyledWork onPress={(e) => { navigation.navigate("SignUpContractor") }}>
            <TextStyledBtn style={{ color: "black" }} >
              I want to find work
              </TextStyledBtn>
          </ButtonStyledWork>
          <TextStyledHelp onPress={(e) => { }}>Need help choosing?</TextStyledHelp>

        </ContainerMiddle>
      </ContainerTopMiddle>
    </Container>
  );
}



const ButtonStyled = styled.TouchableOpacity`
  background-color: #1C55EF;
  padding: 10px;
  width: 80%;
  border-radius: 6px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const ButtonStyledWork = styled.TouchableOpacity`
  background-color: white;
  padding: 10px;
  width: 80%;
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color:  #1C55EF;
  margin: 0 auto;
  margin-top: 90px;
  align-items: center;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
`;
const TextStyledBtn = styled.Text`
  font-size: 17px;
`;

const ContainerMiddle = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ContainerTop = styled.View`
  margin-top: 120px;
  margin-left: 30px;
  margin-right: 30px;
`;
const ContainerTopMiddle = styled.View`
  flex: 1;
  padding: 20px;
  padding-left: 20px;
  margin-left: 13px;
  margin-right: 13px;
`;

const TextStyledContent = styled.Text`
  text-align: center;
  font-size: 18px;
`;

const TextStyledTittle = styled.Text`
  text-align: center;
  font-size: 28px;
`;

const TextStyledHelp = styled.Text`
margin-top: 80px;
  text-align: center;
  font-weight: bold;
  color: #1C55EF;
  font-size: 15px;
`;

