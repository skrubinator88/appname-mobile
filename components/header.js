import React from "react";

import { Platform, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import * as VectorIcons from "@expo/vector-icons";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

export default function Header({
  // Navigation
  navigation, // @Required

  // General Settings
  background = "transparent",
  color = "black",

  // Back Button Properties
  backProvider = "",
  backIcon = "",
  backTitle = "",
  backSize = 30,
  backColor = "",

  // Middle Section
  title = "",

  // Next Button Properties
  nextProvider = "",
  nextIcon = "",
  nextTitle = "",
  nextSize = 30,
  nextColor = "",
  nextAction,
}) {
  // @Required
  if (!navigation) throw Error("navigation: Navigation is Required");
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

  // Structure

  return (
    <SafeAreaView style={{ backgroundColor: background, flex: 1 }}>
      <Container>
        <Column back>
          <Text
            style={{ color: backColor || color }}
            onPress={() => navigation.goBack()}
          >
            {handleBackButton()}
          </Text>
        </Column>

        <Column middle>
          <Title>{title}</Title>
        </Column>

        <Column next>
          <Text
            style={{ color: nextColor || color, fontWeight: "700" }}
            onPress={nextAction}
          >
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
