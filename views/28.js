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

class contractorApp extends Component {
  state = {
    search: "",
    DATA: [
      {
        id: "1",
        title: "Licence",
        licNum: "1",
        date: "00.00.00",
        expires: "00.00.00",
      },
      {
        id: "2",
        title: "Licence",
        licNum: "2",
        date: "00.00.00",
        expires: "00.00.00",
      },
      {
        id: "3",
        title: "Licence",
        licNum: "3",
        date: "00.00.00",
        expires: "00.00.00",
      },
      {
        id: "4",
        title: "Licence",
        licNum: "4",
        date: "00.00.00",
        expires: "00.00.00",
      },
      {
        id: "5",
        title: "Licence",
        licNum: "5",
        date: "00.00.00",
        expires: "00.00.00",
      },
      {
        id: "6",
        title: "Licence",
        licNum: "6",
        date: "00.00.00",
        expires: "00.00.00",
      },
    ],
  };

  updateSearch = (search) => {
    this.setState({ search });
    console.log(search);
  };
  render() {
    const { search } = this.state;
    const Cancel = (e) => {
      Alert.alert("Cancel");
    };
    const Save = (e) => {
      Alert.alert("Save");
    };

    function Item({ title, licNum, date, expires }) {
      return (
        <LicResult>
          <TextResult>{title}</TextResult>
          <TextResult>Licence No: {licNum}</TextResult>
          <TextResult>Date obtained: {date}</TextResult>
          <TextResult>Expires: {expires}</TextResult>
        </LicResult>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
          <ContainerTop>{/* aqui va el header */}</ContainerTop>
          <Fields>
            <TextStyledContent>
              Begin typing a licence name and select it from the suggestions. if
              you don't see your licence type, select other.
            </TextStyledContent>
            <SearchBox>
              <TextInput
                style={{ marginLeft: 40, fontSize: 20 }}
                placeholder="Search licenses"
                lightTheme
                leftIconContainerStyle
                onChangeText={this.updateSearch}
                value={search}
              ></TextInput>
            </SearchBox>

            <ResultBox>
              <FlatList
                data={this.state.DATA}
                renderItem={({ item }) => (
                  <Item
                    title={item.title}
                    licNum={item.licNum}
                    date={item.date}
                    expires={item.expires}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </ResultBox>
          </Fields>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

const Fields = styled.View`
  flex: 0.4;
  margin: 20px;
`;
const LicResult = styled.View`
  border-width: 1px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-top-width: 0px;
  border-color: white;
  padding: 5px;
  padding-top: 15px;
  padding-bottom: 15px;
`;

const SearchBox = styled.View`
  margin: 20px;
  border-width: 1px;
  padding: 10px;
  border-radius: 20px;
  margin-top: 40px;
  border-color: #e0e0e0;
`;

const Container = styled.View`
  flex: 1;
`;

const ContainerTop = styled.View`
  flex: 0.15;
  background: red;
`;

const ResultBox = styled.View`
  margin: 20px;
  margin-top: 10px;
  background: #f3f3f3;
`;

const TextStyledContent = styled.Text`
  text-align: center;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "20px")};
`;

const TextResult = styled.Text`
  margin-left: 10px;
  color: #a5a5a5;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "17px")};
`;

export default contractorApp;
