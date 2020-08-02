import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import Header from "../../../components/header";
import Text from "../../../components/text";
import SchoolModal from "./schoolModal";
import WorkModal from "./workModal";

import { MaterialIcons } from "@expo/vector-icons";

export default function ({ navigation }) {
  const { colors } = useTheme();
  const [schoolModalVisible, setSchoolModalVisible] = useState(false);
  const [workModalVisible, setWorkModalVisible] = useState(false);
  const handleSubmit = () => {
    navigation.navigate("SignUpContractor6");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Header
          navigation={navigation}
          backTitle=""
          nextTitle="Skip"
          nextColor="grey"
          nextAction={() => {
            navigation.navigate("SignUpContractor6");
          }}
        />

        <SchoolModal
          schoolModalVisible={schoolModalVisible}
          onHandleCancel={() => {
            setSchoolModalVisible(false);
          }}
          onHandleSave={() => {
            setSchoolModalVisible(false);
          }}
        />

        <WorkModal
          navigation={navigation}
          workModalVisible={workModalVisible}
          onHandleCancel={() => {
            setWorkModalVisible(false);
          }}
          onHandleSave={() => {
            setWorkModalVisible(false);
          }}
        />

        <ScrollView>
          <Container>
            <Text align="center" title>
              Provide your work and educational history
            </Text>

            <WorkHistorySection>
              <Text small>WORK HISTORY</Text>
              <AddButton
                onPress={() => {
                  setWorkModalVisible(true);
                }}
              >
                <Text small color="grey">
                  Add a job
                </Text>
                <MaterialIcons backgroundColor="white" color={colors.primary} name="add-circle" size={30} />
              </AddButton>
            </WorkHistorySection>

            <WorkHistorySection>
              <Text small>EDUCATIONAL BACKGROUND</Text>
              <AddButton
                onPress={() => {
                  setSchoolModalVisible(true);
                }}
              >
                <Text small color="grey">
                  Add a university/institute
                </Text>
                <MaterialIcons backgroundColor="white" color={colors.primary} name="add-circle" size={30} />
              </AddButton>
            </WorkHistorySection>

            <ButtonStyled onPress={(e) => handleSubmit(e)} style={{ backgroundColor: colors.primary }}>
              <Text style={{ color: "white" }}>Continue</Text>
            </ButtonStyled>
          </Container>
        </ScrollView>
      </>
    </TouchableWithoutFeedback>
  );
}

const WorkHistorySection = styled.View`
  /* height: 250px; */
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
  padding: 0 40px 30px 40px;
`;
