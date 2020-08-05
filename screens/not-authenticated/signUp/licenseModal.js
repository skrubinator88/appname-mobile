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

import { TextField } from "react-native-material-textfield";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// import CheckBox from "@react-native-community/checkbox";
import styled from "styled-components/native";

// Components
import Header from "../../../components/header";
import Text from "../../../components/text";

import { RegistrationContext } from "../../../components/context";

const month_names = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(date) {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month_names[month]} ${day}, ${year} - ${date.toLocaleDateString()}`;
}

export default function licenseModal({ navigation, onHandleCancel, onHandleSave, licenseModalVisible, state }) {
  const { registrationState, methods } = useContext(RegistrationContext);

  const [type_school, setTypeSchool] = useState("High School");
  const [institute_name, setInstituteName] = useState("");
  const [degree_area, setDegreeArea] = useState("");
  const [years_attended, setYearsAttended] = useState("");

  // Switch
  const [graduated, setGraduated] = useState(false);

  // Date Obtained
  const [date_started, setDateStarted] = useState(new Date());
  const [show1, setShow1] = useState(false);
  const onChangeDateObtained = (event, selectedDate) => {
    const currentDate = selectedDate || date_started;
    setShow1(Platform.OS === "ios");
    setDateStarted(currentDate);
  };

  // Expiration Date
  const [date_ended, setDateEnded] = useState(new Date());
  const [show2, setShow2] = useState(false);
  const onChangeExpirationDate = (event, selectedDate) => {
    const currentDate = selectedDate || date_started;
    setShow2(Platform.OS === "ios");
    setDateEnded(currentDate);
  };

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
    <Modal coverScreen={false} isVisible={licenseModalVisible} onModalHide={() => clear()}>
      <KeyboardAvoidingView enabled behavior={Platform.OS == "android" ? "height" : "padding"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <Container>
            <ScrollView>
              <Fields>
                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>LICENSE NUMBER</Text>
                <TextField label="License Number" {...commonInputProps(state.institute_name || institute_name, setInstituteName)} />

                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>DATE STARTED</Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setShow1(true);
                    setShow2(false);
                    Keyboard.dismiss();
                  }}
                >
                  <DatePicker>
                    <Text>{date_started && formatDate(date_started)}</Text>
                    <AntDesign name="calendar" size={24} />
                  </DatePicker>
                </TouchableWithoutFeedback>

                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>DATE ENDED</Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setShow1(false);
                    setShow2(true);
                    Keyboard.dismiss();
                  }}
                >
                  <DatePicker>
                    <Text>{date_ended && formatDate(date_ended)}</Text>
                    <AntDesign name="calendar" size={24} />
                  </DatePicker>
                </TouchableWithoutFeedback>

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
        {show1 && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date_started}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeDateObtained}
          />
        )}
        {show2 && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date_ended}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChangeExpirationDate}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;

const Buttons = styled.View`
  margin: 30px 0 0 0;
  flex-direction: row;
  align-content: center;
  text-align: center;
  justify-content: space-around;
`;

const DatePicker = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border-width: 1px;
  padding: 8px 12px;
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
