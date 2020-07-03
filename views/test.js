import React, { Component } from "react";
import styled from "styled-components/native";
// import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";

// Components
// import Container from "../components/headerAndContainer";
// import Text from "../components/text";

export default function Screen60({ navigation }) {
  return (
    <Container>
      <JobHistorySection>
        <Row>
          <TextBox>
            <Text>Mm/Dd/Yy</Text>
            <Text>$00.00</Text>
          </TextBox>
          <TextBox>
            <Text>Job Title</Text>
            <Text>stars</Text>
          </TextBox>
        </Row>

        <Row>
          <TextBox>
            <Text>Mm/Dd/Yy</Text>
            <Text>$00.00</Text>
          </TextBox>
          <TextBox>
            <Text>Job Title</Text>
            <Text>stars</Text>
          </TextBox>
        </Row>

        <Row>
          <TextBox>
            <Text>Mm/Dd/Yy</Text>
            <Text>$00.00</Text>
          </TextBox>
          <TextBox>
            <Text>Job Title</Text>
            <Text>stars</Text>
          </TextBox>
        </Row>
      </JobHistorySection>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background: blue;
`;

const JobHistorySection = styled.View`
  background: red;
`;

const Row = styled.View`
  width: 100%;
  height: 60px;
  background: yellow;
  padding: 10px;
  margin-bottom: 5px;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
  flex-direction: column;
`;

const TextBox = styled.View`
  border: 1px solid;
  flex-direction: row;
  justify-content: space-between;
`;

const Text = styled.Text``;
