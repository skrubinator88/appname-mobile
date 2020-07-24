import React from "react";
import { View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import Header from "../../../../components/header";
import Text from "../../../../components/text";
import { TextField } from "react-native-material-textfield";

export function SignUpContractorScreen4({ navigation }) {
  const { colors } = useTheme();
  let firstNameRef;
  let lastNameRef;
  let occupationRef;
  let cityRef;
  let stateRef;
  let emailRef;
  const onSubmitFirstName = () => lastNameRef.focus();
  const onSubmitLastName = () => occupationRef.focus();
  const onSubmitOccupation = () => cityRef.focus();
  const onSubmitCity = () => stateRef.focus();
  const onSubmitState = () => emailRef.focus();
  const handleSubmit = () => {
    // navigation.navigate("root");
    console.log("yes");
  }; // Send to store

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Header navigation={navigation} backTitle=" " />
        <Text align="center" title>
          You're verified! Let's get started on your account
        </Text>

        <Form>
          <TextField
            label="First Name"
            ref={(ref) => (firstNameRef = ref)}
            returnKeyType="next"
            onSubmitEditing={() => onSubmitFirstName()}
          />
          <TextField label="Last Name" ref={(ref) => (lastNameRef = ref)} returnKeyType="next" onSubmitEditing={() => onSubmitLastName()} />
          <TextField
            label="Occupation"
            ref={(ref) => (occupationRef = ref)}
            returnKeyType="next"
            onSubmitEditing={() => onSubmitOccupation()}
          />
          <Row>
            <CityField>
              <TextField label="City" ref={(ref) => (cityRef = ref)} returnKeyType="next" onSubmitEditing={() => onSubmitCity()} />
            </CityField>
            <StateField>
              <TextField label="State" ref={(ref) => (stateRef = ref)} returnKeyType="next" onSubmitEditing={() => onSubmitState()} />
            </StateField>
          </Row>
          <TextField label="Email Address" ref={(ref) => (emailRef = ref)} returnKeyType="done" onSubmitEditing={() => handleSubmit()} />
        </Form>
        {/* <KeyboardAvoidingView enabled behavior="padding" style={{ flex: 1 }}> */}
        <Terms>
          <ButtonStyled onPress={(e) => handleSubmit(e)} style={{ backgroundColor: colors.primary }}>
            <Text style={{ color: "white" }}>Continue</Text>
          </ButtonStyled>

          <Text align="center" small>
            By signing up you agree to our Terms & Conditions and Provacy Policy
          </Text>
        </Terms>
      </Container>
    </TouchableWithoutFeedback>
  );
}

const ButtonStyled = styled.TouchableOpacity`
  padding: 15px;
  width: 80%;
  border-radius: 6px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const Container = styled.ScrollView`
  flex: 1;
  padding: 0px 40px;
`;

const Form = styled.View``;

const Row = styled.View`
  flex-direction: row;
`;

const CityField = styled.View`
  flex: 2;
  flex-direction: column;
  padding-right: 30px;
`;

const StateField = styled.View`
  flex: 1;
  flex-direction: column;
`;

const Terms = styled.View`
  margin: 30px 0;
  justify-content: center;
  align-items: center;
`;
