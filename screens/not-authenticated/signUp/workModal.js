import React, { useState, useContext, useEffect, useCallback } from "react";

// Components
import { TouchableWithoutFeedback, TextInput, View, Keyboard, ScrollView, Platform, SafeAreaView } from "react-native";
import Modal from "react-native-modal";
import { TextField } from "@ubaids/react-native-material-textfield";
import { AntDesign, MaterialIcons, Foundation } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

// Platform Fixes
import { getStatusBarHeight } from "react-native-status-bar-height";

// Styling
// import CheckBox from "@react-native-community/checkbox";
import styled from "styled-components/native";

// Local Components
import Header from "../../../components/header";
import Text from "../../../components/text";

// Context
import { RegistrationContext } from "../../../components/context";

export default function workModal({ navigation, onHandleCancel, onHandleSave, workModalVisible, state }) {
  const statusBarHeight = getStatusBarHeight();
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
  // Date Obtained
  const [date_started, setDateStarted] = useState(new Date());
  const [show1, setShow1] = useState(false);
  // Expiration Date
  const [date_ended, setDateEnded] = useState(new Date());
  const [show2, setShow2] = useState(false);
  // Switch
  const [actual_job, setActualJob] = useState(false);

  const [month_names, setMonthNames] = useState([
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
  ]);

  // Functions
  const onChangeDateObtained = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date_started;
      setShow1(Platform.OS === "ios");
      setDateStarted(currentDate);
    },
    [date_started]
  );

  const onChangeExpirationDate = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date_started;
      setShow2(Platform.OS === "ios");
      setDateEnded(currentDate);
    },
    [date_ended]
  );

  const commonInputProps = useCallback(
    (elementValue, setElementValue) => {
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
    },
    [show1, show2]
  );

  const toggleSwitch = useCallback(() => {
    setActualJob((previousState) => !previousState);
    Keyboard.dismiss();
    setShow1(false);
    setShow2(false);
  }, [show1, show2]);

  const checkFormPayload = useCallback(() => {
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
  }, [
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
  ]);

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

  const clear = useCallback(() => {
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
  }, [
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
  ]);

  return (
    <Modal
      isVisible={workModalVisible}
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
      <View
        style={{ backgroundColor: "white", borderRadius: 10, shadowRadius: 100, shadowColor: "black" }}
        keyboardShouldPersistTaps="always"
      >
        <Header
          backAction={() => onHandleCancel()}
          backTitle="Cancel"
          title="Add Work"
          nextTitle="Save"
          nextColor="#548ff7"
          nextAction={() => onHandleSave(checkFormPayload())}
        />

        {/* <KeyboardAvoidingView enabled behavior={Platform.OS == "android" ? "height" : "padding"} style={{ flex: 1 }}> */}
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
                <TextField
                  {...commonInputProps(state.employer_name || employer_name, setEmployerName)}
                  labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
                  contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                  label="EMPLOYER NAME"
                  labelFontSize={14}
                  labelTextStyle={{ color: "black", fontWeight: "700" }}
                  placeholder="Type name of the employer"
                  renderLeftAccessory={() => (
                    <View style={{ width: 30 }}>
                      <MaterialIcons name="business-center" size={24} />
                    </View>
                  )}
                  // renderRightAccessory={() => (
                  //   <TouchableWithoutFeedback onPress={() => job_type_ref.current.clear()}>
                  //     <View style={{ width: 40, marginHorizontal: 10 }}>
                  //       <Text color="#4a89f2" bold>
                  //         Clear
                  //       </Text>
                  //     </View>
                  //   </TouchableWithoutFeedback>
                  // )}
                />

                <TextField
                  keyboardType="phone-pad"
                  {...commonInputProps(state.employer_phone_number || employer_phone_number, setEmployerPhoneNumber)}
                  labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
                  contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                  label="PHONE NUMBER"
                  labelFontSize={14}
                  labelTextStyle={{ color: "black", fontWeight: "700" }}
                  placeholder="(000) 000-0000"
                  renderLeftAccessory={() => (
                    <View style={{ width: 30 }}>
                      <MaterialIcons name="phone" size={24} />
                    </View>
                  )}
                  // renderRightAccessory={() => (
                  //   <TouchableWithoutFeedback onPress={() => job_type_ref.current.clear()}>
                  //     <View style={{ width: 40, marginHorizontal: 10 }}>
                  //       <Text color="#4a89f2" bold>
                  //         Clear
                  //       </Text>
                  //     </View>
                  //   </TouchableWithoutFeedback>
                  // )}
                />

                <TextField
                  {...commonInputProps(state.employer_address || state.employer_address, setEmployerAddress)}
                  labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
                  contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                  label="BUSINESS ADDRESS"
                  labelFontSize={14}
                  labelTextStyle={{ color: "black", fontWeight: "700" }}
                  placeholder="Type its business address"
                  renderLeftAccessory={() => (
                    <View style={{ width: 30 }}>
                      <MaterialIcons name="store-mall-directory" size={24} />
                    </View>
                  )}
                  // renderRightAccessory={() => (
                  //   <TouchableWithoutFeedback onPress={() => job_type_ref.current.clear()}>
                  //     <View style={{ width: 40, marginHorizontal: 10 }}>
                  //       <Text color="#4a89f2" bold>
                  //         Clear
                  //       </Text>
                  //     </View>
                  //   </TouchableWithoutFeedback>
                  // )}
                />
              </Fields>

              {/* <View style={{ height: 50, backgroundColor: "transparent" }}></View> */}

              <FieldsTwo>
                <TextField
                  {...commonInputProps(state.supervisor_name || supervisor_name, setSupervisorName)}
                  labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
                  contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                  label="SUPERVISOR NAME"
                  labelFontSize={14}
                  labelTextStyle={{ color: "black", fontWeight: "700" }}
                  placeholder="Type your supervisor's name"
                  renderLeftAccessory={() => (
                    <View style={{ width: 30 }}>
                      <Foundation name="torso-business" size={24} />
                    </View>
                  )}
                />

                <TextField
                  labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -6 }}
                  contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 10 }}
                  label="SUPERVISOR TITLE"
                  labelFontSize={14}
                  labelTextStyle={{ color: "black", fontWeight: "700" }}
                  placeholder="Type the supervisor's title"
                  {...commonInputProps(state.supervisor_title || supervisor_title, setSupervisorTitle)}
                />
                <TextField
                  labelOffset={{ x0: 0, y0: 0, x1: 0, y1: -6 }}
                  contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                  label="YOUR POSITION"
                  labelFontSize={14}
                  labelTextStyle={{ color: "black", fontWeight: "700" }}
                  placeholder="Type your title position"
                  {...commonInputProps(state.user_position_title || user_position_title, setPositionTitle)}
                />

                <WageInput>
                  <SalaryField>
                    <TextField
                      labelOffset={{ x0: 0, y0: 0, x1: -40, y1: -6 }}
                      contentInset={{ top: 16, left: 0, right: 0, label: 4, input: 8 }}
                      label="SALARY"
                      labelFontSize={14}
                      labelTextStyle={{ color: "black", fontWeight: "700" }}
                      placeholder="0.00"
                      renderLeftAccessory={() => (
                        <View style={{ width: 30 }}>
                          <MaterialIcons name="attach-money" size={24} />
                        </View>
                      )}
                      keyboardType="numeric"
                      {...commonInputProps(state.salary || salary, setSalary)}
                    />
                  </SalaryField>
                  <WageTimeField>
                    <WageTimeFieldInput selectedValue={wage} onValueChange={(value) => setWage(value)}>
                      <WageTimeFieldInput.Item label="/Year" value="yr" />
                      <WageTimeFieldInput.Item label="/Hour" value="hr" />
                    </WageTimeFieldInput>
                  </WageTimeField>
                </WageInput>

                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>DATE STARTED</Text>

                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  {/* <DatePicker>
                <Text>{date_obtained && formatDate(date_obtained)}</Text>
                <AntDesign name="calendar" size={24} />
              </DatePicker> */}
                  <AntDesign name="calendar" size={24} />
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date_started}
                    mode="date"
                    is24Hour={true}
                    onChange={onChangeDateObtained}
                    // collapsable={true}
                    display="default"
                    style={{ flex: 1, marginHorizontal: 10 }}
                  />
                </View>
                {/* <TouchableWithoutFeedback
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
                </TouchableWithoutFeedback> */}

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
                  <>
                    <Text style={{ fontWeight: "bold", color: "grey", marginTop: 0 }}>DATE ENDED</Text>
                    {/* <TouchableWithoutFeedback
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
                      
                    </TouchableWithoutFeedback> */}
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                      {/* <DatePicker>
                <Text>{date_obtained && formatDate(date_obtained)}</Text>
                <AntDesign name="calendar" size={24} />
              </DatePicker> */}
                      <AntDesign name="calendar" size={24} />
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date_ended}
                        mode="date"
                        is24Hour={true}
                        onChange={onChangeExpirationDate}
                        // collapsable={true}
                        display="default"
                        style={{ flex: 1, marginHorizontal: 10 }}
                      />
                    </View>
                  </>
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
        {/* {show1 && (
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
        )} */}
        {/* </KeyboardAvoidingView> */}
      </View>
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

const ModalBackground = styled.View`
  background: white;
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
  margin: 0 20px 0px 20px;
`;

const FieldsTwo = styled.View`
  margin: 0 20px;
`;

const Switch = styled.Switch``;

const SwitchContainer = styled.View`
  margin: 10px 0 20px 0;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Container = styled.View`
  flex: 1;
`;
