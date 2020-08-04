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

import { RegistrationContext } from "../../../components/context";
import { set } from "react-native-reanimated";

export default function SignUpContractorScreen5({ navigation, onHandleCancel, onHandleSave, workModalVisible, state }) {
  const { registrationState, methods } = useContext(RegistrationContext);

  const [employer_name, setEmployerName] = useState("");
  const [employer_phone_number, setEmployerPhoneNumber] = useState("");
  const [employer_address, setEmployerAddress] = useState("");
  const [supervisor_name, setSupervisorName] = useState("");
  const [supervisor_title, setSupervisorTitle] = useState("");
  const [user_position_title, setPositionTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [wage, setWage] = useState("hr");
  const [description, setDescription] = useState("");

  // Switch
  const [actual_job, setActualJob] = useState(false);

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
      onFocus: () => {
        setShow1(false);
        setShow2(false);
      },
      onChangeText: (text) => {
        setElementValue(text);
      },
      value: elementValue,
    };
  };

  const toggleSwitch = () => {
    setActualJob((previousState) => !previousState);
    Keyboard.dismiss();
    setShow1(false);
    setShow2(false);
  };

  const checkFormPayload = () => {
    const form = {
      id: state.edit ? state.id : registrationState.work_history.length,
      employer_name,
      employer_phone_number,
      employer_address,
      supervisor_name,
      supervisor_title,
      user_position_title,
      date_started,
      date_ended,
      actual_job,
      salary,
      wage,
      description,
    };
    return form;
  };

  useEffect(() => {
    setEmployerName(state.employer_name);
    setEmployerPhoneNumber(state.employer_phone_number);
    setEmployerAddress(state.employer_address);
    setSupervisorName(state.supervisor_name);
    setSupervisorTitle(state.supervisor_title);
    setPositionTitle(state.user_position_title);
    setSalary(state.salary);
    setWage(state.wage);
    setDescription(state.description || description);

    setActualJob(state.actual_job);
    setDateStarted(state.date_started || date_started);
    setDateEnded(state.date_ended || date_ended);
  }, [state]);

  function clear() {
    setEmployerName("");
    setEmployerPhoneNumber("");
    setEmployerAddress("");
    setSupervisorName("");
    setSupervisorTitle("");
    setPositionTitle("");
    setDateStarted(new Date());
    setDateEnded(new Date());
    setActualJob(false);
    setSalary("");
    setWage("hr");
    setDescription("");
  }

  return (
    <Modal coverScreen={false} isVisible={workModalVisible} onModalHide={() => clear()}>
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
                    <TextField label="Employer Name" {...commonInputProps(state.employer_name || employer_name, setEmployerName)} />

                    <TextField
                      label="Phone Number"
                      keyboardType="phone-pad"
                      {...commonInputProps(state.employer_phone_number || employer_phone_number, setEmployerPhoneNumber)}
                    />

                    <TextField
                      {...commonInputProps(state.employer_address || state.employer_address, setEmployerAddress)}
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
                    <TextField label="Supervisor Name" {...commonInputProps(state.supervisor_name || supervisor_name, setSupervisorName)} />

                    <TextField
                      label="Supervisor Title"
                      {...commonInputProps(state.supervisor_title || supervisor_title, setSupervisorTitle)}
                    />
                    <TextField
                      label="Your Position Title"
                      {...commonInputProps(state.user_position_title || user_position_title, setPositionTitle)}
                    />

                    <WageInput>
                      <SalaryField>
                        <TextField label="Salary" keyboardType="numeric" {...commonInputProps(state.salary || salary, setSalary)} />
                      </SalaryField>
                      <WageTimeField>
                        <WageTimeFieldInput selectedValue={wage} onValueChange={(value) => setWage(value)}>
                          <WageTimeFieldInput.Item label="/Year" value="yr" />
                          <WageTimeFieldInput.Item label="/Hour" value="hr" />
                        </WageTimeFieldInput>
                      </WageTimeField>
                    </WageInput>

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

                    <SwitchContainer>
                      <Text small>I am currently working here</Text>
                      <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={actual_job ? "#f4f3f4" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={actual_job}
                      />
                    </SwitchContainer>

                    {!actual_job && (
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
                    )}

                    <SafeAreaView>
                      <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>BRIEF DESCRIPTION OF TASKS</Text>
                      <TextInput
                        maxLength={512}
                        {...commonInputProps(description, setDescription)}
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
    </Modal>
  );
}

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
  flex: 2;
  flex-direction: column;
  overflow: hidden;
`;

const WageTimeFieldInput = styled.Picker`
  margin: ${Platform.OS == "ios" ? "-60px 0" : "0px"};
`;

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
