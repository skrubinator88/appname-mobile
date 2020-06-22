import React, { useState } from "react";
import {
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styled from "styled-components/native";

import Card from "../../../../components/card";
import Text from "../../../../components/text";

// Expo
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

export default function Dashboard({ navigation }) {
  const [searchBarValue, setSearchBarValue] = useState("");
  let searchBar;

  const handleSubmit = () => {
    searchBar.clear();
  };

  return (
    <>
      <Menu
        activeOpacity={0.9}
        onPress={() => {
          Keyboard.dismiss();
          navigation.openDrawer();
        }}
      >
        <MaterialIcons
          backgroundColor="white"
          color="black"
          name="menu"
          size={30}
        />
      </Menu>
      <SearchBar
        placeholder="Search jobs"
        placeholderTextColor="#777"
        ref={(searchBarRef) => {
          searchBar = searchBarRef;
        }}
        onSubmitEditing={() => handleSubmit()}
      />
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS == "ios" ? "height" : "height"}
      >
        <Card>
          <Row>
            <Text small>1.0.0.0</Text>
          </Row>
        </Card>
      </KeyboardAvoidingView>
    </>
  );
}

const Menu = styled.TouchableOpacity`
  position: absolute;
  left: 6%;
  top: ${() => (Platform.OS == "ios" ? "6%" : "40px")};
  border-radius: 50px;
  background: white;
  padding: 10px;
`;

const SearchBar = styled.TextInput`
  position: absolute;
  top: ${() => (Platform.OS == "ios" ? "15%" : "100px")};
  left: 15%;
  width: 70%;
  font-size: 17px;
  color: red;
  border: 2px solid #ededed;
  border-radius: 50px;
  background: white;
  padding: 7px 15px;
`;

const Row = styled.View`
  flex-direction: row;
  /* justify-content: ${({ first, last }) => {
    switch (true) {
      case first:
        return "space-between";
      case last:
        return "space-around";
      default:
        return "flex-start";
    }
  }}; */
  /* justify-content:  */
  /* margin: ${(props) => {
    if (props.first) {
      return "30px 10px 0 10px";
    } else if (props.last) {
      // return `20px 10px 50px 10px`;
      return "30px 10px 0 10px";
    } else {
      return "0px 0px";
    }
  }};
  padding: 0 30px;
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")}; */
`;
