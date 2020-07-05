import React, { Component } from "react";

import { Image, Button, Alert, TextInput, View } from "react-native";

import { Platform, Dimensions } from "react-native";
import styled from "styled-components/native";
import { FontAwesome, Ionicons, Octicons } from "@expo/vector-icons";

// Components
import Container from "../components/headerAndContainer";
import Text from "../components/text";

const isIos = Platform.OS === "ios";
const SPACER_SIZE = Dimensions.get("window").height / 2; //arbitrary size

export default function Screen65({ navigation }) {
  return (
    <Container
      navigation={true}
      nextTitle="Save"
      color="white"
      title="Legal"
      titleWeight="300"
      headerBackground="#3869f3"
      nextProvider="Entypo"
      nextIcon="dots-three-horizontal"
      nextSize={25}
      nextAction={() => {}}
    >
      {/* Preffered Section */}

      <LegalSection>
        <PrefferedLegalItemRow>
          <Column ProfilePicture>
            <ProfilePicture
              source={{
                uri:
                  "https://i.insider.com/5899ffcf6e09a897008b5c04?width=1200",
              }}
            ></ProfilePicture>
          </Column>
          <Column ProfilePictureDescription>
            <Text medium color="#474747">
              John Doe
            </Text>
            <Text medium color="#474747">
              000.000.0000
            </Text>
            <Text small color="#474747">
              JohnDoe@company.net
            </Text>
          </Column>
        </PrefferedLegalItemRow>
      </LegalSection>

      {/* Legal Section */}

      <LegalSection>
        <SectionTitle>
          <View style={{ margin: 10 }}>
            <Text small bold color="#474747">
              LEGAL
            </Text>
          </View>
        </SectionTitle>

        <LegalItemRow>
          <LegalItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              TERMS AND CONDITIONS
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </LegalItemRowLink>
        </LegalItemRow>

        <LegalItemRow>
          <LegalItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              PRIVACY POLICY
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </LegalItemRowLink>
        </LegalItemRow>

        <LegalItemRow>
          <LegalItemRowLink>
            <Text small weight="700" color="#4a4a4a">
              APPNAME GUIDELINES
            </Text>
            <Ionicons name="ios-arrow-forward" size={20} />
          </LegalItemRowLink>
        </LegalItemRow>
      </LegalSection>

      <SignOutSection>
        <SignOutItemRow>
          <SignOutItemRowLink>
            <Text small weight="700" color="#ff4a4a">
              SIGN OUT
            </Text>
          </SignOutItemRowLink>
        </SignOutItemRow>
      </SignOutSection>
    </Container>
  );
}

// Legals Section
const SectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const LegalSection = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const SignOutSection = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const LegalItemRow = styled.TouchableOpacity`
  background: white;
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const LegalItemRowLink = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Profile Section
const ProfilePicture = styled.Image`
  height: 60px;
  width: 60px;
  border-radius: 50px;
`;

const PrefferedLegalItemRow = styled.View`
  background: white;
  padding: 0 5%;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #f5f5f5;
`;

const Column = styled.View`
  padding: 10px;
  ${({ ProfilePicture, ProfilePictureDescription }) => {
    if (ProfilePicture) return "flex: 1";
    if (ProfilePictureDescription) return "flex: 3";
  }}
`;

// Sign Out Section

const SignOutItemRow = styled.TouchableOpacity`
  background: white;
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const SignOutItemRowLink = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
