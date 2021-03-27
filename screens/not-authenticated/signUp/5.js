import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import styled from "styled-components/native";
import { useTheme } from "@react-navigation/native";

import Header from "../../../components/header";
import Text from "../../../components/text";
import SchoolModal from "./schoolModal";
import WorkModal from "./workModal";

import { MaterialIcons, Entypo, Foundation } from "@expo/vector-icons";
import { RegistrationContext } from "../../../components/context";

export default function ({ navigation }) {
  // State
  const { colors } = useTheme();
  const [educationalBackgroundModalVisible, setEducationalBackgroundModalVisible] = useState(false);
  const [educationalBackgroundModalState, setEducationalBackgroundModalState] = useState({});
  const [educational_background_items, setEducationalBackgroundItems] = useState([]);

  const [workModalVisible, setWorkModalVisible] = useState(false);
  const [workModalState, setWorkModalState] = useState({});
  const [work_history_items, setWorkHistoryItems] = useState([]);

  const { registrationState, methods } = useContext(RegistrationContext);
  const { addItemInField, updateItemFromField, deleteItemFromField } = methods;

  // Lifecycle
  useEffect(() => {
    if (registrationState.work_history.length != 0) {
      setWorkHistoryItems(registrationState.work_history);
    }
    if (registrationState.educational_background.length != 0) {
      setEducationalBackgroundItems(registrationState.educational_background);
    }
  }, [registrationState]);

  // Functions
  const deleteItem = useCallback(
    (field, index) =>
      Alert.alert("Delete this item", "Are you sure you want to delete this item from this list?", [
        { text: "Cancel", type: "cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteItemFromField(field, index) },
      ]),
    [work_history_items, educational_background_items]
  );

  const handleSubmit = () => {
    navigation.navigate("SignUp6");
  };

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
          onHandleSave={(item, { isEdited, index }) => {
            setWorkModalState({});
            setWorkModalVisible(false);
            if (isEdited) {
              updateItemFromField("work_history", index, item);
            } else {
              addItemInField(item, "work_history");
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
          onHandleSave={(item, { isEdited, index }) => {
            setEducationalBackgroundModalState({});
            setEducationalBackgroundModalVisible(false);
            if (isEdited) {
              updateItemFromField("educational_background", index, item);
            } else {
              addItemInField(item, "educational_background");
            }
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
                setWorkModalState({ edit: false });
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
                  setWorkModalState({ ...item, edit: true, index });
                  setWorkModalVisible(true);
                }}
              >
                <WorkHistoryItem>
                  <WorkHistoryItemDetail>
                    <Row>
                      <Text small bold>
                        {item.employer_name} {item.user_position_title && `- ${item.user_position_title}`}
                      </Text>
                    </Row>
                    {item.employer_address && (
                      <Row>
                        <Text small>{item.employer_address}</Text>
                      </Row>
                    )}
                    {item.supervisor_name && (
                      <Row>
                        <Text small>
                          {item.supervisor_name &&
                            `Supervisor: ${item.supervisor_name} ${item.supervisor_title ? "- " + item.supervisor_title : ""}`}
                        </Text>
                      </Row>
                    )}
                  </WorkHistoryItemDetail>
                  <SelectionItem style={{ flexDirection: "row-reverse" }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setWorkModalState({ ...item, edit: true, index });
                        setWorkModalVisible(true);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 3,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: colors.primary,
                          padding: 10,
                          borderBottomRightRadius: 10,
                        }}
                      >
                        <Entypo color="black" name="pencil" size={25} color="white" />
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => deleteItem("work_history", index)}>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ea3c2c",
                          padding: 10,
                          borderBottomLeftRadius: 10,
                        }}
                      >
                        <Entypo color="black" name="cross" size={25} color="white" />
                      </View>
                    </TouchableWithoutFeedback>
                  </SelectionItem>
                </WorkHistoryItem>
              </TouchableWithoutFeedback>
            ))}
          </WorkHistorySection>

          <WorkHistorySection>
            <Text small>EDUCATIONAL BACKGROUND</Text>
            <AddButton
              onPress={() => {
                setWorkModalState({ edit: false });
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
                  setEducationalBackgroundModalState({ ...item, edit: true, index });
                  setEducationalBackgroundModalVisible(true);
                }}
              >
                <WorkHistoryItem>
                  <WorkHistoryItemDetail>
                    <Row>
                      <Text small bold>
                        {item.institute_name}
                      </Text>
                    </Row>
                    {item.type_school && (
                      <Row>
                        <Text small>
                          {item.type_school} {item.degree_area && "- " + item.degree_area}
                        </Text>
                      </Row>
                    )}
                    {item.years_attended && (
                      <Row>
                        <Text small>{item.years_attended} year/s attended</Text>
                      </Row>
                    )}
                  </WorkHistoryItemDetail>
                  <SelectionItem style={{ flexDirection: "row-reverse" }}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setEducationalBackgroundModalState({ ...item, edit: true, index });
                        setEducationalBackgroundModalVisible(true);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 3,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: colors.primary,
                          padding: 10,
                          borderBottomRightRadius: 10,
                        }}
                      >
                        <Entypo color="black" name="pencil" size={25} color="white" />
                      </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => deleteItem("educational_background", index)}>
                      <View
                        style={{
                          flexDirection: "row",
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#ea3c2c",
                          padding: 10,
                          borderBottomLeftRadius: 10,
                        }}
                      >
                        <Entypo color="black" name="cross" size={25} color="white" />
                      </View>
                    </TouchableWithoutFeedback>
                  </SelectionItem>
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
  /* padding: 10px; */
  background: #ececec;
  margin: 10px 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const WorkHistoryItemDetail = styled.View`
  flex: 3;
  margin: 10px;
`;

const SelectionItem = styled.View`
  flex: 1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
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
