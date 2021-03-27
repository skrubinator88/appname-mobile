import React, { useState, useEffect, useContext } from "react";
import { View, StatusBar, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import env from "../../../env";

// Styling
import styled from "styled-components/native";
import { getStatusBarHeight } from "react-native-status-bar-height";

const statusBarHeight = getStatusBarHeight();

// Controllers
import ChatController from "../../../controllers/ChatsController";

// Context Store
import { GlobalContext } from "../../../components/context";

// Expo
import { AntDesign } from "@expo/vector-icons";

// Components
import Text from "../../../components/text";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function Chat({ route, navigation }) {
  const { authState } = useContext(GlobalContext);
  const { receiver } = route.params;

  const [chatID, setChatID] = useState("");
  const [receiverName, setReceiverName] = useState("");

  const chats = useSelector((state) => state.chats);
  const dispatch = useDispatch();

  useEffect(() => {
    const retrievedChatID = ChatController.initializeChatBetween(authState.userID, receiver);
    setChatID(retrievedChatID);

    // Subscribe to messages channel
    const unsubscribe = ChatController.getMessages(retrievedChatID, dispatch);

    return () => ChatController.clean(retrievedChatID, unsubscribe, dispatch);
  }, []);

  useEffect(() => {
    (async () => {
      const retrieveReceiverInfo = await ChatController.getReceiverData(receiver, authState.userToken);

      // console.log(retrieveReceiverInfo);

      setReceiverName(`${retrieveReceiverInfo.first_name} ${retrieveReceiverInfo.last_name}`);
    })();
  });

  const onSend = (message) => {
    if (chatID.length != 0) ChatController.sendMessage(chatID, message, dispatch);
  };

  // console.log("MY CHAT", Object.values(chats[chatID] || {}));

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <NavBar style={{ borderBottomWidth: 1, borderColor: "#dedede" }}>
        <Start>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <BackButton>
              <AntDesign backgroundColor="white" color="#444" name="arrowleft" size={30} style={{ marginLeft: 20 }} />
            </BackButton>
          </TouchableWithoutFeedback>
        </Start>

        <Middle>
          <Text title>{receiverName}</Text>
        </Middle>

        <End></End>
      </NavBar>
      <GiftedChat
        messages={Object.values(chats[chatID] || {}).reverse()}
        // showAvatarForEveryMessage
        showUserAvatar
        isLoadingEarlier
        onSend={(messages) => onSend(messages[0])}
        user={{
          _id: authState.userID,
          avatar: `${env.API_URL}${authState.userData.profile_picture}`,
        }}
      />
    </View>
  );
}

const NavBar = styled.SafeAreaView`
  height: 90px;
  margin-top: ${Platform.OS == "android" ? `${statusBarHeight}px` : "0px"};
  flex-direction: row;
  /* justify-content: space-around; */
  align-items: center;
  background-color: white;
`;

const BackButton = styled.View``;

const Start = styled.View`
  flex: 1;
`;

const Middle = styled.View`
  justify-content: center;
  align-items: center;
  flex: 2;
`;

const End = styled.View`
  flex: 1;
`;
