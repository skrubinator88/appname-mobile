import React, { useState } from "react";

import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Keyboard,
  ScrollView,
  Modal,
  Platform,
  SafeAreaView,
} from "react-native";

import { TextField } from "react-native-material-textfield";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// import CheckBox from "@react-native-community/checkbox";
import styled from "styled-components/native";

// Components
import Header from "../../../components/header";
import Text from "../../../components/text";

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

export default function SignUpContractorScreen5({ navigation, onHandleCancel, onHandleSave, workModalVisible }) {
  const [employer_name, setEmployerName] = useState("");
  const [employer_phone_number, setEmployerPhoneNumber] = useState("");
  const [employer_address, setEmployerAddress] = useState("");
  const [supervisor_name, setSupervisorName] = useState("");
  const [supervisor_title, setSupervisorTitle] = useState("");
  const [position_title, setPositionTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  // Switch
  const [currentJobBoolean, setCurrentJobBoolean] = useState(false);

  // Date Obtained
  const [dateObtained, setDateObtained] = useState(new Date());
  const [show1, setShow1] = useState(false);
  const onChangeDateObtained = (event, selectedDate) => {
    const currentDate = selectedDate || dateObtained;
    setShow1(Platform.OS === "ios");
    setDateObtained(currentDate);
  };

  // Expiration Date
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [show2, setShow2] = useState(false);
  const onChangeExpirationDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateObtained;
    setShow2(Platform.OS === "ios");
    setExpirationDate(currentDate);
  };

  const commonInputProps = (setElementValue) => {
    return {
      onFocus: () => {
        setShow1(false);
        setShow2(false);
      },
      onChangeText: (text) => {
        setElementValue(text);
      },
    };
  };

  const toggleSwitch = () => {
    setCurrentJobBoolean((previousState) => !previousState);
    Keyboard.dismiss();
    setShow1(false);
    setShow2(false);
  };

  const checkFormPayload = () => {
    const form = {};
  };

  function showBackgroundStyle() {}

  return (
    <Modal
      animationType="none"
      transparent={false}
      presentationStyle={{ backgroundColor: "red" }}
      visible={workModalVisible}
      statusBarTranslucent={false}
      onRequestClose={() => {
        setShow1(false);
        setShow2(false);
      }}
    >
      <ModalBackground>
        <Filter style={{ opacity: show1 || show2 ? 0.5 : 1 }}>
          <Header
            backAction={() => onHandleCancel()}
            backTitle="Cancel"
            title="Add Work"
            nextTitle="Save"
            nextColor="#548ff7"
            nextAction={() => onHandleSave(checkFormPayload())}
          />

          <KeyboardAvoidingView enabled behavior="height" style={{ flex: 1 }}>
            <ScrollView>
              <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onPress={() => {
                  Keyboard.dismiss();
                  setShow1(false);
                  setShow2(false);
                }}
              >
                <Container>
                  <Fields>
                    <TextField label="Employer Name" {...commonInputProps(setEmployerName)} />

                    <TextField label="Phone Number" keyboardType="phone-pad" {...commonInputProps(setEmployerPhoneNumber)} />

                    <TextField
                      {...commonInputProps}
                      labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
                      contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                      label="Address"
                      renderLeftAccessory={() => (
                        <View style={{ width: 30 }}>
                          <Ionicons name="ios-search" size={24} />
                        </View>
                      )}
                    />
                  </Fields>
                  <View style={{ backgroundColor: "#F2F2F2", height: 50 }}></View>

                  <FieldsTwo>
                    <TextField label="Supervisor Name" {...commonInputProps(setSupervisorName)} />

                    <TextField label="Supervisor Title" {...commonInputProps(setSupervisorTitle)} />
                    <TextField label="Position Title" {...commonInputProps(setPositionTitle)} />
                    <TextField label="Salary" {...commonInputProps(setSalary)} />
                    <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>DATE STARTED</Text>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setShow1(true);
                        setShow2(false);
                        Keyboard.dismiss();
                      }}
                    >
                      <DatePicker>
                        <Text>{dateObtained && formatDate(dateObtained)}</Text>
                        <AntDesign name="calendar" size={24} />
                      </DatePicker>
                    </TouchableWithoutFeedback>

                    <SwitchContainer>
                      <Text small>I am currently working here</Text>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={currentJobBoolean ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={currentJobBoolean}
                      />
                    </SwitchContainer>

                    <TouchableWithoutFeedback
                      onPress={() => {
                        setShow1(false);
                        setShow2(true);
                        Keyboard.dismiss();
                      }}
                    >
                      <DatePicker>
                        <Text>{expirationDate && formatDate(expirationDate)}</Text>
                        <AntDesign name="calendar" size={24} />
                      </DatePicker>
                    </TouchableWithoutFeedback>

                    <SafeAreaView>
                      <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>BRIEF DESCRIPTION OF TASKS</Text>
                      <TextInput
                        maxLength={512}
                        {...commonInputProps(setDescription)}
                        multiline={true}
                        scrollEnabled={false}
                        style={{
                          borderWidth: 1,
                          borderRadius: 10,
                          marginTop: 10,
                          marginBottom: 40,
                          padding: 10,
                          minHeight: 100,
                        }}
                      />
                    </SafeAreaView>
                  </FieldsTwo>
                </Container>
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>
        </Filter>
      </ModalBackground>

      {show1 && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateObtained}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDateObtained}
        />
      )}
      {show2 && (
        <DateTimePicker
          testID="dateTimePicker"
          value={expirationDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeExpirationDate}
        />
      )}
    </Modal>
  );
}

const Filter = styled.View`
  background: white;
  opacity: 0;
  flex: 1;
`;

const ModalBackground = styled.View`
  background: grey;
  flex: 1;
`;

const DateTimePickerBackground = styled.View`
  background: grey;
  flex: 1;
  z-index: 1;
  opacity: 0.5;
`;

const DatePicker = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border-width: 1px;
  padding: 8px 12px;
`;

const Fields = styled.View`
  margin: 0 20px 20px 20px;
`;

const FieldsTwo = styled.View`
  margin: 0 20px;
`;

const Switch = styled.Switch``;

const SwitchContainer = styled.View`
  margin: 10px 0 40px 0;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Container = styled.View`
  flex: 1;
`;
