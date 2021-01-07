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
  FlatList,
  KeyboardAvoidingView,
} from "react-native";

import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from "@ubaids/react-native-material-textfield";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
class Screen47 extends Component {
  state = {
    search: "",
    DATA: [
      {
        id: "1",
        image: "../assets/cheems2.jpg",
        title: "Great Task Management",
      },
      {
        id: "2",
        image: "../assets/cheems2.jpg",
        title: "Excellent Service",
      },
      {
        id: "3",
        image: "../assets/cheems2.jpg",
        title: "Excellent Negotiator",
      },
      {
        id: "4",
        image: "../assets/cheems2.jpg",
        title: "Great Task Management",
      },
      {
        id: "5",
        image: "../assets/cheems2.jpg",
        title: "Great Task Management",
      },
      {
        id: "6",
        image: "../assets/cheems2.jpg",
        title: "Great Task Management",
      },
    ],
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
    function Item({ title, image }) {
      return (
        
          <LicResult>
            <CompImage source={require("../assets/cheems2.jpg")} />
            <TextResult style={{ color: "black", width: 120 }}>
              {title}
            </TextResult>
          </LicResult>
     
      );
    }

    return (
      <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
          <Container> 

            <ContainerTop>{/* aqui va el header */}</ContainerTop>
            <Fields>
              <UserImage source={require("../assets/cheems2.jpg")} />
              <TextStyledContent>Jhon Doe</TextStyledContent>
              <TextResult>Company Co. LLC</TextResult>
              <RateBox>
                <TextResult style={{ color: "black" }}>Good</TextResult>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={this.state.starCount}
                  selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
              </RateBox>
              <ResultBox>
                <TextResult
                  style={{ color: "black", marginTop: 10, marginBottom: 0 }}
                >
                  Give a compliment
                </TextResult>

                <FlatList     style={{marginLeft:50, marginRight:50 }}
                showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={this.state.DATA}
                  renderItem={({ item }) => (
                    <Item title={item.title} image={item.image} />
                  )}
                  keyExtractor={(item) => item.id}
                />
              </ResultBox>
            </Fields>
            <BtnContainer>
              <TextField style={{ margin: 0 }} placeholder="Leave a comment" />
              <Text
                style={{ textAlign: "center", marginTop: 30, marginBottom: 20 }}
                onPress={this.Problem}
              >
                Had any issues?
              </Text>

              <StyledBtn title={"Confirm"} onPress={this.Confirm} />
            </BtnContainer>
          </Container>
      </KeyboardAvoidingView>
    );
  }
}

const StyledBtn = styled.Button`
  background: #3869f3;
`;

const UserImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  margin-top: 20px;
`;

const CompImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 50px;
  margin-top: 10px;
`;
const Fields = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px;
  margin-bottom: 0px;
`;
const LicResult = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
  align-items: center;
`;

const RateBox = styled.View`
  margin: 10px;
  padding: 10px;
  margin-top: 5px;
`;

const Container = styled.View`
  position: relative;
  flex: 1;
  flex-direction: column;
`;
const BtnContainer = styled.View`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 0px;
`;

const ContainerTop = styled.View`
  flex: 0.6;
  background: #3869f3;
`;

const ResultBox = styled.View`
  margin: 0px;
  margin-top: 1px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-left-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  width: 500px;
  border-color: #efefef;
`;

const TextStyledContent = styled.Text`
  text-align: center;
  margin-top: 0px;
  font-weight: bold;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "20px")};
`;

const TextResult = styled.Text`
  color: #a5a5a5;
  text-align: center;
  margin-bottom: 10px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "18px")};
`;

export default Screen47;
