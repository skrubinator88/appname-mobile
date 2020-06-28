import React, { Component } from "react";

import { View, StyleSheet, Image, Text } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

class contractorApp extends Component {
  render() {
    return (
      <Container>
        <HeaderBox>
          <IconLeft>
            <Ionicons
              name="md-trash"
              size={25}
              color="#6A6A6A"
              onPress={() => navigation.goBack()}
            />
          </IconLeft>

          <IconRight>
            <Entypo
              name="star"
              size={25}
              color="#34C5EB"
              onPress={() => navigation.goBack()}
            />
          </IconRight>
        </HeaderBox>

        <ContentBox>
          <ImageProfile source={require("./assets/Ellipse_1.png")} />
   <ContentColum>
   <ContentInfo>
            <StyledText style={{ fontWeight: "bold" }}>_domakeup</StyledText>
            <StyledText>Daniela Ordoñez</StyledText>
          </ContentInfo>
          <ContentFollow>
            <ContentData>
               <StyledText style={{ fontWeight: "bold" }}>100k</StyledText>
          <StyledText>Seguidores</StyledText>
            </ContentData>
            <ContentData>
                  <StyledText style={{ fontWeight: "bold" }}>9.9</StyledText>
         <StyledText>Rating</StyledText>
            </ContentData>
        

          </ContentFollow>
   </ContentColum>
        </ContentBox>
        <ButtonBox>
          <FollowBtn>Seguir</FollowBtn>
          <ShareBtn>Compartir</ShareBtn>
        </ButtonBox>
      </Container>
    );
  }
}

const Container = styled.View`
  flex: 0.4;
  flex-direction: column;
  margin-top: 35px;
  justify-content: flex-end;
  margin-left: 10px;
  margin-right: 10px;
  /* background:red;  */
  border-width: 1px;
  border-color: #e6e6e6;

  border-radius: 10px;
`;

const IconLeft = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  margin-right: 10px;
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 8px;
`;

const IconRight = styled.View`
  flex: 1;
  justify-content: flex-end;
  flex-direction: row;
  margin-right: 20px;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 8px;
`;

const ButtonBox = styled.View`
  /* background:yellow; */
  flex-direction: row;
`;

const ContentBox = styled.View`
  flex: 1.4;

  /* background: red; */
  flex-direction: row;
`;

const HeaderBox = styled.View`
  flex: 0.4;
  /* background: yellow; */
  flex-direction: row;
`;

const FollowBtn = styled.Text`
  padding: 20px;
  width: 50%;
  text-align: center;
  border-width: 1px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  border-color: #e6e6e6;
  font-size: 18px;
`;

const ShareBtn = styled.Text`
  padding: 20px;
  width: 50%;
  text-align: center;
  border-width: 1px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-color: #e6e6e6;
  font-size: 18px;
`;

const ImageProfile = styled.Image`
  width: 135px;
  height: 135px;
  margin-left: 16px;
  margin-right: 5px;
`;

const StyledText = styled.Text`
  text-align: center;
  margin: 5px;
  font-size:18px;
`;

const ContentInfo = styled.View`
  flex: 0.5;
  /* background: green; */
`;

const ContentData = styled.View`
  flex: 1;
  /* background: blueviolet; */
`;

const ContentFollow = styled.View`
 flex:0.5;
 flex-direction:row;
  /* background: purple; */
`;

const ContentColum = styled.View`
flex:1;
flex-direction:column;
  /* background: purple; */
`;

export default contractorApp;
