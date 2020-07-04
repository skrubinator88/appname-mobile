import React, { useState } from "react";
import { SafeAreaView, Keyboard, KeyboardAvoidingView, Platform, View } from "react-native";
import styled from "styled-components/native";

import Card from "../../../../components/card";
import Text from "../../../../components/text";

// Expo
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

export default function Dashboard({ navigation }) {
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchBarFocus, setSearchBarFocus] = useState(false);
  console.log();
  let searchBar;

  const handleSubmit = () => {
    searchBar.clear();
  };

  const Suggestions = () => {
    const style = searchBarFocus ? { opacity: 1 } : { opacity: 0, zIndex: -1 };

    return (
      <SuggestionContainer enabled behavior="height" style={style} onPress={() => Keyboard.dismiss()}>
        <SuggestionScrollView>
          <SuggestedItem></SuggestedItem>
          <SuggestedItem></SuggestedItem>
          <SuggestedItem></SuggestedItem>
          <SuggestedItem></SuggestedItem>
          <SuggestedItem></SuggestedItem>
          <SuggestedItem></SuggestedItem>
          <SuggestedItem></SuggestedItem>
          <SuggestedItem></SuggestedItem>
        </SuggestionScrollView>
      </SuggestionContainer>
    );
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
        <MaterialIcons backgroundColor="white" color="black" name="menu" size={30} />
      </Menu>

      <SearchBar
        placeholder="Search jobs"
        placeholderTextColor="#777"
        onChangeText={(text) => setSearchBarValue(text)}
        ref={(searchBarRef) => (searchBar = searchBarRef)}
        onFocus={() => setSearchBarFocus(true)}
        onEndEditing={() => setSearchBarFocus(false)}
        onSubmitEditing={() => handleSubmit()}
      />

      <KeyboardAvoidingView enabled behavior="height">
        <Card>
          <Row>
            <Text small>1.0.0.0</Text>
          </Row>
        </Card>
      </KeyboardAvoidingView>

      {/* Search Bar on Focus UI */}

      {Suggestions()}
    </>
  );
}

const Menu = styled.TouchableOpacity`
  z-index: 1;
  position: absolute;
  left: 6%;
  top: ${() => (Platform.OS == "ios" ? "6%" : "40px")};
  border-radius: 50px;
  background: white;
  padding: 10px;
`;

const SearchBar = styled.TextInput`
  z-index: 3;
  position: absolute;
  top: ${() => (Platform.OS == "ios" ? "15%" : "100px")};
  left: 15%;
  width: 70%;
  font-size: 17px;
  border: 2px solid #ededed;
  border-radius: 50px;
  background: white;
  padding: 7px 15px;
`;

const Row = styled.View`
  flex-direction: row;
`;

//  Search Bar on Focus UI *

const SuggestionContainer = styled.KeyboardAvoidingView`
  flex: 1;
  z-index: 2;
  position: absolute;
  background: red;
  height: 100%;
  width: 100%;
  /* align-items: center; */
  /* justify-content: flex-end; */
  border-bottom-width: 30px;
  border-bottom-color: blue;
`;

const SuggestionScrollView = styled.ScrollView`
  flex: 1;
  z-index: 2;
  /* position: absolute; */
  background: red;
  height: 100%;
  width: 100%;
  /* align-items: center; */
  /* justify-content: flex-end; */
`;

const SuggestedItem = styled.View`
  z-index: 1;
  border: 2px solid yellow;
  background: green;
  height: 100px;
  width: 100px;
`;
