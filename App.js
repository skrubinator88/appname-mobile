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
} from "react-native";

import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from "react-native-material-textfield";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
import StarRating from "react-native-star-rating";
class contractorApp extends Component {
  state = {
    search: "",
    DATA: [
      {
        id: "1",
        image: "./assets/cheems2.jpg",
        title: "Great Task Management",
      },
      {
        id: "2",
        image: "./assets/cheems2.jpg",
        title: "Excellent Service",
      },
      {
        id: "3",
        image: "./assets/cheems2.jpg",
        title: "Excellent Negotiator",
      },
      {
        id: "4",
        image: "./assets/cheems2.jpg",
        title: "Great Task Management",
      },
      {
        id: "5",
        image: "./assets/cheems2.jpg",
        title: "Great Task Management",
      },
      {
        id: "6",
        image: "./assets/cheems2.jpg",
        title: "Great Task Management",
      },
    ],
  };


  updateSearch = (search) => {
    this.setState({ search });
    console.log(search)
  };

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }
  render() {
    const { search } = this.state;
    const Cancel = (e) => {
      Alert.alert("Cancel");
    };
    const Save = (e) => {
      Alert.alert("Save");
    };

    function Item({ title, image }) {
      return (
      <Margin>
          <LicResult>
           <CompImage source={require("./assets/cheems2.jpg")} />
          <TextResult style={{ color: "black", width:120 }}>{title}</TextResult>
        </LicResult>
      </Margin>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        
        <Container>
        <ContainerTop>{/* aqui va el header */}</ContainerTop>
        <Fields>
        <UserImage source={require("./assets/cheems2.jpg")} />
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
         
          <TextResult style={{ color: "black", marginTop:10,marginBottom:10 }}>Give a compliment</TextResult>
          
            <FlatList
              horizontal={true}
              data={this.state.DATA}
              renderItem={({ item }) => (
                <Item
                  title={item.title}
                  image={item.image}
                />
              )}
              keyExtractor={(item) => item.id}
            />

          </ResultBox>          
        </Fields>
        <BtnContainer>
        <TextField style={{margin: 100}} label="Leave a comment" />
        </BtnContainer>
          
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

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
  margin-bottom:0px;
`;
const LicResult = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
  align-items:center;

`;

const RateBox = styled.View`
  margin: 20px;
  padding: 10px;
  margin-top: 5px;
`;

const Container = styled.View`
  flex: 1;
  flex-direction:column;

`;
const BtnContainer = styled.View`
  flex: 1;
 
`;
const Margin = styled.View`
  margin-left:50px;
  margin-right:50px;

`;

const ContainerTop = styled.View`
  flex: 0.7;
  background: #3869f3;
`;

const ResultBox = styled.View`
  margin: 20px;
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
  margin-top: 10px;
  font-weight: bold;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "20px")};
`;

const TextResult = styled.Text`
  color: #a5a5a5;
  text-align: center;
  margin-bottom: 10px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "18px")};
`;

export default contractorApp;
