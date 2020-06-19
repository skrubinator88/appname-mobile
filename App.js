import React, { Component } from "react";

import {
  Text,
 CheckBox,
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

import { Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign } from "@expo/vector-icons";

class contractorApp extends Component {
  state = {
    phone: "",
  };

  render() {
    let { phone } = this.state;

    fieldRef = React.createRef();

    onSubmit = () => {
      let { current: field } = this.fieldRef;

      console.log(field.value());
    };

    formatText = (text) => {
      return text.replace(/[^+\d]/g, "");
    };
    const Cancel = (e) => {
      Alert.alert("Cancel");
    };
    const Save = (e) => {
      Alert.alert("Save");
    };

    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Container>
            <ContainerTop>
              <TextStyledTittle
                style={{ fontSize: 20 }}
                onPress={(e) => Cancel(e)}
              >
                Cancel
              </TextStyledTittle>
              <TextStyledTittle style={{ marginLeft: 50, marginRight: 50 }}>
                Add Work
              </TextStyledTittle>
              <TextStyledTittle
                style={{ fontSize: 20, fontWeight: "bold", color: "#1c55ef" }}
                onPress={(e) => Save(e)}
              >
                Save
              </TextStyledTittle>
            </ContainerTop>
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
              >
                OR ENTER ADDRESS MANUALLY
              </Text>
            </Fields>
            <View style={{ backgroundColor: "#F2F2F2", height: 50 }}></View>
            <FieldsTwo>
              <TextField label="Supervisor Name" />

              <TextField label="Supervisor Title" />
              <TextField label="Position Title" />
              <Text
                style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}
              >
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
             <View  style={{ flex: 1, flexDirection:"row", alignItems:"center" }}>
             <Text  style={{  marginTop: 10, fontSize:20 }}>I am a currently working here</Text>
              <CheckBox style={{  marginLeft: 11, marginTop: 10 }}/>
             </View>
             <Text
                style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}
              >
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
              <TextField label="Salary"style={{ width:10 }} />

              
              <Text
                style={{ fontWeight: "bold", color: "grey", marginTop: 20 }}
              >
                BRIEF DESCRIPTION OF TASKS
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  padding: 8,
                  borderRadius: 10,
                  marginTop: 10,
                  height:200
                }}
              />
            </FieldsTwo>
          </Container>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const Fields = styled.View`
  flex: 0.4;

  margin: 20px;
`;
const FieldsTwo = styled.View`
  flex: 0.5;

  margin: 20px;
`;

const ButtonStyled = styled.TouchableOpacity`
  background-color: #1c55ef;
  padding: ${() => (Platform.OS == "ios" ? "15px" : "10px")};
  width: 80%;
  border-radius: 6px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
`;

const ButtonStyledWork = styled.TouchableOpacity`
  background-color: white;
  padding: ${() => (Platform.OS == "ios" ? "15px" : "10px")};
  width: 80%;
  border-radius: 6px;
  border-width: 1px;
  border-style: solid;
  border-color: #1c55ef;
  margin: 0 auto;
  margin-top: 90px;
  align-items: center;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
`;

var Employer = styled.View``;

const Terms = styled.View`
  margin-top: 40px;
`;

var Employee = styled.View`
  display: none;
`;

const IconBack = styled.View`
  margin-bottom: 50px;
`;

const ContainerMiddle = styled.View`
  flex: 0.6;
  margin-left: 13px;
  margin-right: 13px;
`;

const ContainerTop = styled.View`
  margin-top: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const ContainerTopMiddle = styled.View`
  flex: 0.06;
  padding: 20px;
  padding-bottom: 0px;
  padding-left: 20px;
  margin-left: 13px;
  margin-right: 13px;
  flex-direction: row;
  margin-top: 20px;
`;

const TextStyledContent = styled.Text`
  color: #1c55ef;
  font-weight: bold;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "18px")};
`;

const TextStyledTittle = styled.Text`
  text-align: center;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "28px")};
`;

const TextStyledInfo = styled.Text`
  margin-top: 10px;
  margin-left: 3px;
  margin-right: 3px;
  font-size: ${() => (Platform.OS == "ios" ? "25px" : "19px")};
`;

export default contractorApp;
