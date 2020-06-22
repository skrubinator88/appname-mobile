// IMPORT
import React, { useState, useEffect } from "react";
import { View, Platform, Dimensions } from "react-native";
import styled from "styled-components/native";

// Expo
import { FontAwesome } from "@expo/vector-icons";

// import Card from "../../../../components/card";
// import Text from "../../../../components/text";

const deviceHeight = Dimensions.get("window").height;

// BODY
export default function JobFound({ navigation }) {
  return (
    <Card>
      <ProfilePicture
        source={{
          uri: "https://i.insider.com/5899ffcf6e09a897008b5c04?width=1200",
        }}
      ></ProfilePicture>

      <Row first>
        <Column>
          <Text title bold>
            John Doe
          </Text>
          <Text small light>
            Domestic Worker
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text bold>
              <FontAwesome name="map-marker" size={24} color="black" />
            </Text>
            <Text style={{ marginLeft: 10 }} bold>
              13 min
            </Text>
          </View>
        </Column>
        <Column>
          {/* Iterate from array of data pulled from server and render as stars */}
          <View style={{ flexDirection: "row" }}>
            <Text style={{ paddingHorizontal: 1 }}>
              <FontAwesome name="star" size={24} color="black" />
            </Text>
            <Text style={{ paddingHorizontal: 1 }}>
              <FontAwesome name="star" size={24} color="black" />
            </Text>
            <Text style={{ paddingHorizontal: 1 }}>
              <FontAwesome name="star" size={24} color="black" />
            </Text>
            <Text style={{ paddingHorizontal: 1 }}>
              <FontAwesome name="star" size={24} color="black" />
            </Text>
            <Text style={{ paddingHorizontal: 1 }}>
              <FontAwesome name="star-o" size={24} color="black" />
            </Text>
          </View>
          <Text style={{ textAlign: "center" }} bold>
            4.01
          </Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Button>
            <Text medium>View Skills & Licenses</Text>
          </Button>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text medium>View Profile</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Button row>
            <Text medium>Reviews</Text>
          </Button>
        </Column>
      </Row>
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
    </Card>
  );
}

// STYLES
const Container = styled.View`
  flex: 1;
`;

const Card = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  /* border-radius: 40px; */
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background: white;
  width: 100%;
`;

const ProfilePicture = styled.Image`
  margin: -50px auto;
  height: 100px;
  width: 100px;
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
  /* justify-content:  */
  margin: ${(props) => {
    // iPhone 5, 6 SE
    // Small Android phones
    if (deviceHeight < 668) {
      if (props.first) {
        return "30px 5px 0 5px";
      } else if (props.last) {
        return "20px 10px 30px 10px";
      } else {
        return "0px 0px";
      }
    }

    if (props.first) {
      return "30px 10px 0 10px";
    } else if (props.last) {
      return `${
        Platform.OS == "ios" ? "20px 10px 50px 10px" : "20px 10px 30px 10px"
      }`;
    } else {
      return "0px 0px";
    }
  }};
  padding: 0 30px;
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Column = styled.View`
  margin: ${() => {
    // iPhone 5, 6 SE
    // Small Android phones
    if (deviceHeight < 668) {
      return "4px 0";
    }

    return Platform.OS == "ios" ? "5px 0" : "1px";
  }};
`;

const Text = styled.Text`
  margin: 5px 0;
  ${({ title, medium, small }) => {
    // iPhone 5, 6 SE
    // Small Android phones
    if (deviceHeight < 668) {
      switch (true) {
        case title:
          return `font-size: ${Platform.OS == "ios" ? 20 : 15}px`;

        case medium:
          return `font-size: ${Platform.OS == "ios" ? 16 : 12}px`;

        case small:
          return `font-size: ${Platform.OS == "ios" ? 14 : 14}px`;
      }
    }

    switch (true) {
      case title:
        return `font-size: ${Platform.OS == "ios" ? 30 : 25}px`;

      case medium:
        return `font-size: ${Platform.OS == "ios" ? 22 : 17}px`;

      case small:
        return `font-size: ${Platform.OS == "ios" ? 17 : 14}px`;
    }
  }}

  ${({ bold, light }) => {
    switch (true) {
      case bold:
        return `font-weight: ${Platform.OS == "ios" ? 700 : "bold"}`;

      case light:
        return `font-weight: ${Platform.OS == "ios" ? 300 : 100}; color: #999;`;
    }
  }}
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
  }}
`;
