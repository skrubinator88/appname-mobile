import { Platform } from "react-native";
import { firestore } from "../config/firebase";
import env from "../env";
import ChatActions from "../rdx-actions/chat.action";


exports.initializeChatBetween = (user1, user2, job_id = "") => {
  // Create document unique ID
  const chat_id = user1 > user2 ? user1 + user2 : user2 + user1;
  const document = firestore.collection("chats").doc(chat_id);

  document.set({ users: [user1, user2], initialized: false });

  // return chat session id
  return chat_id;
};

exports.getReceiverData = async (receiver, token) => {
  const res = await fetch(`${Platform.OS == "ios" ? env.API_URL : env.API_URL_AVD}/users/${receiver}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
};

exports.sendMessage = async (chat_id, message, dispatch) => {
  const reduxMessage = { ...message, pending: true };
  const cloudMessage = { ...message, sent: true };

  // Send to REDUX to faster feel
  dispatch(ChatActions.add(chat_id, reduxMessage));

  // Send to firebase
  const document = firestore.collection("chats").doc(chat_id);
  const newMessageDoc = document.collection("messages").doc();
  await firestore.runTransaction(async (t) => {
    t.set(document, { last_message: { text: message.text, createdAt: message.createdAt, read: false }, initialized: true }, { merge: true })
      .set(newMessageDoc, cloudMessage)
  })

  // Send push notification
};

exports.getUserChats = (user_id, setChats) => {
  const unsubscribe = firestore
    .collection("chats")
    .where("users", "array-contains", user_id)
    .where("initialized", "==", true)
    .orderBy("last_message.createdAt")
    .onSnapshot((res) => {
      res.docChanges().forEach((change) => {
        const { doc: document } = change;
        // console.log(change.type);
        switch (change.type) {
          case "added": {
            setChats((prevState) => [{ id: document.id, ...document.data() }, ...prevState]);
            // const data = document.data();
            // data.createdAt = data.createdAt.toDate();
            // return dispatch(ChatActions.add(chat_id, data));
          }
          case "modified": {
            setChats((prevState) => {
              const newArray = prevState.filter((item) => item.id !== document.id);
              return [{ id: document.id, ...document.data() }, ...newArray];
            });
          }
          case "removed": {
            return setChats((prevState) => [...prevState.filter(i => i.id !== document.id)]);
          }
          default:
            break;
        }
      });
    });

  return unsubscribe;
};

exports.getMessages = (chat_id, dispatch) => {
  const unsubscribe = firestore
    .collection("chats")
    .doc(chat_id)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .onSnapshot((res) => {
      res.docChanges().forEach((change) => {
        const { doc: document } = change;
        switch (change.type) {
          case "added": {
            const data = document.data();
            data.createdAt = data.createdAt.toDate();
            return dispatch(ChatActions.add(chat_id, data));
          }
          case "modified": {
            console.log("updated");
            // const data = document.data();
            // data.distance = distanceBetweenTwoCoordinates(data.coordinates["U"], data.coordinates["k"], latitude, longitude);
            // return dispatch(JobsStoreActions.update(document.id, data));
          }
          case "removed": {
            return dispatch(ChatActions.delete(chat_id, document.id));
          }
          default:
            break;
        }
      });
    });

  return unsubscribe;
};

exports.getChats = (user_id, dispatch) => { };

exports.clean = (chat_id, unsubscribe, dispatch) => {
  unsubscribe();

  dispatch(ChatActions.clean(chat_id));
};
