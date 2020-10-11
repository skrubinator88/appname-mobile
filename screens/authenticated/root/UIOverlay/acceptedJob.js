// IMPORT
import React, { useState, useEffect, useContext } from "react";
import { View, Platform, Dimensions, SafeAreaView } from "react-native";
import styled from "styled-components/native";

// Expo
import { FontAwesome, Ionicons } from "@expo/vector-icons";

// import Card from "../../../../components/card";
import Text from "../../../../components/text";

const deviceHeight = Dimensions.get("window").height;

import { UIOverlayContext, GlobalContext } from "../../../../components/context";

// BODY
export default function Screen45({ navigation, projectManagerInfo, job_data }) {
  const { authState } = useContext(GlobalContext);
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
          <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text title bold marginBottom="5px">
              {projectManagerInfo.first_name} {projectManagerInfo.last_name}
            </Text>
            <Text small light marginBottom="5px">
              Domestic Worker
            </Text>
          </Column>

          <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ paddingBottom: 10 }} color="#999">
              Cancel Job
            </Text>

            <Column>
              <View style={{ flexDirection: "row" }}>
                <Column
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                  }}
                >
                  <FontAwesome name="star" size={24} color="black" />
                </Column>

                <Column style={{ paddingLeft: 5, justifyContent: "center" }}>
                  <Text bold>{projectManagerInfo.star_rate}</Text>
                </Column>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Column
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                  }}
                >
                  <FontAwesome name="map-marker" size={24} color="black" />
                </Column>

                <Column style={{ paddingLeft: 5, justifyContent: "center" }}>
                  <Text bold>15 min.</Text>
                </Column>
              </View>
            </Column>
          </Column>
        </Row>

        <Row>
          <Column style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <Column location>
                <Text small light marginBottom="5px">
                  Location
                </Text>
                <Text small>{job_data.location.address}</Text>
              </Column>

              <Column
                style={{
                  justifyContent: "center",
                }}
              >
                <Button
                  accept
                  onPress={() => {
                    // console.log(projectManagerInfo);
                    // console.log(job_data.posted_by);
                    navigation.navigate("Chat", { receiver: job_data.posted_by });
                  }}
                >
                  <Text style={{ color: "white" }} medium>
                    Message
                  </Text>
                </Button>
              </Column>
            </View>
          </Column>
        </Row>

        {/* <CardOptionItem row>
          <Text small>QR Code</Text>
          <Ionicons name="ios-arrow-forward" size={24} />
        </CardOptionItem> */}

        <CardOptionItem row>
          <Text small>View Job Description</Text>
          <Ionicons name="ios-arrow-forward" size={24} />
        </CardOptionItem>

        {/* <CardOptionItem row>
          <Text small>View Profile</Text>
          <Ionicons name="ios-arrow-forward" size={24} />
        </CardOptionItem> */}

        <CardOptionItem row>
          <Text small>Report Job</Text>
          <Ionicons name="ios-arrow-forward" size={24} />
        </CardOptionItem>

        <CardOptionItem row>
          <Text small>Reschedule Job</Text>
          <Ionicons name="ios-arrow-forward" size={24} />
        </CardOptionItem>
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

  ${({ location }) => {
    switch (true) {
      case location:
        return `
        width: 50%;
        `;
    }
  }};
`;

const CardOptionItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
