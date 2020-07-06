import React, { useState, useContext } from "react";
import { SafeAreaView, Keyboard, KeyboardAvoidingView, Platform, View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";

import Card from "../../../../components/card";
// import Text from "../../../../components/text";

// Expo
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

import fethedSuggestedItems from "../../../../models/fetchedSuggestedItems";
const height = Dimensions.get("screen").height;

import { UIOverlayContext } from "../../../../components/context";

export default function Dashboard({ navigation, onUIChange }) {
  const { changeRoute } = useContext(UIOverlayContext);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchBarFocus, setSearchBarFocus] = useState(false);
  console.log();
  let searchBar;

  const handleSubmit = () => {
    searchBar.clear();
    changeRoute("searching");
  };

  const Suggestions = () => {
    const style = searchBarFocus ? { opacity: 1 } : { opacity: 0, zIndex: -1 };

    // Fetch before search
    let suggestedItems = fethedSuggestedItems.filter((item) => {
      const title = item.toLowerCase();
      const input = searchBarValue.toLowerCase().trim();
      return title.indexOf(input) != -1;
    });

    return (
      <SuggestionContainer enabled behavior="height" style={style}>
        <TopBar />
        <SuggestionScrollView
          keyboardShouldPersistTaps="always"
          data={suggestedItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <SuggestedItem
                onPress={() => {
                  setSearchBarValue(item);
                  setSearchBarFocus(false);
                  handleSubmit();
                  searchBar.blur();
                }}
              >
                {item}
              </SuggestedItem>
            );
          }}
        />
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
        value={searchBarValue}
        onChangeText={(text) => setSearchBarValue(text)}
        ref={(searchBarRef) => (searchBar = searchBarRef)}
        onFocus={() => setSearchBarFocus(true)}
        // onEndEditing={() => setSearchBarFocus(false)}
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
  z-index: 3;
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
  height: 40px;
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

/* */

const TopBar = styled.KeyboardAvoidingView`
  height: ${() => (Platform.OS == "ios" ? `${height * 0.15 + 54}px` : "100px")};
  /* margin-top: 54px; */
  background: white;
  box-shadow: 2px 2px 2px #dcdcdc;
  z-index: 3;
  /* margin-bottom: 10px; */
`;

const SuggestionContainer = styled.KeyboardAvoidingView`
  flex: 1;
  z-index: 2;
  position: absolute;
  background: white;
  height: 100%;
  width: 100%;
  /* align-items: center; */
  /* justify-content: flex-end; */
  /* border-bottom-width: 30px; */
  /* border-bottom-color: blue; */
`;

const SuggestionScrollView = styled.FlatList`
  flex: 1;
  z-index: 2;
  /* position: absolute; */
  /* background: red; */
  height: 100%;
  width: 100%;
  /* align-items: center; */
  /* justify-content: flex-end; */
`;

const SuggestedItem = styled.Text`
  z-index: 1;
  border: 1px solid #dddddd;
  padding: 10px 30px;
  width: 100%;
`;
