import React, { useState, useEffect, useContext } from "react";
import { View, StatusBar, Platform, KeyboardAvoidingView, ActivityIndicator } from "react-native";
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
import { InputToolbar, RenderComposer } from "./components";

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

      setReceiverName(`${retrieveReceiverInfo.first_name} ${retrieveReceiverInfo.last_name}`);
    })();
  }, [receiver]);

  const onSend = (message) => {
    if (chatID.length !== 0) ChatController.sendMessage(chatID, message, dispatch);
  };

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
      <KeyboardAvoidingView
        behavior='padding'
        style={{ flex: 1 }}
      >
        <GiftedChat
          listViewProps={{
            style: { flex: 1, marginBottom: 20, flexShrink: 0 },
            contentContainerStyle: { flexGrow: 1, justifyContent: 'center' },
            bounces: false
          }}
          placeholder='Type a message'
          alwaysShowSend
          inverted={true}
          messages={Object.values(chats[chatID] || {})}
          // showAvatarForEveryMessage
          showUserAvatar
          isLoadingEarlier
          keyboardShouldPersistTaps={'never'}
          bottomOffset={0}
          isKeyboardInternallyHandled={false}
          renderAvatar={null}
          renderInputToolbar={InputToolbar}
          renderComposer={RenderComposer}
          onSend={(messages) => onSend(messages[0])}
          user={{
            _id: authState.userID,
            avatar: `${env.API_URL}${authState.userData.profile_picture}`,
          }}
          renderChatEmpty={() => (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
              <Text align='center' light small>No Message sent yet</Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
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
