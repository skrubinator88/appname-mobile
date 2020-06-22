import React, { useState } from "react";

import {
  Text,
  Alert,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Keyboard,
  ScrollView,
} from "react-native";

import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from "react-native-material-textfield";

import CheckBox from "@react-native-community/checkbox";

import { Platform } from "react-native";
import styled from "styled-components/native";

// Components
import Header from "../../../../components/header";

export function SignUpContractorScreen2({ navigation }) {
  const [phone, setPhone] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  let fieldRef = React.createRef();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <Header
            navigation={navigation}
            title="Add Work"
            next="next"
            nextTitle="Save"
          />

          <Fields>
            <TextField label="Employer Name" />

            <TextField label="Phone Number" keyboardType="phone-pad" />

            <TextField label="Address" />
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                margin: 8,
                fontWeight: "bold",
              }}
            ></Text>
          </Fields>
          <View style={{ backgroundColor: "#F2F2F2", height: 50 }}></View>
          <FieldsTwo>
            <TextField label="Supervisor Name" />

            <TextField label="Supervisor Title" />
            <TextField label="Position Title" />
            <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>
              DATE STARTED
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                padding: 8,
                borderRadius: 10,
                marginTop: 10,
              }}
            />
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Text style={{ marginTop: 10, fontSize: 20 }}>
                I am a currently working here
              </Text>
              {/* <CheckBox
                style={{ marginLeft: 11, marginTop: 10 }}
                value={toggleCheckBox}
                onValueChange={() =>
                  toggleCheckBox
                    ? setToggleCheckBox(false)
                    : setToggleCheckBox(true)
                }
              /> */}
            </View>
            <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>
              DATE ENDED
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                padding: 8,
                borderRadius: 10,
                marginTop: 10,
              }}
            />
            <TextField label="Salary" style={{ width: 10 }} />

            <Text style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}>
              BRIEF DESCRIPTION OF TASKS
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                padding: 8,
                borderRadius: 10,
                marginTop: 10,
                height: 200,
              }}
            />
          </FieldsTwo>
        </Container>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const Fields = styled.View`
  flex: 0.4;

  margin: 20px;
`;
const FieldsTwo = styled.View`
  flex: 0.5;

  margin: 20px;
`;

const Container = styled.View`
  flex: 1;
`;

const ContainerTop = styled.View`
  margin-top: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TextStyledTittle = styled.Text`
  text-align: center;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "28px")};
`;
