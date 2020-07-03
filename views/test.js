import React, { Component } from "react";
import styled from "styled-components/native";
// import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";

// Components
// import Container from "../components/headerAndContainer";
// import Text from "../components/text";
import { Icon } from "react-native-elements";

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
            <IconBox>
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" color="#d0d0d0" />
            </IconBox>
          </TextBox>
        </Row>

        <Row>
          <TextBox>
            <Text>Mm/Dd/Yy</Text>
            <Text>$00.00</Text>
          </TextBox>
          <TextBox>
            <Text>Job Title</Text>
            <IconBox>
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" color="#d0d0d0" />
            </IconBox>
          </TextBox>
        </Row>

        <Row>
          <TextBox>
            <Text>Mm/Dd/Yy</Text>
            <Text>$00.00</Text>
          </TextBox>
          <TextBox>
            <Text>Job Title</Text>
            <IconBox>
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" />
              <Icon name="star" type="foundation" color="#d0d0d0" />
            </IconBox>
          </TextBox>
        </Row>
      </JobHistorySection>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background: #ececec;
`;

const JobHistorySection = styled.View``;

const Row = styled.View`
  width: 100%;
  height: 63px;
  background: white;
  padding: 10px;
  margin-bottom: 8px;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  flex-direction: column;
  box-shadow: 0px 2px 2px #888888;
`;

const TextBox = styled.View`
  margin: 1px;
  flex-direction: row;
  justify-content: space-between;
`;

const Text = styled.Text``;

const IconBox = styled.View`
  justify-content: flex-end;
  flex-direction: row;
`;
