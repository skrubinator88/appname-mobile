import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import Header from "../../../../components/header";
import Text from "../../../../components/text";
import LicenseModal from "./licenseModal";

import { MaterialIcons } from "@expo/vector-icons";

export default function SignUpContractorScreen6({ navigation }) {
  const { colors } = useTheme();
  const [licenseModalVisible, setLicenseModalVisible] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Header navigation={navigation} backTitle="" nextTitle="Skip" nextColor="grey" nextAction={() => {}} />

        <LicenseModal
          licenseModalVisible={licenseModalVisible}
          onCancel={() => setLicenseModalVisible(false)}
          onSave={() => setLicenseModalVisible(false)}
        />

        <ScrollView>
          <Container>
            <Text align="center" title bold>
              Skills & Licenses
            </Text>
            <Text align="center" medium>
              We ask for this to enhance your experience with finding work that matches your abilities and permit
            </Text>

            <WorkHistorySection>
              <Text small>SKILLS</Text>
              <AddButton
                onPress={() => {
                  navigation.navigate("AddSkills");
                }}
              >
                <Text small color="grey">
                  Add a skill
                </Text>
                <MaterialIcons backgroundColor="white" color={colors.primary} name="add-circle" size={30} />
              </AddButton>
            </WorkHistorySection>

            <WorkHistorySection>
              <Text small>LICENSES</Text>
              <AddButton
                onPress={() => {
                  setLicenseModalVisible(true);
                }}
              >
                <Text small color="grey">
                  Add a license
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
  padding: 0 40px 30px 40px;
`;
