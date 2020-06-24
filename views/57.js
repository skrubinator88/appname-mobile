import React, { Component } from "react";

import { Image, Button, Alert, TextInput, View } from "react-native";

import { Platform, Dimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

// Components
import Header from "../components/header";
import Text from "../components/text";

const isIos = Platform.OS === "ios";
const SPACER_SIZE = Dimensions.get("window").height / 2; //arbitrary size

export function Screen57({ navigation }) {
  return (
    <Container
      contentInset={{ top: -SPACER_SIZE + 35 }}
      contentOffset={{ y: SPACER_SIZE - 20 }}
    >
      {isIos && (
        <View style={{ height: SPACER_SIZE, backgroundColor: "#3869f3" }} />
      )}
      <Header
        navigation={true}
        nextTitle="Save"
        color="white"
        background="#3869f3"
        nextProvider="Entypo"
        nextIcon="dots-three-horizontal"
        nextSize={25}
        nextAction={() => {}}
      />

      {/* Profile Section */}

      <ProfileSection>
        <ProfilePicture
          source={{
            uri: "https://i.insider.com/5899ffcf6e09a897008b5c04?width=1200",
          }}
        ></ProfilePicture>

        <Text title color="white" weight="700">
          John Doe
        </Text>
        <Text medium color="white" weight="300">
          Construction Laborer
        </Text>

        <Row>
          <Column>
            <Text title color="white" weight="700">
              4.01 <FontAwesome name="star" size={25} />
            </Text>
            <Text medium weight="300" color="white">
              Rating
            </Text>
          </Column>
          <Column>
            <Text title color="white" weight="700">
              8
            </Text>
            <Text medium weight="300" color="white">
              Months
            </Text>
          </Column>
        </Row>
      </ProfileSection>

      {/* Details Section */}

      <DetailSection>
        <DetailItemRow>
          <DetailItemColumn>
            <Text small weight="700" color="#4a4a4a">
              PHONE
            </Text>
            <Text small weight="300">
              000.000.0000
            </Text>
          </DetailItemColumn>
        </DetailItemRow>

        <DetailItemRow>
          <DetailItemColumn>
            <Text small weight="700" color="#4a4a4a">
              EMAIL
            </Text>
            <Text small weight="300">
              JDoe@companyName.net
            </Text>
          </DetailItemColumn>
        </DetailItemRow>

        <DetailItemRow>
          <DetailItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              SKILLS & lICENSES
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </DetailItemRowLink>
        </DetailItemRow>

        <DetailItemRow>
          <DetailItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              QR CODE
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </DetailItemRowLink>
        </DetailItemRow>
      </DetailSection>

      {/* Comments Section */}

      <CommentSection>
        <CommentItemRow>
          <CommentItemColumn>
            <CommentItemRowLink>
              <Text medium weight="700">
                Compliments
              </Text>
              <Text small weight="700" color="#a0a0a0">
                View All
              </Text>
            </CommentItemRowLink>
            {/*  */}
            <Compliments
              horizontal={true}
              alwaysBounceHorizontal={true}
              alwaysBounceVertical={false}
              decelerationRate={0}
              snapToInterval={150} //your element width
              snapToAlignment="start"
            >
              <ComplimentItem>
                <Text medium weight="700">
                  Great Task Management
                </Text>
              </ComplimentItem>
              <ComplimentItem>
                <Text medium weight="700">
                  Great Task Management
                </Text>
              </ComplimentItem>
              <ComplimentItem>
                <Text medium weight="700">
                  Great Task Management
                </Text>
              </ComplimentItem>
              <ComplimentItem>
                <Text medium weight="700">
                  Great Task Management
                </Text>
              </ComplimentItem>
              <ComplimentItem>
                <Text medium weight="700">
                  Great Task Management
                </Text>
              </ComplimentItem>
            </Compliments>
            {/*  */}
          </CommentItemColumn>
        </CommentItemRow>

        <CommentItemRow>
          <CommentItemRowLink>
            <Text medium weight="700">
              Compliments
            </Text>
            <Text small weight="700" color="#a0a0a0">
              View All
            </Text>
          </CommentItemRowLink>
        </CommentItemRow>
      </CommentSection>
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  background: #e4e4e4;
`;

const ProfileSection = styled.View`
  background: #3869f3;
  justify-content: center;
  align-items: center;
`;

const ProfilePicture = styled.Image`
  height: 100px;
  width: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

const Row = styled.View`
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Details Section

const DetailSection = styled.View`
  background: white;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const DetailItemRow = styled.View`
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const DetailItemColumn = styled.View`
  width: 100%;
  padding: 3px 5%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const DetailItemRowLink = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Comments Section

const CommentSection = styled.View`
  background: white;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const CommentItemRow = styled.View`
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const CommentItemColumn = styled.View`
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CommentItemRowLink = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Compliments = styled.ScrollView`
  width: 100%;
  flex-direction: row;
  border: 1px solid black;
`;

const ComplimentItem = styled.View`
  border: 1px solid black;
  width: 150px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
