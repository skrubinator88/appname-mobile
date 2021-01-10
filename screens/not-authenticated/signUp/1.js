import React, { Component } from "react";

import { Text, Image, Button, Alert, TextInput, View } from "react-native";

import { Platform, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
// Components
import Header from "../../../components/header";
export default function ({ navigation }) {

  return (
    <Container>
      <Header navigation={navigation} nextTitle="Next" nextColor="#548ff7" nextAction={() => navigation.navigate("SignUp2")} />

      <TextStyledTittle>User Responsibilities</TextStyledTittle>
      <ScrollView alwaysBounceVertical={false}>
        <ContainerTopMiddle>
          <TextStyledContent>Employer</TextStyledContent>
          <TextStyledContent style={{ marginLeft: 30 }}>Employee</TextStyledContent>
        </ContainerTopMiddle>
        <ContainerMiddle>
          <Employer>
            <TextStyledInfo>- Accept and follow the guidelines set for employees provided by CONTRACTORAPP</TextStyledInfo>
            <TextStyledInfo>- Create, manage, and post jobs for employees to find</TextStyledInfo>
            <TextStyledInfo>- Provide an address for the work site</TextStyledInfo>
            <TextStyledInfo>- Briefly describe appropriate tasks needed to be completed</TextStyledInfo>
            <TextStyledInfo>- Be respectful of the employer, the work site, and other users of CONTRACTORAPP</TextStyledInfo>
          </Employer>

          <Employee>
            <TextStyledInfo style={{ fontSize: 18 }}>
              - Accept and follow the guidelines set for employees provided by CONTRACTORAPP
            </TextStyledInfo>
            <TextStyledInfo>- Arrive to the work site in a timely manner and complete tasks set by the Employer</TextStyledInfo>
            <TextStyledInfo>- Be respectful of the employer, the work site, and other users of CONTRACTORAPP</TextStyledInfo>
          </Employee>

          <Terms>
            <TextStyledInfo
              style={{
                fontSize: 17,
                color: "#1C55EF",
                fontWeight: "bold",
                margin: 10,
              }}
              onPress={(e) => { }}
            >
              Employee Agreement
            </TextStyledInfo>
            <TextStyledInfo
              style={{
                fontSize: 17,
                color: "#1C55EF",
                fontWeight: "bold",
                margin: 10,
              }}
              onPress={(e) => { }}
            >
              Privacy Policy Agreement
            </TextStyledInfo>
            <TextStyledInfo
              style={{
                fontSize: 17,
                color: "#1C55EF",
                fontWeight: "bold",
                margin: 10,
              }}
              onPress={(e) => { }}
            >
              Terms & Conditions
            </TextStyledInfo>
          </Terms>
        </ContainerMiddle>
      </ScrollView>
    </Container>
  );
}

const ButtonStyled = styled.TouchableOpacity`
  background-color: #1c55ef;
  padding: ${() => (Platform.OS == "ios" ? "15px" : "10px")};
  width: 80%;
  border-radius: 6px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const ButtonStyledWork = styled.TouchableOpacity`
  background-color: white;
  padding: ${() => (Platform.OS == "ios" ? "15px" : "10px")};
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
  background: white;
`;

var Employer = styled.View``;

const Terms = styled.View`
  margin-top: 40px;
`;

var Employee = styled.View`
  display: none;
`;

const IconBack = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 50px;
`;

const ContainerMiddle = styled.View`
  flex: 0.6;
  margin-left: 13px;
  margin-right: 13px;
`;

const ContainerTop = styled.View`
  margin-top: 50px;
  margin-left: 30px;
  margin-right: 30px;
`;
const ContainerTopMiddle = styled.View`
  flex: 0.06;
  padding: 20px;
  padding-bottom: 0px;
  padding-left: 20px;
  margin-left: 13px;
  margin-right: 13px;
  flex-direction: row;
  margin-top: 20px;
`;

const TextStyledContent = styled.Text`
  color: #1c55ef;
  font-weight: bold;
  font-size: 18px;
`;

const TextStyledTittle = styled.Text`
  text-align: center;
  font-size: 28px;
`;

const TextStyledInfo = styled.Text`
  margin-top: 10px;
  margin-left: 3px;
  margin-right: 3px;
  font-size: 19px;
`;

const TextStyledBtn = styled.Text`
  font-size: 17px;
`;
