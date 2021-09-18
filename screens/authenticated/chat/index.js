import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { GiftedChat } from "react-native-gifted-chat";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { sendNotification } from "../../../functions";
import { GlobalContext } from "../../../components/context";
import Text from "../../../components/text";
import ChatController from "../../../controllers/ChatsController";
import env from "../../../env";
import { InputToolbar, RenderComposer } from "./components";
import { JOB_CONTEXT } from "../../../contexts/JobContext";
import { LISTING_CONTEXT } from "../../../contexts/ListingContext";
import { Alert } from "react-native";

const statusBarHeight = getStatusBarHeight();

export default function Chat({ navigation }) {
  const { authState } = useContext(GlobalContext);
  const { current } = useContext(JOB_CONTEXT)
  const { listing } = useContext(LISTING_CONTEXT)
  const { receiver, hasUnreadChat } = useRoute().params || {};

  const [chatID, setChatID] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const notificationTimer = useRef();
  const giftedChatRef = useRef()

  const chats = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const notifyRecipient = (message) => {
    if (
      message &&
      (authState.userData.role === 'contractor' && current.posted_by === receiver)
      ||
      (authState.userData.role !== 'contractor' && listing.executed_by === receiver)) {

      clearTimeout(notificationTimer.current)
      notificationTimer.current = setTimeout(() => {
        sendNotification(authState.userToken, receiver, {
          title: `${authState.userData.first_name} ${authState.userData.last_name}`,
          body: message.text?.substr(0, 30) || "New Message",
          data: { type: "newmessage", id: (current || listing)._id, sender: authState.userID },
        }).catch(e => console.log("Failed to send notification", e))
      },
        // Debounce notifications by 10 seconds
        10000)
    }
  }

  useEffect(() => {
    let retrievedChatID;
    let unsubscribe;
    new Promise(async (res) => {
      retrievedChatID = await ChatController.initializeChatBetween(authState.userID, receiver);
      setChatID(retrievedChatID);

      // Subscribe to messages channel
      unsubscribe = ChatController.getMessages(retrievedChatID, dispatch);
      res()
    })

    return () => ChatController.clean(retrievedChatID, unsubscribe, dispatch);
  }, []);

  useEffect(() => {
    giftedChatRef.current?.scrollToBottom();
  }, [chats.length])

  useEffect(() => {
    if (receiver) {
      (async () => {
        const retrieveReceiverInfo = await ChatController.getReceiverData(receiver, authState.userToken);
        setReceiverName(`${retrieveReceiverInfo.first_name} ${retrieveReceiverInfo.last_name}`);
      })();
    }
  }, [receiver]);


  useFocusEffect(useCallback(() => {
    if (!chatID || !hasUnreadChat) {
      return
    }
    // This will indicate that there is no unread message
    ChatController.markAsRead(authState.userID, chatID)
      .catch(err => {
        console.log("Failed to mark chat as read", err)
      })

  }, [chatID, hasUnreadChat]))

  const onSend = async (message) => {
    if (chatID.length !== 0) {
      try {
        await ChatController.sendMessage(receiver, chatID, message, dispatch);
        notifyRecipient(message)
      } catch (e) {
        console.log(e)
        Alert.alert("Failed to send message", e.message)
      }
    }
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
      <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
        <GiftedChat
          listViewProps={{
            style: { flex: 1, flexShrink: 0 },
            contentContainerStyle: { flexGrow: 1, justifyContent: 'center' },
            bounces: false
          }}
          ref={giftedChatRef}
          placeholder='Type a message'
          alwaysShowSend
          inverted={false}
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
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', transform: [{ rotateX: 160 }] }}>
              <Text align='center' light small>No Message sent yet</Text>
            </View>
          )} />
      </KeyboardAvoidingView>
    </View>
  );
}

const NavBar = styled.SafeAreaView`
  height: 90px;
  margin-top: ${Platform.OS === "android" ? `${statusBarHeight}px` : "0px"};
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
