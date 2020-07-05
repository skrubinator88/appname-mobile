import React from "react";
import { SafeAreaView } from "react-native";
import styled from "styled-components/native";

import Text from "../../../../components/text";
import Card from "../../../../components/card";

import * as Progress from "react-native-progress";

export default function Searching() {
  return (
    <Card>
      <SafeAreaView>
        <Row>
          <Text medium>Searching for nearby jobs</Text>
        </Row>
        <Row>
          <Progress.Bar progress={1} width={250} />
        </Row>
        <Row>
          <Text small cancel>
            Cancel
          </Text>
        </Row>
      </SafeAreaView>
    </Card>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
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
  */
  padding: 10px 0;
  /* border-bottom-color: #eaeaea; */
  /* border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};  */
`;
