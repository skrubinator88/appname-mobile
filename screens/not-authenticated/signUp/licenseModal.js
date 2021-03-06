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

// Platform Fixes
import { getStatusBarHeight } from "react-native-status-bar-height";
const statusBarHeight = getStatusBarHeight();

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
  return `${month_names[month]} ${day}, ${year}`;
}

export default function licenseModal({ navigation, onHandleCancel, onHandleSave, licenseModalVisible, state }) {
  const { registrationState, methods } = useContext(RegistrationContext);

  const [license_number, setLicenseNumber] = useState("");

  // Date Obtained
  const [date_obtained, setDateObtained] = useState(new Date());
  const [show1, setShow1] = useState(false);
  const onChangeDateObtained = (event, selectedDate) => {
    const currentDate = selectedDate || date_started;
    setShow1(Platform.OS === "ios");
    setDateObtained(currentDate);
  };

  // Expiration Date
  const [expiration_date, setExpirationDate] = useState(new Date());
  const [show2, setShow2] = useState(false);
  const onChangeExpirationDate = (event, selectedDate) => {
    const currentDate = selectedDate || date_started;
    setShow2(Platform.OS === "ios");
    setExpirationDate(currentDate);
  };

  const commonInputProps = (elementValue, setElementValue) => {
    return {
      onChangeText: (text) => {
        setElementValue(text);
      },
      value: elementValue,
    };
  };

  const checkFormPayload = () => {
    const date_obtained_string = formatDate(date_obtained);
    const expiration_date_string = formatDate(expiration_date);

    const form = {
      // id: state.edit ? state.id : registrationState.licenses.length,
      license_number,
      date_obtained,
      expiration_date,
      date_obtained_string,
      expiration_date_string,
    };
    return form;
  };

  useEffect(() => {
    setLicenseNumber(state.type_school || "");
    setDateObtained(state.date_obtained || date_obtained);
    setExpirationDate(state.expiration_date || expiration_date);
  }, [state]);

  function clear() {
    setLicenseNumber("");
    setDateObtained(new Date());
    setExpirationDate(new Date());
  }

  return (
    <Modal
      isVisible={licenseModalVisible}
      avoidKeyboard={Platform.OS == "ios" ? true : false}
      style={{
        marginTop: statusBarHeight,
        backgroundColor: Platform.OS == "ios" ? "transparent" : "white",
        borderRadius: 10,
        elevation: 10,
      }}
      // onModalWillShow={() => {
      //   setTasks(items || []);
      //   if (items?.length < 1) setEditing(true);
      // }}
      onModalHide={() => clear()}
      hideModalContentWhileAnimating={true}
      animationInTiming={500}
      animationOutTiming={500}
      backdropOpacity={0.2}
      backdropTransitionOutTiming={0}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      //
      // coverScreen={false}
    >
      {/* <KeyboardAvoidingView enabled behavior={Platform.OS == "android" ? "height" : "padding"} style={{ flex: 1 }}> */}
      {/* <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}> */}
      <Container
        style={{ backgroundColor: "white", borderRadius: 10, shadowRadius: 100, shadowColor: "black" }}
        keyboardShouldPersistTaps="always"
      >
        <ScrollView>
          <Fields>
            <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>LICENSE NUMBER</Text>
            <TextField label="License Number" {...commonInputProps(state.license_number || license_number, setLicenseNumber)} />

            <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>DATE STARTED</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                setShow1(true);
                setShow2(false);
                Keyboard.dismiss();
              }}
            >
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                {/* <DatePicker>
                <Text>{date_obtained && formatDate(date_obtained)}</Text>
                <AntDesign name="calendar" size={24} />
              </DatePicker> */}
                <AntDesign name="calendar" size={24} />
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date_obtained}
                  mode="date"
                  is24Hour={true}
                  onChange={onChangeDateObtained}
                  // collapsable={true}
                  display="default"
                  style={{ flex: 1, marginHorizontal: 10 }}
                />
              </View>
            </TouchableWithoutFeedback>

            <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>DATE ENDED</Text>
            <TouchableWithoutFeedback
              onPress={() => {
                setShow1(false);
                setShow2(true);
                Keyboard.dismiss();
              }}
            >
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                {/* <DatePicker>
                <Text>{expiration_date && formatDate(expiration_date)}</Text>
                <AntDesign name="calendar" size={24} />
              </DatePicker> */}
                <AntDesign name="calendar" size={24} />
                <DateTimePicker
                  testID="dateTimePicker"
                  value={expiration_date}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChangeExpirationDate}
                  style={{ flex: 1, marginHorizontal: 10 }}
                />
              </View>
            </TouchableWithoutFeedback>

            <Buttons>
              <TouchableWithoutFeedback onPress={() => onHandleCancel()}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text medium bold>
                    Cancel
                  </Text>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => onHandleSave(checkFormPayload(), { isEdited: state.edit, index: state.edit && state.index })}
              >
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text medium bold color="#1c55ef">
                    Save
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </Buttons>
          </Fields>
        </ScrollView>
      </Container>
      {/* </TouchableWithoutFeedback> */}
      {/* {show1 && (
      )} */}
      {/* {show2 && (
      )} */}
      {/* // </KeyboardAvoidingView> */}
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
