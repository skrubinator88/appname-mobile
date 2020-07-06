// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Platform, Dimensions, SafeAreaView } from "react-native";
import styled from "styled-components/native";

// Expo
import { FontAwesome } from "@expo/vector-icons";

// import Card from "../../../../components/card";
import Text from "../../../../components/text";

const deviceHeight = Dimensions.get("window").height;

import { UIOverlayContext } from "../../../../components/context";

// BODY
export default function JobFound({ navigation }) {
  const { changeRoute } = useContext(UIOverlayContext);

  return (
    <Card>
      <View>
        <ProfilePicture
          source={{
            uri: "https://i.insider.com/5899ffcf6e09a897008b5c04?width=1200",
          }}
        ></ProfilePicture>

        <Row first>
          <Column>
            <Text title bold marginBottom="5px">
              John Doe
            </Text>
            <Text small light marginBottom="5px">
              Domestic Worker
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text bold marginBottom="5px">
                <FontAwesome name="map-marker" size={24} color="black" />
              </Text>
              <Text style={{ marginLeft: 10 }} bold>
                13 min
              </Text>
            </View>
          </Column>
          <Column>
            {/* Iterate from array of data pulled from server and render as stars */}
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
            <Button decline onPress={() => changeRoute("dashboard")}>
              <Text style={{ color: "red" }} medium>
                Decline
              </Text>
            </Button>
          </Column>
          <Column>
            <Button accept onPress={() => changeRoute("acceptedJob")}>
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
