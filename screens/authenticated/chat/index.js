import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

// Controllers
import ChatController from "../../../controllers/ChatsController";

// Context Store
import { GlobalContext } from "../../../components/context";

export default function Chat({ route }) {
  const { authState } = useContext(GlobalContext);
  const { receiver } = route.params;

  const [messages, setMessages] = useState([]);
  const [chatID, setChatID] = useState("");

  useEffect(() => {
    const retrievedChatID = ChatController.initializeChatBetween(authState.userID, receiver);
    setChatID(retrievedChatID);
  }, []);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: "Hello developer",
  //       createdAt: new Date(),
  //       // sent: true,
  //       // received: true,
  //       user: {
  //         _id: 1,
  //         name: "React Native",
  //         avatar: "https://placeimg.com/140/140/any",
  //       },
  //     },
  //   ]);
  // }, []);

  const onSend = (message) => {
    if (chatID.length != 0) ChatController.sendMessage(chatID, message);
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        showUserAvatar
        onSend={(messages) => onSend(messages[0])}
        user={{
          _id: authState.userID,
        }}
      />
    </View>
  );
}
