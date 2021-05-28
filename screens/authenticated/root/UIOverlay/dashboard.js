import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { Dimensions, Image, Keyboard, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import styled from "styled-components/native";
import Card from "../../../../components/card_animated";
import { GlobalContext, UIOverlayContext } from "../../../../components/context";
import Text from "../../../../components/text";
import { USER_LOCATION_CONTEXT } from "../../../../contexts/userLocation";
import fetchedSuggestedItems from "../../../../models/fetchedSuggestedItems"; // Simulating an API
import { handleCameraCoordinates } from "../../../../controllers/MapController";
import { useDispatch } from "react-redux";




const height = Dimensions.get("screen").height;
const width = Dimensions.get("screen").width;
const statusBarHeight = getStatusBarHeight();


export default function Dashboard({ navigation, onUIChange, willUnmountSignal, showCard })
{
  const { authState } = useContext(GlobalContext);
  const { userData } = authState;
  const { changeRoute } = useContext(UIOverlayContext);
  const { location } = useContext(USER_LOCATION_CONTEXT)
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchBarFocus, setSearchBarFocus] = useState(false);
  let searchBar; // Search Bar Reference

  const dispatch = useDispatch()

  const handleSubmit = (keyword) =>
  {
    searchBar.clear();
    setSearchBarFocus(false);
    changeRoute({ name: "searching", props: { keyword } });
  };

  let suggestedItems = fetchedSuggestedItems.filter((item) =>
  {
    const title = item.toLowerCase();
    const input = searchBarValue.toLowerCase().trim();
    return title.indexOf(input) != -1;
  });

  return (
    <>
      {Platform.OS == "ios" && userData.role == "contractor" && (
        <SuggestionContainer enabled behavior="height" style={{ opacity: searchBarFocus ? 1 : 0, zIndex: searchBarFocus ? 1 : -1 }}>
          <TopBar />
          <SuggestionScrollView
            keyboardShouldPersistTaps="always"
            data={suggestedItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
            {
              return (
                <SuggestedItem
                  onPress={() =>
                  {
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
      )}
      {/* 
      THESE SIMILAR CODES ARE NECESSARY BECAUSE OF PLATFORM COMPATIBILITY ISSUES
      - - ISSUES - -
      Android: suggestion items will still be touchable after hiding them.
      ios: suggestion ScrollView won't resize when keyboard is up.
      */}
      {Platform.OS == "android" && searchBarFocus && userData.role == "contractor" && (
        <SuggestionContainer enabled behavior="height" style={{ opacity: searchBarFocus ? 1 : 0, zIndex: searchBarFocus ? 1 : -1 }}>
          <TopBar />
          <SuggestionScrollView
            keyboardShouldPersistTaps="always"
            data={suggestedItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
            {
              return (
                <SuggestedItem
                  onPress={() =>
                  {
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
      )}

      {userData.role == "contractor" && (
        <SearchBar
          placeholder={userData.role == "contractor" ? "Search jobs" : "Search Contractors"}
          placeholderTextColor="#777"
          onChangeText={(text) => setSearchBarValue(text)}
          ref={(searchBarRef) => (searchBar = searchBarRef)}
          onFocus={() =>
          {
            setSearchBarFocus(true);
          }}
          onSubmitEditing={({ nativeEvent }) =>
          {
            setSearchBarValue(nativeEvent.text);
            setSearchBarFocus(false);
            searchBar.blur();
            handleSubmit(nativeEvent.text);
          }}
        />
      )}

      {searchBarFocus && userData.role == "contractor" ? (
        <MenuButton
          activeOpacity={0.9}
          onPress={() =>
          {
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
            onPress={() =>
            {
              Keyboard.dismiss();
              navigation.openDrawer();
            }}
          >
            <MaterialIcons backgroundColor="white" color="black" name="menu" size={30} />
          </MenuButton>

          <Card>
            <OverlayMenu>
              <OverlayMenuItem>
                <Item onPress={() => handleCameraCoordinates(location.coords, dispatch)}>
                  <MaterialIcons backgroundColor="white" color="#444" name="gps-fixed" size={30} />
                </Item>
              </OverlayMenuItem>

              {userData.role == "project_manager" && (
                <OverlayMenuItem size={70}>
                  <Item
                    onPress={() => navigation.navigate("Job Listings", { screen: "Listing Item", params: { edit: false, quickAdd: true } })}
                    color="#39c64e"
                    size={70}
                  >
                    <Entypo backgroundColor="white" color="white" name="plus" size={40} />
                  </Item>
                </OverlayMenuItem>
              )}
            </OverlayMenu>

            <Row style={{ padding: Platform.OS == "ios" ? 20 : 10, justifyContent: "center" }}>
              <Image
                source={require("../../../../assets/logo.png")}
                style={{
                  width: 200,
                  height: 50,
                  resizeMode: "contain",
                }}
              />
            </Row>

            <Row style={{ justifyContent: "center" }}>
              <Text small>1.0.0.0</Text>
            </Row>
          </Card>
        </>
      )}
    </>
  );
}

const OverlayMenu = styled.View`
  z-index: -1;
  bottom: 150%;
  right: 5%;
  position: absolute;
  border-radius: 10px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  /* background: red; */
`;

const OverlayMenuItem = styled.View`
  background: white;
  border-radius: 100px;
  margin: 10px 0;
  height: ${(props) => props.size || 50}px;
  width: ${(props) => props.size || 50}px;
`;

const Item = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: ${(props) => props.size || 50}px;
  width: ${(props) => props.size || 50}px;
  border-radius: 100px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  background: ${(props) => props.color || "white"};
  flex-direction: row;
`;

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
