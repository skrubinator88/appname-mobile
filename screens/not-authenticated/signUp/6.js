import React, { useState, useContext, useEffect } from "react";
import { View, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import Header from "../../../components/header";
import Text from "../../../components/text";
import SchoolModal from "./schoolModal";
import LicenseModal from "./licenseModal";

import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { RegistrationContext } from "../../../components/context";

export default function signUp6({ navigation }) {
  const { colors } = useTheme();
  const [licenseModalVisible, setLicenseModalVisible] = useState(false);
  const [licenseModalState, setLicenseModalState] = useState({});
  const [licenses_items, setLicenseItems] = useState([]);

  // const [workModalVisible, setWorkModalVisible] = useState(false);
  // const [workModalState, setWorkModalState] = useState({});
  // const [work_history_items, setWorkHistoryItems] = useState([]);

  const { registrationState, methods } = useContext(RegistrationContext);
  const { pushItemFormField } = methods;

  const handleSubmit = () => {
    navigation.navigate("SignUp7");
  };

  useEffect(() => {
    // if (registrationState.work_history.length != 0) {
    //   setWorkHistoryItems(registrationState.work_history);
    // }
    if (registrationState.licenses.length != 0) {
      setLicenseItems(registrationState.licenses);
    }
  }, [registrationState]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Header
          navigation={navigation}
          backTitle=""
          headerBackground="white"
          background="white"
          nextColor="grey"
          nextAction={() => {
            // navigation.navigate("SignUpContractor6");
          }}
        />

        <LicenseModal
          navigation={navigation}
          licenseModalVisible={licenseModalVisible}
          onHandleCancel={() => {
            setLicenseModalState({});
            setLicenseModalVisible(false);
          }}
          onHandleSave={(form) => {
            setLicenseModalState({});
            setLicenseModalVisible(false);
            pushItemFormField(form, "licenses");
          }}
          state={licenseModalState}
        />

        <Container>
          <Text align="center" title bold>
            Skills & licenses
          </Text>
          <Text align="center" medium>
            We ask for this to enhance your experience with finding work that matches your abilities and permit.
          </Text>

          {/* <WorkHistorySection>
            <Text small>SKILLS</Text>
            <AddButton
              onPress={() => {
                setWorkModalVisible(true);
              }}
            >
              <Text small color="grey">
                Add a skill
              </Text>
              <MaterialIcons color={colors.primary} name="add-circle" size={30} />
            </AddButton>

            {work_history_items.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  setWorkModalState({ ...item, edit: true });
                  setWorkModalVisible(true);
                }}
              >
                <WorkHistoryItem>
                  <Row>
                    <Text small>{item.employer_name}</Text>
                    <Entypo color="black" name="pencil" size={16} />
                  </Row>
                </WorkHistoryItem>
              </TouchableWithoutFeedback>
            ))}
          </WorkHistorySection> */}

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
              <MaterialIcons color={colors.primary} name="add-circle" size={30} />
            </AddButton>

            {licenses_items.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  setLicenseModalState({ ...item, edit: true });
                  setLicenseModalVisible(true);
                }}
              >
                <WorkHistoryItem>
                  <Row>
                    <Text small>License: {item.license_number}</Text>
                    <Entypo color="black" name="pencil" size={16} />
                  </Row>
                  <Row>
                    <Text small>Date Obtained: {item.date_obtained_string}</Text>
                  </Row>
                  <Row>
                    <Text small>Expires: {item.expiration_date_string}</Text>
                  </Row>
                </WorkHistoryItem>
              </TouchableWithoutFeedback>
            ))}
          </WorkHistorySection>

          <ButtonStyled onPress={(e) => handleSubmit(e)} style={{ backgroundColor: colors.primary }}>
            <Text style={{ color: "white" }}>Continue</Text>
          </ButtonStyled>
        </Container>
      </>
    </TouchableWithoutFeedback>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const WorkHistoryItem = styled.View`
  flex-direction: column;
  padding: 10px;
  background: #ececec;
  margin: 10px 0;
`;

const WorkHistorySection = styled.View`
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
  background: white;
  flex: 1;
  padding: 0 40px 30px 40px;
`;
