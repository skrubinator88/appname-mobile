import React, { Component } from "react";

import {
  Text,
  CheckBox,
  Alert,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Keyboard,
  ScrollView,
  Button,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";

import { TextField, FilledTextField, OutlinedTextField } from "@ubaids/react-native-material-textfield";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
class Screen50 extends Component {
  state = {
    starCount: 4,
  };

  updateSearch = (search) => {
    this.setState({ search });
    console.log(search);
  };

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  Confirm = () => {
    Alert.alert("Confirm");
  };

  Problem = () => {
    Alert.alert("Problem");
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
        <Container>
          <MiddContainer>
            <Content>
              <Text style={{ fontSize: 30, textAlign: "center", fontWeight: "bold", marginTop: 70 }}>Thank you for your review</Text>
            </Content>

            <ContentRate>
              <TextResult style={{ color: "black", marginBottom: 10 }}>You rated Jhon Doe 4 stars</TextResult>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
              />
              <Text
                style={{
                  textAlign: "center",
                  width: 100,
                  padding: 6,
                  borderWidth: 1,
                  marginTop: 18,
                  borderRadius: 5,
                }}
              >
                View Receipt
              </Text>
            </ContentRate>
          </MiddContainer>
          <BtnContainer>
            <StyledBtn title={"Continue"} onPress={this.Confirm} />
          </BtnContainer>
        </Container>
      </KeyboardAvoidingView>
    );
  }
}

const ContentRate = styled.View`
  align-items: center;
  align-content: center;
  text-align: center;
`;

const StyledBtn = styled.Button`
  background: #3869f3;
`;

const MiddContainer = styled.View`
  align-items: center;
  align-content: center;
  text-align: center;
  flex: 0.9;
`;

const Content = styled.View`
  margin: 50px;
`;

const Container = styled.View`
  position: relative;
  flex: 1;
  flex-direction: column;
`;

const BtnContainer = styled.View`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 50px;
  margin-bottom: 10px;
`;

const TextResult = styled.Text`
  color: #a5a5a5;
  text-align: center;
  margin-bottom: 0px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "18px")};
`;

export default Screen50;
