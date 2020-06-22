import React from "react";

import { Platform, SafeAreaView } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function Header({
  navigation,
  backImage = (
    <AntDesign
      name="arrowleft"
      size={30}
      color="black"
      onPress={() => navigation.goBack()}
    />
  ),
  title = "",
  next,
  nextTitle = "Next",
}) {
  return (
    <SafeAreaView>
      <Container>
        <Column back>{backImage}</Column>
        <Column middle>
          <Text
            onPress={() => {
              console.log("ASd");
            }}
          >
            {title}
          </Text>
        </Column>
        <Column next>
          {next && (
            <Text
              style={{ color: "#1c55ef" }}
              onPress={() => navigation.navigate(next)}
            >
              {nextTitle}
            </Text>
          )}
        </Column>
      </Container>
    </SafeAreaView>
  );
}

const Container = styled.View`
  margin-top: ${() => (Platform.OS == "ios" ? "1%" : "6%")};
  margin-bottom: 10%;
  /* margin-left: 5%; */
  flex-direction: row;
`;

const Column = styled.View`
  ${({ back, middle, next }) => {
    switch (true) {
      case back:
        return "flex: 1";
        break;
      case middle:
        return "flex: 3";
        break;
      case next:
        return "flex: 1";
        break;
    }
  }};
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Text = styled.Text`
  /* border: 1px solid black; */
  padding: 10px 20%;
  font-size: 17px;
  font-weight: 700;
`;
