import React, { useEffect, useState, useContext } from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import styled from "styled-components/native";

// Components
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import { useTheme } from "@react-navigation/native";
import env from "../../../env";

// Styling
import { Entypo, Octicons, Feather } from "@expo/vector-icons";

// Controllers
import ChatsController from "../../../controllers/ChatsController";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Functions
import { convertFirestoreTimestamp } from "../../../functions/";

// Context
import { GlobalContext } from "../../../components/context";

// Miscellaneous
import { getStatusBarHeight } from "react-native-status-bar-height";
const statusBarHeight = getStatusBarHeight();
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function Messages({ navigation }) {
  const { authActions, authState, errorActions } = useContext(GlobalContext);

  const { colors } = useTheme();
  const [chats, setChats] = useState([]);

  // Subscribe to messages firebase
  useEffect(() => {
    const unsubscribe = ChatsController.getUserChats(authState.userID, setChats);

    return () => {
      setChats([]);
      unsubscribe();
    };
  }, []);

  return (
    <Container navigation={navigation} headerBackground={colors.primary} backColor="white" style={{ backgroundColor: "red" }}>
      {chats.map((prop) => (
        <Message key={prop.id} {...prop} navigation={navigation} />
      ))}
      {chats.length <= 0 && (
        <NoMessageBanner>
          <Feather name="message-circle" size={width * 0.4} color="#ccc" style={{ margin: 20 }} />
          <Text bold color="#ccc">
            There is not messages yet
          </Text>
        </NoMessageBanner>
      )}
    </Container>
  );
}

function Message(props) {
  const { colors } = useTheme();
  const [time, setTime] = useState("");
  const [user, setUser] = useState("");
  const [userName, setUserName] = useState("");
  const [receiver, setReceiver] = useState();
  const { authActions, authState, errorActions } = useContext(GlobalContext);

  useState(() => {
    for (let user of props.users) {
      if (user != authState.userID) {
        setUser(user);
        (async () => {
          const res = await fetch(`${env.API_URL}/users/${user}`, {
            headers: {
              Authorization: `bearer ${authState.userToken}`,
            },
          });
          const data = await res.json();
          setUserName(`${data.first_name} ${data.last_name}`);
        })();
      }
    }
    setTime(convertFirestoreTimestamp(props.last_message.createdAt));
  }, []);

  return (
    <>
      <TouchableOpacity
        style={{ flexDirection: "row", padding: 10, alignItems: "center" }}
        onPress={() => props.navigation.navigate("Chat", { receiver: user })}
      >
        <Avatar source={{ uri: `${env.API_URL}/images/${user}.jpg` }} />

        <View style={{ flex: 1 }}>
          <Name>
            <Text bold small color="#444">
              {userName}
            </Text>
          </Name>
          <LastMessage>
            <Text color={!props.last_message.read ? colors.primary : "grey"} bold={!props.last_message.read && true}>
              {props.last_message.text}
            </Text>
            <Text color="grey" bold={!props.last_message.read && true}>
              {time} {!props.last_message.read && <Octicons name="primitive-dot" size={16} color="red" />}
            </Text>
          </LastMessage>
        </View>
      </TouchableOpacity>

      <Divider />
    </>
  );
}

const Avatar = styled.Image`
  height: 60px;
  width: 60px;
  border-radius: 60px;
  margin-right: 10px;
`;

const Name = styled.View``;

const LastMessage = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Divider = styled.View`
  border: 0.5px solid #dadada;
`;

const NoMessageBanner = styled.View`
  height: ${height - statusBarHeight * 4}px;
  justify-content: center;
  align-items: center;
`;
