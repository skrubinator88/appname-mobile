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
  Button,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";

import { TextField, FilledTextField, OutlinedTextField } from "@ubaids/react-native-material-textfield";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
class Screen49 extends Component {
  state = {
    search: "",
    DATA: [
      {
        id: "1",
        title: "Committed",
      },
      {
        id: "2",
        title: "Scheduling",
      },
      {
        id: "3",
        title: "Negotiation",
      },
      {
        id: "4",
        title: "Task Management",
      },
      {
        id: "5",
        title: "Comunication",
      },
      {
        id: "6",
        title: "Other",
      },
    ],
  };

  updateSearch = (search) => {
    this.setState({ search });
    console.log(search);
  };

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  Confirm = () => {
    Alert.alert("Confirm");
  };

  Problem = () => {
    Alert.alert("Problem");
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
        <Container>
          <ContainerTop>{/* aqui va el header */}</ContainerTop>
          <Fields>
            <UserImage source={require("../assets/cheems2.jpg")} />
            <TextStyledContent>Jhon Doe</TextStyledContent>
            <TextResult>Company Co. LLC</TextResult>
          </Fields>
          <RateBox>
            <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 10 }}>Had any issues?</Text>

            <FlatList
              contentContainerStyle={{ alignItems: "center" }}
              numColumns={3}
              data={this.state.DATA}
              renderItem={({ item }) => (
                <Text
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    margin: 10,
                    borderRadius: 10,
                  }}
                >
                  {item.title}
                </Text>
              )}
              keyExtractor={(item) => item.id}
            />
          </RateBox>

          <ContainerInput>
            <TextField style={{ margin: 0 }} placeholder="Please select at least one issue" />
          </ContainerInput>
          <BtnContainer>
            <StyledBtn title={"Confirm"} onPress={this.Confirm} />
          </BtnContainer>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

const StyledBtn = styled.Button`
  background: #3869f3;
`;

const ContainerBtn = styled.View`
  background: red;
  align-items: center;
  align-content: center;
  text-align: center;
`;

const UserImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  margin-top: 20px;
`;

const CompImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  margin-top: 10px;
`;
const Fields = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px;
  margin-bottom: 0px;
`;
const LicResult = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
  align-items: center;
`;

const RateBox = styled.View`
  border-width: 1px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  margin: 10px;

  margin-top: 15px;
  border-color: #efefef;
  text-align: center;
  align-items: center;
`;

const Container = styled.View`
  position: relative;
  flex: 1;
  flex-direction: column;
`;
const ContainerInput = styled.View`
  margin: 50px;
  margin-top: 10px;
`;

const BtnContainer = styled.View`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  margin-bottom: 10px;
`;

const ContainerTop = styled.View`
  flex: 0.6;
  background: #3869f3;
`;

const ResultBox = styled.View`
  margin: 0px;

  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  width: 500px;
  border-color: #efefef;
`;

const TextStyledContent = styled.Text`
  text-align: center;
  margin-top: 0px;
  font-weight: bold;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "20px")};
`;

const TextResult = styled.Text`
  color: #a5a5a5;
  text-align: center;
  margin-bottom: 0px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "18px")};
`;

export default Screen49;
