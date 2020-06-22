import React, { Component } from "react";

import {
  Text,
  CheckBox,
  Alert,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Keyboard,
  ScrollView,
  FlatList,
} from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from "react-native-material-textfield";

class contractorApp extends Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
          <ContainerTop>{/* aqui va el header */}</ContainerTop>
          <Fields>
            <TextStyledTittle>License Title</TextStyledTittle>
           <ContainerFields>
           <TextField  label="Licence Number" />
           <Text
                style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}
              >
                DATE OBTAINED
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              />
               <Text
                style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}
              >
                EXPIRATION DATE
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              />
              

              <Buttons>
              <TextStyledBtn
                style={{ fontSize: 20 , marginRight:118, marginLeft:30}}
                onPress={(e) => Cancel(e)}
              >
                Cancel
              </TextStyledBtn>
             
              <TextStyledBtn
                style={{ fontSize: 20, fontWeight: "bold", color: "#1c55ef", marginLeft:30 }}
                onPress={(e) => Save(e)}
              >
                Save
              </TextStyledBtn>
              </Buttons>
           </ContainerFields>
          </Fields>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

const Fields = styled.View`
  margin: 20px;
  padding-bottom:20px;
  border-width: 1px;
  background-color: #ffffff;
  border-color: #e3e3e3;
`;

const SearchBox = styled.View`
  margin: 20px;
  border-width: 1px;
  padding: 10px;
  border-radius: 20px;
  border-color: #e0e0e0;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f4f4f4;
`;

const Buttons = styled.View`
 align-content:center;
 text-align: center;
  flex-direction:row;

`;

const ContainerTop = styled.View`
  flex: 0.12;
 
`;

const ContainerFields = styled.View`
margin-left:20px;
margin-right:20px;
`;

const TextStyledTittle = styled.Text`
  margin: 20px;
  margin-bottom: 0px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "20px")};
`;

const TextStyledBtn = styled.Text`
  margin-top: 30px;

  font-size: ${() => (Platform.OS == "ios" ? "25px" : "17px")};
`;

export default contractorApp;
