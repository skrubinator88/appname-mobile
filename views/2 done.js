import React, { Component } from "react";

import { Text, Image, Button, Alert, TextInput, View } from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
class contractorApp extends Component {
  render() {
    const PostJob = (e) => {
      Alert.alert("Post a job");
    };
    const FindJob = (e) => {
      Alert.alert("Find a job");
    };
    const HelpChoose = (e) => {
      Alert.alert("Help");
    };
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
            <ButtonStyled>
              <TextStyledBtn style={{ color: "white" }}  onPress={(e) => PostJob(e)}>
                I want to post jobs
              </TextStyledBtn>
            </ButtonStyled>
            <ButtonStyledWork>
              <TextStyledBtn style={{ color: "black" }}  onPress={(e) => FindJob(e)}>
                I want to find work
              </TextStyledBtn>
            </ButtonStyledWork>
          <TextStyledHelp onPress={(e) => HelpChoose(e)}>Need help choosing?</TextStyledHelp>

          </ContainerMiddle>
        </ContainerTopMiddle>
      </Container>
    );
  }
}


const ButtonStyled = styled.TouchableOpacity`
  background-color: #1C55EF;
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
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "17px")};
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
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "18px")};
`;

const TextStyledTittle = styled.Text`
  text-align: center;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "28px")};
`;

const TextStyledHelp = styled.Text`
margin-top: 80px;
  text-align: center;
  font-weight: bold;
  color: #1C55EF;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "15px")};
`;

export default contractorApp;
