// React
import React, { useState, useRef } from "react";
import { View, Button, FlatList, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, TouchableOpacity } from "react-native";

// Styling
import Modal from "react-native-modal";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";

// Components
import Text from "../../../components/text";

// Functions
import { createToken } from "../../../functions";

// Platform Fixes
import { getStatusBarHeight } from "react-native-status-bar-height";
import { clear } from "../../../rdx-actions/jobs.action";
const statusBarHeight = getStatusBarHeight();

export default function TaskModal({ showModal, onHandleModalClose, items, onSaveItem }) {
  // Constructor

  // State
  const [addTaskInput, setAddTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(false);

  // Refs
  const textInput = useRef(null);

  function clean() {
    setEditing(false);
    setTasks([]);
    setAddTaskInput("");
  }

  function createUniqueToken(result) {
    if (result?.success) return;
    const generated_token = createToken();
    const identicalIDArray = tasks.filter(({ id }) => id == generated_token);
    if (identicalIDArray.length == 0) {
      return { success: true, id: generated_token };
    } else {
      createUniqueToken();
    }
  }

  function handleSaveTask() {
    const serializedInput = addTaskInput.trim();
    if (serializedInput.length == 0) {
      setEditing(false);
      setAddTaskInput("");

      return;
    }

    const { id } = createUniqueToken();
    if (id) {
      setTasks([...tasks, { text: serializedInput, id }]);
      setEditing(false);
      setAddTaskInput("");
      return;
    }
  }

  return (
    <Modal
      isVisible={showModal}
      avoidKeyboard={Platform.OS == "ios" ? true : false}
      style={{
        marginTop: statusBarHeight,
        backgroundColor: Platform.OS == "ios" ? "transparent" : "white",
        borderRadius: 10,
        elevation: 10,
      }}
      onModalWillShow={() => {
        setTasks(items || []);
        if (items?.length < 1) setEditing(true);
      }}
      onModalHide={() => clean()}
      hideModalContentWhileAnimating={true}
      animationInTiming={500}
      animationOutTiming={500}
      backdropOpacity={0.2}
      backdropTransitionOutTiming={0}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
    >
      <Container
        style={{ backgroundColor: "white", borderRadius: 10, shadowRadius: 100, shadowColor: "black" }}
        keyboardShouldPersistTaps="always"
      >
        <Title>
          <Text title>Tasks to be completed</Text>
        </Title>

        <View>
          <AddTaskButton onPress={() => setEditing(true)}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="plus" size={13} color="#285df0" />
              <Text small color="#285df0" bold style={{ marginLeft: 5, marginTop: 20, marginBottom: 20 }}>
                ADD TASK
              </Text>
            </View>
          </AddTaskButton>
        </View>

        {editing && (
          <AddTaskInput>
            <Text style={{ fontWeight: "bold", color: "grey" }}>DESCRIPTION</Text>
            <TextInput
              ref={textInput}
              maxLength={512}
              scrollEnabled={false}
              autoFocus={true}
              style={{
                borderWidth: 1,
                borderRadius: 6,
                marginTop: 10,
                marginBottom: 10,
                padding: 10,
              }}
              value={addTaskInput}
              onChangeText={(text) => setAddTaskInput(text)}
              onSubmitEditing={() => handleSaveTask()}
              onBlur={() => setEditing(false)}
            />

            <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
              <AddTaskButton onPress={() => setAddTaskInput("")}>
                <Text small color="#285df0" bold style={{ marginRight: 5, marginBottom: 20 }}>
                  CLEAR INPUT
                </Text>
              </AddTaskButton>
            </View>
          </AddTaskInput>
        )}

        {!editing ? (
          <FlatList
            style={{ marginVertical: 10, paddingVertical: 10 }}
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Task>
                <Text style={{ flex: 2, padding: 5 }} color="#636363" small>
                  {item.text}
                </Text>
                <TouchableOpacity onPress={() => setTasks([...tasks].filter(({ id }) => id != item.id))}>
                  <FontAwesome name="remove" size={16} style={{ flex: 1, padding: 5 }} />
                </TouchableOpacity>
              </Task>
            )}
          />
        ) : (
          <View style={{ flex: 1 }}></View>
        )}

        <Buttons>
          {editing ? (
            <SaveEditingButton onPress={() => handleSaveTask()}>
              <Box color="#285df0">
                <Text color="white">Done editing</Text>
              </Box>
            </SaveEditingButton>
          ) : (
            <>
              <CancelButton onPress={() => onHandleModalClose()}>
                <Box>
                  <Text color="red" bold>
                    Cancel
                  </Text>
                </Box>
              </CancelButton>
              <SaveButton onPress={() => onHandleModalClose(tasks)}>
                <Box color="#285df0">
                  <Text color="white">Save</Text>
                </Box>
              </SaveButton>
            </>
          )}
        </Buttons>
      </Container>
    </Modal>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Title = styled.View`
  padding: 10px;
  align-items: center;
`;

const AddTaskInput = styled.View``;

const Buttons = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
`;

const Task = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 2px 10px;
`;

const AddTaskButton = styled.TouchableOpacity``;

const CancelButton = styled.TouchableWithoutFeedback``;

const SaveButton = styled.TouchableWithoutFeedback``;

const SaveEditingButton = styled.TouchableWithoutFeedback``;

const Box = styled.View`
  padding: 17px 0;
  width: 40%;
  align-items: center;
  border-radius: 6px;
  background-color: ${(props) => props.color || "white"};
`;
