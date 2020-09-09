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
  Dimensions,
} from "react-native";

import Modal from "react-native-modal";

import { TextField } from "react-native-material-textfield";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// import CheckBox from "@react-native-community/checkbox";
import styled from "styled-components/native";

// Components
import Header from "../../../components/headerAndContainer";
import Text from "../../../components/text";

// Miscellaneous
const width = Dimensions.get("window").width;

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

import { TouchableOpacity } from "react-native-gesture-handler";

export default function workModal({ navigation, onHandleCancel, onHandleSave, listingItemVisible, route }) {
  const state = route.params;

  const [jobType, setJobType] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [task, setTask] = useState("");
  const [location, setLocation] = useState(""); // Google Places API
  const [salary, setSalary] = useState("");
  const [wage, setWage] = useState("hr");

  const [employer_phone_number, setEmployerPhoneNumber] = useState("");
  const [employer_address, setEmployerAddress] = useState("");
  const [supervisor_name, setSupervisorName] = useState("");
  const [supervisor_title, setSupervisorTitle] = useState("");
  const [user_position_title, setPositionTitle] = useState("");

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
    Keyboard.dismiss();
    setShow1(false);
    setShow2(false);
  };

  const checkFormPayload = () => {};
  //   const form = {
  //     id: state.edit ? state.id : registrationState.work_history.length,
  //     employer_phone_number,
  //     employer_address,
  //     supervisor_name,
  //     supervisor_title,
  //     user_position_title,
  //     date_started,
  //     date_ended,
  //     actual_job,
  //     salary,
  //     wage,
  //     task,
  //   };
  //   return form;
  // };

  // useEffect(() => {
  //   setEmployerPhoneNumber(state.employer_phone_number);
  //   setEmployerAddress(state.employer_address);
  //   setSupervisorName(state.supervisor_name);
  //   setSupervisorTitle(state.supervisor_title);
  //   setPositionTitle(state.user_position_title);
  //   setSalary(state.salary);
  //   setWage(state.wage);
  //   setTask(state.task || task);

  //   setDateStarted(state.date_started || date_started);
  //   setDateEnded(state.date_ended || date_ended);
  // }, [state]);

  function clear() {
    setEmployerName("");
    setEmployerPhoneNumber("");
    setEmployerAddress("");
    setSupervisorName("");
    setSupervisorTitle("");
    setPositionTitle("");
    setDateStarted(new Date());
    setDateEnded(new Date());
    setSalary("");
    setWage("hr");
    setTask("");
  }

  return (
    <>
      <Header
        navigation={navigation}
        backAction={() => onHandleCancel()}
        backTitle="Cancel"
        title="Add Work"
        nextTitle="Save"
        nextColor="#548ff7"
        nextAction={() => onHandleSave(checkFormPayload())}
      />

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
              <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>JOB TYPE</Text>
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

              <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>JOB TITLE</Text>
              <TextField
                label="Job Title"
                {...commonInputProps(state.employer_phone_number || employer_phone_number, setEmployerPhoneNumber)}
              />

              <SafeAreaView>
                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>TASKS</Text>
                <TextInput
                  maxLength={512}
                  {...commonInputProps(task, setTask)}
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

              <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>LOCATION ADDRESS</Text>
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

              <TouchableOpacity style={{ alignSelf: "center", width: width * 0.7 }}>
                <SaveButton style={{ justifyContent: "center", alignItems: "center" }}>
                  <Text bold color="white">
                    Save
                  </Text>
                </SaveButton>
              </TouchableOpacity>
            </Fields>
          </Container>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
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

const Fields = styled.View`
  margin: 0 20px 20px 20px;
`;

const Container = styled.View`
  flex: 1;
`;

const SaveButton = styled.View`
  padding: 10px;
  background: #255cf0;
  border-radius: 6px;
`;
