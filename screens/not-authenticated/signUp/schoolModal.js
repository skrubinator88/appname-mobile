import React, { useState, useContext, useEffect } from "react";

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Keyboard,
  ScrollView,
  Platform,
  SafeAreaView,
  Picker,
  Switch,
} from "react-native";

import Modal from "react-native-modal";

import { TextField } from "@ubaids/react-native-material-textfield";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// import CheckBox from "@react-native-community/checkbox";
import styled from "styled-components/native";

// Components
import Header from "../../../components/header";
import Text from "../../../components/text";

import { RegistrationContext } from "../../../components/context";

export default function schoolModal({ navigation, onHandleCancel, onHandleSave, educationalBackgroundModalVisible, state }) {
  const { registrationState, methods } = useContext(RegistrationContext);

  const [type_school, setTypeSchool] = useState("High School");
  const [institute_name, setInstituteName] = useState("");
  const [degree_area, setDegreeArea] = useState("");
  const [years_attended, setYearsAttended] = useState("");

  // Switch
  const [graduated, setGraduated] = useState(false);

  const commonInputProps = (elementValue, setElementValue) => {
    return {
      onChangeText: (text) => {
        setElementValue(text);
      },
      value: elementValue,
    };
  };

  const toggleSwitch = () => {
    setGraduated((previousState) => !previousState);
    Keyboard.dismiss();
  };

  const checkFormPayload = () => {
    const form = {
      id: state.edit ? state.id : registrationState.educational_background.length,
      type_school,
      institute_name,
      degree_area,
      years_attended,
      graduated,
    };
    return form;
  };

  useEffect(() => {
    setTypeSchool(state.type_school || "High School");
    setInstituteName(state.institute_name);
    setDegreeArea(state.degree_area);
    setYearsAttended(state.years_attended);
    setGraduated(state.graduated);
  }, [state]);

  function clear() {
    setTypeSchool("High School");
    setInstituteName("");
    setDegreeArea("");
    setYearsAttended("");
    setGraduated(false);
  }

  return (
    <Modal coverScreen={false} isVisible={educationalBackgroundModalVisible} onModalHide={() => clear()}>
      <KeyboardAvoidingView enabled behavior={Platform.OS == "android" ? "height" : "padding"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <Container>
            <ScrollView>
              <Fields>
                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>TYPE OF SCHOOL</Text>
                <Row>
                  <TouchableWithoutFeedback onPress={() => setTypeSchool("High School")}>
                    <Text style={{ fontWeight: "bold", color: type_school == "High School" ? "black" : "grey", marginTop: 20 }}>
                      HIGH SCHOOL
                    </Text>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={() => setTypeSchool("College")}>
                    <Text style={{ fontWeight: "bold", color: type_school == "College" ? "black" : "grey", marginTop: 20 }}>COLLEGE</Text>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={() => setTypeSchool("Other")}>
                    <Text style={{ fontWeight: "bold", color: type_school == "Other" ? "black" : "grey", marginTop: 20 }}>OTHER</Text>
                  </TouchableWithoutFeedback>
                </Row>

                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>UNIVERSITY/INSTITUTE NAME</Text>
                <TextField label="Institute Name" {...commonInputProps(state.institute_name || institute_name, setInstituteName)} />

                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>DEGREE/AREA OF STUDY</Text>
                <TextField label="Title" {...commonInputProps(state.degree_area || degree_area, setDegreeArea)} />

                <WageInput>
                  <SalaryField>
                    <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>NUMBER OF YEARS ATTENDED</Text>
                  </SalaryField>
                  <WageTimeField>
                    <TextField label="Years" {...commonInputProps(state.years_attended || years_attended, setYearsAttended)} />
                  </WageTimeField>
                </WageInput>

                <SwitchContainer>
                  <Text small>I graduated from here</Text>
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={graduated ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={graduated}
                  />
                </SwitchContainer>

                <Buttons>
                  <Text medium bold onPress={() => onHandleCancel()}>
                    Cancel
                  </Text>

                  <Text medium bold color="#1c55ef" onPress={() => onHandleSave(checkFormPayload())}>
                    Save
                  </Text>
                </Buttons>
              </Fields>
            </ScrollView>
          </Container>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const Buttons = styled.View`
  flex-direction: row;
  align-content: center;
  text-align: center;
  justify-content: space-around;
`;

const SwitchContainer = styled.View`
  margin: 10px 0 40px 0;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const WageInput = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const SalaryField = styled.View`
  flex: 3;
  flex-direction: column;
  padding-right: 50px;
`;

const WageTimeField = styled.View`
  flex: 1;
  flex-direction: column;
  overflow: hidden;
`;

const Fields = styled.View`
  margin: 0 20px 20px 20px;
`;

const Container = styled.View`
  /* flex: 1; */
  background: white;
`;
