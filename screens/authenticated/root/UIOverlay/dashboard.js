// Dependencies
import React, { useState, useContext, useEffect } from "react";
import { SafeAreaView, Keyboard, KeyboardAvoidingView, Platform, View, Text, Dimensions } from "react-native";
import styled from "styled-components/native";

// Components
import Card from "../../../../components/card";

// Expo
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

// Miscellaneous
const height = Dimensions.get("screen").height;
import fetchedSuggestedItems from "../../../../models/fetchedSuggestedItems"; // Simulating an API

// Context
import { UIOverlayContext, GlobalContext } from "../../../../components/context";

export default function Dashboard({ navigation, onUIChange }) {
  const { authActions, authState, errorActions } = useContext(GlobalContext);
  const { userToken, userID, userData } = authState;
  const { changeRoute } = useContext(UIOverlayContext);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchBarFocus, setSearchBarFocus] = useState(false);
  let searchBar; // Search Bar Reference

  const handleSubmit = (keyword) => {
    searchBar.clear();
    setSearchBarFocus(false);
    changeRoute({ name: "searching", props: { keyword } });
  };

  let suggestedItems = fetchedSuggestedItems.filter((item) => {
    const title = item.toLowerCase();
    const input = searchBarValue.toLowerCase().trim();
    return title.indexOf(input) != -1;
  });

  // function Suggestions() {
  //   if (searchBarFocus) {
  //     let suggestedItems = fetchedSuggestedItems.filter((item) => {
  //       const title = item.toLowerCase();
  //       const input = searchBarValue.toLowerCase().trim();
  //       return title.indexOf(input) != -1;
  //     });
  //     return (
  //       <SuggestionContainer enabled behavior="height">
  //         <TopBar />
  //         <SuggestionScrollView
  //           keyboardShouldPersistTaps="always"
  //           data={suggestedItems}
  //           keyExtractor={(item, index) => index.toString()}
  //           renderItem={({ item }) => {
  //             return (
  //               <SuggestedItem
  //                 onPress={() => {
  //                   setSearchBarValue(item);
  //                   setSearchBarFocus(false);
  //                   searchBar.blur();
  //                   handleSubmit(item);
  //                 }}
  //               >
  //                 {item}
  //               </SuggestedItem>
  //             );
  //           }}
  //         />
  //       </SuggestionContainer>
  //     );
  //   } else {
  //     return <View></View>;
  //   }
  // }

  return (
    <>
      <SuggestionContainer enabled behavior="height" style={{ opacity: searchBarFocus ? 1 : 0, zIndex: searchBarFocus ? 1 : -1 }}>
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
                  searchBar.blur();
                  handleSubmit(item);
                }}
              >
                {item}
              </SuggestedItem>
            );
          }}
        />
      </SuggestionContainer>

      <SearchBar
        placeholder={userData.role == "contractor" ? "Search jobs" : "Search Contractors"}
        placeholderTextColor="#777"
        onChangeText={(text) => setSearchBarValue(text)}
        ref={(searchBarRef) => (searchBar = searchBarRef)}
        onFocus={() => {
          setSearchBarFocus(true);
        }}
        onSubmitEditing={() => handleSubmit()}
      />

      {searchBarFocus ? (
        <MenuButton
          activeOpacity={0.9}
          onPress={() => {
            Keyboard.dismiss();
            setSearchBarFocus(false);
            searchBar.blur();
          }}
        >
          <AntDesign backgroundColor="white" color="black" name="arrowleft" size={30} />
        </MenuButton>
      ) : (
        <>
          <MenuButton
            activeOpacity={0.9}
            onPress={() => {
              Keyboard.dismiss();
              navigation.openDrawer();
            }}
          >
            <MaterialIcons backgroundColor="white" color="black" name="menu" size={30} />
          </MenuButton>

          <Card>
            <Row>
              <Text small>1.0.0.0</Text>
            </Row>
          </Card>
        </>
      )}
    </>
  );
}

const MenuButton = styled.TouchableOpacity`
  z-index: 2;
  position: absolute;
  left: 6%;
  top: ${() => (Platform.OS == "ios" ? "6%" : "40px")};
  border-radius: 50px;
  background: white;
  padding: 10px;
`;

const SearchBar = styled.TextInput`
  z-index: 2;
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
const TopBar = styled.KeyboardAvoidingView`
  height: ${() => (Platform.OS == "ios" ? `${height * 0.15 + 54}px` : "100px")};
  margin-top: ${() => (Platform.OS == "ios" ? "0" : "54px")};
  background: white;
  box-shadow: 2px 2px 2px #dcdcdc;
  z-index: 3;
  /* margin-bottom: 10px; */
`;

const SuggestionContainer = styled.KeyboardAvoidingView`
  flex: 1;
  background: white;
  height: 100%;
  width: 100%;
  opacity: 1;
  z-index: 2;
  position: absolute;
`;

const SuggestionScrollView = styled.FlatList`
  z-index: 2;
  flex: 1;
`;

const SuggestedItem = styled.Text`
  z-index: 2;
  border: 1px solid #dddddd;
  padding: 10px 30px;
  width: 100%;
`;
