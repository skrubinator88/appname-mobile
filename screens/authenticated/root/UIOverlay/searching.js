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
  padding: 10px 0;
`;
