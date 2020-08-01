import React from "react";

import { Platform, SafeAreaView, Dimensions, View, ScrollView } from "react-native";
import styled from "styled-components/native";
import * as VectorIcons from "@expo/vector-icons";

const isIos = Platform.OS === "ios";
const SPACER_SIZE = Dimensions.get("window").height / 2; //arbitrary size

export default function Header({
  // Navigation
  navigation, // @Required

  // General Settings
  titleWeight = "700",
  background = "#f5f5f5",
  headerBackground = "transparent",
  endBackground = "transparent",
  color = "black",

  // Back Button Properties
  backProvider = "",
  backIcon = "",
  backTitle = "",
  backSize = 30,
  backColor = "",
  backAction = "",

  // Middle Section
  title = "",

  // Next Button Properties
  nextProvider = "",
  nextIcon = "",
  nextTitle = "",
  nextSize = 30,
  nextColor = "",
  nextAction,
  children,
}) {
  // @Required
  // if (!navigation) throw Error("navigation: Navigation is Required");
  if (nextTitle && !nextAction) throw Error("nextAction: Action is Required");

  function handleIcons(provider, properties) {
    const Component = VectorIcons[`${provider}`];
    return <Component {...properties} />;
  }

  function handleBackButton() {
    if (backTitle) return backTitle;

    if (backIcon) {
      return handleIcons(backProvider, {
        name: backIcon,
        size: backSize,
        color: backColor || color,
      });
    } else {
      return handleIcons("AntDesign", {
        name: "arrowleft",
        size: backSize,
        color: backColor || color,
      });
    }
  }

  function handleNextButton() {
    if (nextIcon) {
      return handleIcons(nextProvider, {
        name: nextIcon,
        size: nextSize,
        color: nextColor || color,
      });
    } else if (nextTitle) {
      return nextTitle;
    } else {
      return "";
    }
  }

  function handleBackAction() {
    if (backTitle == " ") {
      return "";
    } else {
      return navigation.goBack();
    }
  }

  // Structure

  return (
    <SafeAreaView style={{ backgroundColor: headerBackground }}>
      <Container>
        <Column back>
          <Text style={{ color: backColor || color }} onPress={backAction != "" ? backAction : () => handleBackAction()}>
            {handleBackButton()}
          </Text>
        </Column>

        <Column middle>
          <Title style={{ color, fontWeight: titleWeight }}>{title}</Title>
        </Column>

        <Column next>
          <Text style={{ color: nextColor || color, fontWeight: "700" }} onPress={nextAction}>
            {handleNextButton()}
          </Text>
        </Column>
      </Container>
    </SafeAreaView>
  );
}

// Styles
const Container = styled.View`
  flex: 1;
  margin-top: ${() => (Platform.OS == "ios" ? "1%" : "6%")};
  margin-bottom: 10%;
  padding: 0 0 20px 0;
  flex-direction: row;
`;

const Column = styled.View`
  ${({ back, middle, next }) => {
    switch (true) {
      case back:
        return "flex: 1";
        break;
      case middle:
        return "flex: 2";
        break;
      case next:
        return "flex: 1";
        break;
    }
  }};
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 23px;
  font-weight: 700;
`;

const Text = styled.Text`
  font-size: 17px;
  font-weight: 600;
`;
