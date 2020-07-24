import React from "react";
import { View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TextInput, ScrollView } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import Header from "../components/header";
import Text from "../components/text";

import { MaterialIcons } from "@expo/vector-icons";

export default function SignUpContractorScreen4() {
  const { colors } = useTheme();
  const handleSubmit = () => {
    // navigation.navigate("root");
    console.log("yes");
  }; // Send to store

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView>
        <Header navigation={true} backTitle="" nextTitle="Skip" nextColor="grey" nextAction={() => {}} />
        <Container>
          <Text align="center" title>
            Provide your work and educational history
          </Text>

          <WorkHistorySection>
            <Text small>WORK HISTORY</Text>
            <AddButton>
              <Text small> Add a job</Text>
              <MaterialIcons backgroundColor="white" color={colors.primary} name="add-circle" size={30} />
            </AddButton>
          </WorkHistorySection>

          <WorkHistorySection>
            <Text small>WORK HISTORY</Text>
            <AddButton>
              <Text small> Add a job</Text>
              <MaterialIcons backgroundColor="white" color={colors.primary} name="add-circle" size={30} />
            </AddButton>
          </WorkHistorySection>

          <ButtonStyled onPress={(e) => handleSubmit(e)} style={{ backgroundColor: colors.primary }}>
            <Text style={{ color: "white" }}>Continue</Text>
          </ButtonStyled>
        </Container>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const WorkHistorySection = styled.View`
  height: 250px;
  margin: 20px 0;
`;

const AddButton = styled.TouchableOpacity`
  flex-direction: row;
  border: 1px solid black;
  border-radius: 4px;
  padding: 7px;
  justify-content: space-between;
  align-items: center;
`;

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
