import React, { Component } from "react";

import { Alert, TouchableWithoutFeedback, TextInput, FlatList } from "react-native";
import Header from "../components/header";

import { Platform } from "react-native";
import styled from "styled-components/native";
import Text from "../components/text";

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
      <>
        <Header
          navigation={true}
          title="Licenses"
          nextTitle="Save"
          nextColor="#548ff7"
          nextAction={() => navigation.navigate("SignUpContractor2")}
        />
        <Container>
          <Text align={"center"} small>
            Begin typing a licence name and select it from the suggestions. if you don't see your licence type, select other.
          </Text>
          <SearchBox>
            <TextInput
              style={{ marginLeft: 40, fontSize: 17 }}
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
              renderItem={({ item }) => <Item title={item.title} licNum={item.licNum} date={item.date} expires={item.expires} />}
              keyExtractor={(item) => item.id}
            />
          </ResultBox>
        </Container>
      </>
    );
  }
}

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
  margin: 20px 0;
  border-width: 1px;
  padding: 7px;
  border-radius: 50px;
  border-color: #e0e0e0;
`;

const Container = styled.View`
  margin: 20px 30px 0 30px;
  flex: 1;
`;

const ResultBox = styled.View`
  background: #f3f3f3;
  flex: 1;
`;

const TextResult = styled.Text`
  margin-left: 10px;
  color: #a5a5a5;
`;

export default contractorApp;
