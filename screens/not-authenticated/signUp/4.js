import React, { useContext, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, BackHandler } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import Header from "../../../components/header";
import Text from "../../../components/text";
import { TextField } from "@ubaids/react-native-material-textfield";

import { RegistrationContext } from "../../../components/context";

export default function SignUp4({ navigation }) {
  const { colors } = useTheme();
  const { registrationState, methods } = useContext(RegistrationContext);
  const { updateForm, sendForm } = methods;
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

  const [first_name, setFirsName] = useState("");
  const [last_name, setLastName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");

  const [first_nameErrorMessage, setFirst_NameErrorMessage] = useState("");
  const [last_nameErrorMessage, setLast_NameErrorMessage] = useState("");
  const [occupationErrorMessage, setOccupationErrorMessage] = useState("");
  const [cityErrorMessage, setCityErrorMessage] = useState("");
  const [stateErrorMessage, setStateErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  function isFormValid() {
    const REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (first_name.length <= 2) {
      setFirst_NameErrorMessage("This field is required");
      return false;
    } else {
      setFirst_NameErrorMessage("");
    }
    if (last_name.length <= 1) {
      setLast_NameErrorMessage("This field is required");
      return false;
    } else {
      setLast_NameErrorMessage("");
    }
    if (occupation.length == 0) {
      setOccupationErrorMessage("This field is required");
      return false;
    } else {
      setOccupationErrorMessage("");
    }
    if (city.length == 0) {
      setCityErrorMessage("This field is required");
      return false;
    } else {
      setCityErrorMessage("");
    }
    if (state.length == 0) {
      setStateErrorMessage("This field is required");
      return false;
    } else {
      setStateErrorMessage("");
    }
    if (email.length <= 1) {
      setEmailErrorMessage("This field is required");
      return false;
    } else {
      setEmailErrorMessage("");
    }
    if (!email.match(REGEX)) {
      setEmailErrorMessage("This email is invalid");
      return false;
    } else {
      setEmailErrorMessage("");
    }

    return true;
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      let form = {
        first_name,
        last_name,
        occupation,
        city,
        state,
        email,
      };
      updateForm(form);
      navigation.navigate("SignUp5");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container>
        <Header navigation={navigation} backTitle=" " />
        <Text align="center" title>
          You're verified! Let's get started on your account
        </Text>

        <Form>
          <TextField
            error={first_nameErrorMessage}
            label="First Name"
            ref={(ref) => (firstNameRef = ref)}
            value={first_name}
            returnKeyType="next"
            onChangeText={(text) => setFirsName(text)}
            onSubmitEditing={() => onSubmitFirstName()}
          />
          <TextField
            error={last_nameErrorMessage}
            label="Last Name"
            value={last_name}
            ref={(ref) => (lastNameRef = ref)}
            returnKeyType="next"
            onChangeText={(text) => setLastName(text)}
            onSubmitEditing={() => onSubmitLastName()}
          />
          <TextField
            error={occupationErrorMessage}
            label="Occupation"
            value={occupation}
            ref={(ref) => (occupationRef = ref)}
            returnKeyType="next"
            onChangeText={(text) => setOccupation(text)}
            onSubmitEditing={() => onSubmitOccupation()}
          />
          <Row>
            <CityField>
              <TextField
                error={cityErrorMessage}
                label="City"
                value={city}
                ref={(ref) => (cityRef = ref)}
                returnKeyType="next"
                onChangeText={(text) => setCity(text)}
                onSubmitEditing={() => onSubmitCity()}
              />
            </CityField>
            <StateField>
              <TextField
                error={stateErrorMessage}
                label="State"
                value={state}
                ref={(ref) => (stateRef = ref)}
                returnKeyType="next"
                onChangeText={(text) => setState(text)}
                onSubmitEditing={() => onSubmitState()}
              />
            </StateField>
          </Row>
          <TextField
            error={emailErrorMessage}
            label="Email Address"
            value={email}
            ref={(ref) => (emailRef = ref)}
            returnKeyType="done"
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => handleSubmit()}
          />
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
  background: white;
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
