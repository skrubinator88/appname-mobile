import React from "react";
import { SafeAreaView } from "react-native";
import styled from "styled-components/native";

export default function HandleCardUIComponents({ state }) {
  const { searching } = state;
  if (!searching) {
    return (
      <Card>
        <SafeAreaView>
          <Row last>
            <Text medium>
              0.0.0.111kjdahflkjahdlfkjahldkfjhalskdjfhlaksdjfhlkajsdhflkjh
            </Text>
          </Row>
        </SafeAreaView>
      </Card>
    );
  } else if (searching) {
    return (
      <Card>
        <SafeAreaView>
          <Row last>
            <Text medium>Searching</Text>
          </Row>
        </SafeAreaView>
      </Card>
    );
  }
  return <Card></Card>;
}

const Card = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 40px;
  background: white;
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: ${({ first, last }) => {
    switch (true) {
      case first:
        return "space-between";
      case last:
        return "space-around";
      default:
        return "flex-start";
    }
  }};
  /* justify-content:  */
  margin: ${(props) => {
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
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Text = styled.Text`
  margin: 5px 0;
  ${({ title, medium, small }) => {
    switch (true) {
      case title:
        return `font-size: 22px`;

      case medium:
        return `font-size: 20px`;

      case small:
        return `font-size: 39px`;
    }
  }}

  ${({ bold, light }) => {
    switch (true) {
      case bold:
        return `font-weight: 800`;

      case light:
        return `font-weight: 300; color: #999;`;
    }
  }}
`;
