// IMPORT
import React, { useState, useEffect } from "react";
import { View, Platform, Dimensions, SafeAreaView } from "react-native";
import styled from "styled-components/native";

// Expo
import { FontAwesome } from "@expo/vector-icons";

// import Card from "../../../../components/card";
import Text from "../../../../components/text";

const deviceHeight = Dimensions.get("window").height;

// BODY
export default function Screen45({ navigation }) {
  return (
    <Card>
      <View>
        <ProfilePicture
          source={{
            uri: "https://i.insider.com/5899ffcf6e09a897008b5c04?width=1200",
          }}
        ></ProfilePicture>

        <Row first>
          <Column
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text title bold marginBottom="5px">
              John Doe
            </Text>
            <Text small light marginBottom="5px">
              Domestic Worker
            </Text>
          </Column>

          <Column
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ paddingBottom: 10 }} color="#999">
              Cancel Job
            </Text>

            <Column>
              <View style={{ flexDirection: "row" }}>
                <Column style={{ justifyContent: "center" }}>
                  <FontAwesome name="star" size={24} color="black" />
                </Column>

                <Column style={{ paddingLeft: 5, justifyContent: "center" }}>
                  <Text bold>4.01</Text>
                </Column>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Column style={{ justifyContent: "center" }}>
                  <FontAwesome name="map-marker" size={24} color="black" />
                </Column>

                <Column style={{ paddingLeft: 5, justifyContent: "center" }}>
                  <Text bold>13 min</Text>
                </Column>
              </View>
            </Column>
          </Column>
        </Row>
        <Row>
          <Column>
            <JobDescription>
              <Text small light marginBottom="5px">
                Job Description
              </Text>
              <Text small marginBottom="5px">
                $34/hr
              </Text>
            </JobDescription>

            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum bibendum dui et lacinia elementum. Donec vitae diam eu
              nisi pellentesque malesuada sagittis et ipsum. Donec eleifend nunc
              et tincidunt viverra. Sed nec lacus vel erat auctor convallis. In
              hac habitasse platea dictumst.
            </Text>
          </Column>
        </Row>

        <CardOptionItem row>
          <Text small>Reviews</Text>
        </CardOptionItem>

        <Row last>
          <Column>
            <Button decline onPress={() => navigation.pop()}>
              <Text style={{ color: "red" }} medium>
                Decline
              </Text>
            </Button>
          </Column>
          <Column>
            <Button accept onPress={() => navigation.push("Home2")}>
              <Text style={{ color: "white" }} medium>
                Accept
              </Text>
            </Button>
          </Column>
        </Row>
      </View>
    </Card>
  );
}

// STYLES

const Card = styled.SafeAreaView`
  position: absolute;
  left: 0;
  bottom: 0;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-shadow: -10px 0px 20px #999;
  background: white;
  width: 100%;
`;

const ProfilePicture = styled.Image`
  margin: -35px auto;
  height: 70px;
  width: 70px;
  border-radius: 50px;
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
  ${({ first }) => {
    switch (true) {
      case first:
        return `
        margin: 4% 0 0 0;
        `;
    }
  }}
  padding: 3% 30px;
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Column = styled.View`
  border: 1px solid black;
  flex-direction: column;
`;

const CardOptionItem = styled.TouchableOpacity`
  padding: 10px 30px;
  width: 100%;
  border-bottom-color: #eaeaea;
  border-bottom-width: 1px;
`;

const Button = styled.TouchableOpacity`
  ${({ decline, accept, row }) => {
    switch (true) {
      case accept:
        return `
        background: #00a0e5; 
        padding: 10px 40px; 
        border-radius: 8px;
        `;

      case decline:
        return `
        border: 1px solid red; 
        background: white; 
        padding: 10px 40px; 
        border-radius: 8px;
        `;
    }
  }};
`;

const JobDescription = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
