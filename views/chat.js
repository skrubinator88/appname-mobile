import React, { useState, useCallback, useEffect } from "react";
import { View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default function Example() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        // sent: true,
        // received: true,
        user: {
          _id: 1,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        showUserAvatar
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}
