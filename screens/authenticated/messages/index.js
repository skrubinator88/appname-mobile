import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Styled from "styled-components/native";

// Components
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";

// Controllers
import ChatsController from "../../../controllers/ChatsController";

export default function Messages({ navigation }) {
  const [chats, setChats] = useState([]);

  // Subscribe to messages firebase
  useEffect(() => {
    //   ChatsController.
    setChats([...chats, { id: 0 }, { id: 1 }]);

    return () => {
      setChats([]);
    };
  }, []);

  return (
    <Container navigation={navigation} headerBackground="grey">
      {chats.map(({ id }) => (
        <Message key={id} />
      ))}
    </Container>
  );
}

function Message({ key }) {
  return (
    <View key={key}>
      <Text>Hey</Text>
    </View>
  );
}
