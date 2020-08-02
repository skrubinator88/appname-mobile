import React, { useState } from "react";

import { Text, Alert, TouchableWithoutFeedback, Modal } from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";

import { TextField } from "react-native-material-textfield";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function licenseModal({ licenseModalVisible, onCancel, onSave }) {
  let current_datetime = new Date();

  // Date Obtained
  const [dateObtained, setDateObtained] = useState(new Date());
  const [mode1, setMode1] = useState("date");
  const [show1, setShow1] = useState(false);
  const onChangeDateObtained = (event, selectedDate) => {
    const currentDate = selectedDate || dateObtained;
    setShow1(Platform.OS === "ios");
    setDateObtained(currentDate);
  };
  const showMode1 = (currentMode) => {
    setShow1(true);
    setMode1(currentMode);
  };
  const showDatepicker1 = () => {
    showMode1("date");
  };
  const showTimepicker1 = () => {
    showMode1("time");
  };

  // Expiration Date

  const [expirationDate, setExpirationDate] = useState(new Date());
  const [mode2, setMode2] = useState("date");
  const [show2, setShow2] = useState(false);

  const onChangeExpirationDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateObtained;
    setShow2(Platform.OS === "ios");
    setExpirationDate(currentDate);
  };

  const showMode2 = (currentMode) => {
    setShow2(true);
    setMode2(currentMode);
  };
  const showDatepicker2 = () => {
    showMode2("date");
  };
  const showTimepicker2 = () => {
    showMode2("time");
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          setShow1(false);
          setShow2(false);
        }}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={licenseModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <Container>
            <Fields>
              <TextStyledTittle>License Title</TextStyledTittle>
              <ContainerFields>
                <TextField label="Licence Number" />

                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>DATE OBTAINED</Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setShow1(true);
                    setShow2(false);
                  }}
                >
                  <DatePicker>
                    <Text>{dateObtained && dateObtained.toLocaleDateString()}</Text>
                  </DatePicker>
                </TouchableWithoutFeedback>

                <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>EXPIRATION DATE</Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setShow2(true);
                    setShow1(false);
                  }}
                >
                  <DatePicker>
                    <Text>{expirationDate && expirationDate.toLocaleDateString()}</Text>
                  </DatePicker>
                </TouchableWithoutFeedback>

                <Buttons>
                  <TextStyledBtn
                    style={{ fontSize: 20, marginRight: 118, marginLeft: 30 }}
                    onPress={(e) => {
                      onCancel();
                    }}
                  >
                    Cancel
                  </TextStyledBtn>

                  <TextStyledBtn
                    style={{ fontSize: 20, fontWeight: "bold", color: "#1c55ef", marginLeft: 30 }}
                    onPress={(e) => {
                      onSave();
                    }}
                  >
                    Save
                  </TextStyledBtn>
                </Buttons>
              </ContainerFields>
            </Fields>
          </Container>
        </Modal>
      </TouchableWithoutFeedback>
      {show1 && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateObtained}
          mode={mode1}
          is24Hour={true}
          display="default"
          onChange={onChangeDateObtained}
        />
      )}
      {show2 && (
        <DateTimePicker
          testID="dateTimePicker"
          value={expirationDate}
          mode={mode2}
          is24Hour={true}
          display="default"
          onChange={onChangeExpirationDate}
        />
      )}
    </>
  );
}

const Fields = styled.View`
  margin: 20px;
  padding-bottom: 20px;
  border-width: 1px;
  background-color: #ffffff;
  border-color: #e3e3e3;
`;

const DatePicker = styled.View`
  border-radius: 10px;
  border-width: 1px;
  padding: 8px;
`;

const SearchBox = styled.View`
  margin: 20px;
  border-width: 1px;
  padding: 10px;
  border-radius: 20px;
  border-color: #e0e0e0;
`;

const Container = styled.View`
  flex: 1;
  background-color: #f4f4f4;
`;

const Buttons = styled.View`
  align-content: center;
  text-align: center;
  flex-direction: row;
`;

const ContainerTop = styled.View`
  flex: 0.12;
`;

const ContainerFields = styled.View`
  margin-left: 20px;
  margin-right: 20px;
`;

const TextStyledTittle = styled.Text`
  margin: 20px;
  margin-bottom: 0px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "20px")};
`;

const TextStyledBtn = styled.Text`
  margin-top: 30px;

  font-size: ${() => (Platform.OS == "ios" ? "25px" : "17px")};
`;
