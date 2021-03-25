import React, { useState, useContext, useEffect } from "react";
import { View, TouchableWithoutFeedback, Keyboard, ScrollView, BackHandler } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import Header from "../../../components/header";
import Text from "../../../components/text";
import SchoolModal from "./schoolModal";
import WorkModal from "./workModal";

import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { RegistrationContext } from "../../../components/context";

export default function ({ navigation }) {
  const { colors } = useTheme();
  const [educationalBackgroundModalVisible, setEducationalBackgroundModalVisible] = useState(false);
  const [educationalBackgroundModalState, setEducationalBackgroundModalState] = useState({});
  const [educational_background_items, setEducationalBackgroundItems] = useState([]);

  const [workModalVisible, setWorkModalVisible] = useState(false);
  const [workModalState, setWorkModalState] = useState({});
  const [work_history_items, setWorkHistoryItems] = useState([]);

  const { registrationState, methods } = useContext(RegistrationContext);
  const { pushItemFormField } = methods;

  const handleSubmit = () => {
    navigation.navigate("SignUp6");
  };

  useEffect(() => {
    if (registrationState.work_history.length != 0) {
      setWorkHistoryItems(registrationState.work_history);
    }
    if (registrationState.educational_background.length != 0) {
      setEducationalBackgroundItems(registrationState.educational_background);
    }
  }, [registrationState]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Header
          navigation={navigation}
          backTitle=""
          nextTitle="Skip"
          nextColor="grey"
          headerBackground="white"
          background="white"
          nextAction={() => {
            navigation.navigate("SignUp6");
          }}
        />

        <WorkModal
          navigation={navigation}
          workModalVisible={workModalVisible}
          onHandleCancel={() => {
            setWorkModalState({});
            setWorkModalVisible(false);
          }}
          // onHandleSave={(form) => {
          //   setWorkModalState({});
          //   setWorkModalVisible(false);
          //   pushItemFormField(form, "work_history");
          // }}

          onHandleSave={(form, { isEdited, index }) => {
            setWorkModalState({});
            setWorkModalVisible(false);
            if (isEdited) {
              updateItemFromLicenses(index, form);
            } else {
              pushItemFormField(form, "licenses");
            }
          }}
          state={workModalState}
        />

        <SchoolModal
          navigation={navigation}
          educationalBackgroundModalVisible={educationalBackgroundModalVisible}
          onHandleCancel={() => {
            setEducationalBackgroundModalState({});
            setEducationalBackgroundModalVisible(false);
          }}
          onHandleSave={(form) => {
            setEducationalBackgroundModalState({});
            setEducationalBackgroundModalVisible(false);
            pushItemFormField(form, "educational_background");
          }}
          state={educationalBackgroundModalState}
        />

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

                  <Row>
                    <Text>{item.user_position_title}</Text>
                    <Text>
                      {item.salary}/{item.wage}
                    </Text>
                  </Row>
                </WorkHistoryItem>
              </TouchableWithoutFeedback>
            ))}
          </WorkHistorySection>

          <WorkHistorySection>
            <Text small>EDUCATIONAL BACKGROUND</Text>
            <AddButton
              onPress={() => {
                setEducationalBackgroundModalVisible(true);
              }}
            >
              <Text small color="grey">
                Add a university/institute
              </Text>
              <MaterialIcons color={colors.primary} name="add-circle" size={30} />
            </AddButton>

            {educational_background_items.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  setEducationalBackgroundModalState({ ...item, edit: true });
                  setEducationalBackgroundModalVisible(true);
                }}
              >
                <WorkHistoryItem>
                  <Row>
                    <Text small>{item.institute_name}</Text>
                    <Entypo color="black" name="pencil" size={16} />
                  </Row>

                  <Row>
                    <Text>{item.degree_area}</Text>
                    <Text> </Text>
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
