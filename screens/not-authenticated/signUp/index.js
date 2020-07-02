import React, { Component } from "react";

import { Text, Image, Button, Alert, TextInput, View } from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

// Components
import Header from "../../../components/header";

export function SignUpScreen({ navigation }) {
  return (
    <Container>
      <Header navigation={navigation} />
      <ContainerTop>
        <TextStyledTittle>What would you like to do?</TextStyledTittle>
      </ContainerTop>
      <ContainerTopMiddle>
        <TextStyledContent>
          With CONTRACTOR APP, you choose how yo want to work. You can be an
          employer and create, post, and manage jobs, or you can be an employee
          and find work.
        </TextStyledContent>
        <ContainerMiddle>
          <ButtonStyled
            onPress={(e) => {
              Alert.alert(
                "Still in Development",
                "This section still is in progress"
              );
            }}
          >
            <TextStyledBtn style={{ color: "white" }}>
              I want to post jobs
            </TextStyledBtn>
          </ButtonStyled>
          <ButtonStyledWork
            onPress={(e) => {
              navigation.navigate("SignUpContractor");
            }}
          >
            <TextStyledBtn style={{ color: "black" }}>
              I want to find work
            </TextStyledBtn>
          </ButtonStyledWork>
          <TextStyledHelp onPress={(e) => {}}>
            Need help choosing?
          </TextStyledHelp>
        </ContainerMiddle>
      </ContainerTopMiddle>
    </Container>
  );
}

const ButtonStyled = styled.TouchableOpacity`
  background-color: #1c55ef;
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
  border-color: #1c55ef;
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
  margin: 0 30px;
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
  color: #1c55ef;
  font-size: 15px;
`;