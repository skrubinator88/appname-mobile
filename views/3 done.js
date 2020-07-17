import React, { Component } from "react";

import { Text, Image, Button, Alert, TextInput, View } from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";
class contractorApp extends Component {
  render() {
    const EmployeeAgreement = (e) => {
      Alert.alert("Employee Agreement");
    };
    const PrivacyPolicy = (e) => {
      Alert.alert("Privacy Policy");
    };
    const TermsConditions = (e) => {
      Alert.alert("Terms & Conditions");
    };

    const HideEmployee = (e) => {
      Alert.alert("HideEmployee");
    };

    const HideEmployer = (e) => {
      Alert.alert("HideEmployer");
    };
    return (
      <Container>
        <ContainerTop>
          <IconBack>
            <AntDesign
              name="arrowleft"
              size={30}
              color="black"
              onPress={() => navigation.goBack()}
            />
          </IconBack>
          <TextStyledTittle>User Responsibilities</TextStyledTittle>
        </ContainerTop>
        <ContainerTopMiddle>
          <TextStyledContent onPress={(e) => HideEmployer(e)}>Employer</TextStyledContent>
          <TextStyledContent style={{ marginLeft: 30 }} onPress={(e) => HideEmployee(e)}>
            Employee
          </TextStyledContent>
          
        </ContainerTopMiddle>
        <ContainerMiddle>


    <Employer>
    <TextStyledInfo>- Accept and follow the guidelines set for employees provided by CONTRACTORAPP</TextStyledInfo>
          <TextStyledInfo>- Create, manage, and post jobs for employees to find</TextStyledInfo>
          <TextStyledInfo>- Provide an address for the work site</TextStyledInfo>
          <TextStyledInfo>- Briefly describe appropriate tasks needed to be completed</TextStyledInfo>
          <TextStyledInfo>- Be respectful of the employer, the work site, and other users of CONTRACTORAPP</TextStyledInfo>
    </Employer>



    <Employee>
    <TextStyledInfo style={{ fontSize: 18 }}>- Accept and follow the guidelines set for employees provided by CONTRACTORAPP</TextStyledInfo>
          <TextStyledInfo>- Arrive to the work site in a timely  manner and complete tasks set by the Employer</TextStyledInfo>
          <TextStyledInfo>- Be respectful of the employer, the work site, and other users of CONTRACTORAPP</TextStyledInfo>
    </Employee>

<Terms>
<TextStyledInfo style={{ fontSize: 17, color: "#1C55EF", fontWeight: "bold", margin: 10 }} onPress={(e) => EmployeeAgreement(e)}>Employee Agreement</TextStyledInfo>
<TextStyledInfo style={{ fontSize: 17, color: "#1C55EF", fontWeight: "bold", margin: 10 }} onPress={(e) => PrivacyPolicy(e)}>Privacy Policy Agreement</TextStyledInfo>
<TextStyledInfo style={{ fontSize: 17, color: "#1C55EF", fontWeight: "bold", margin: 10 }} onPress={(e) => TermsConditions(e)}>Terms & Conditions</TextStyledInfo>

</Terms>

        </ContainerMiddle>
      </Container>
    );
  }
}

const ButtonStyled = styled.TouchableOpacity`
  background-color: #1c55ef;
  padding: ${() => (Platform.OS == "ios" ? "15px" : "10px")};
  width: 80%;
  border-radius: 6px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const ButtonStyledWork = styled.TouchableOpacity`
  background-color: white;
  padding: ${() => (Platform.OS == "ios" ? "15px" : "10px")};
  width: 80%;
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color: #1c55ef;
  margin: 0 auto;
  margin-top: 90px;
  align-items: center;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
`;

var Employer = styled.View`
 
`;

const Terms = styled.View`
 margin-top: 40px;

`;

var Employee = styled.View`
display: none;
`;

const IconBack = styled.View`
  margin-bottom: 50px;
`;

const ContainerMiddle = styled.View`
  flex: 0.6;
  margin-left: 13px;
  margin-right: 13px;

`;

const ContainerTop = styled.View`
  margin-top: 50px;
  margin-left: 30px;
  margin-right: 30px;
`;
const ContainerTopMiddle = styled.View`
  flex: 0.06;
  padding: 20px;
  padding-bottom:0px;
  padding-left: 20px;
  margin-left: 13px;
  margin-right: 13px;
  flex-direction: row;
  margin-top: 20px;


  
`;

const TextStyledContent = styled.Text`
  color: #1C55EF;
  font-weight: bold;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "18px")};
`;

const TextStyledTittle = styled.Text`
  text-align: center;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "28px")};
`;

const TextStyledInfo = styled.Text`
  margin-top: 10px;
  margin-left: 3px;
 margin-right: 3px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "19px")};
`;

export default contractorApp;
