// Dependencies
import axios from "axios";
import * as firebase from "firebase";

// Config
import config from "../env";
import { firestore, GeoFirestore } from "../config/firebase";

// Functions

// Redux Actions
import ChatActions from "../rdx-actions/chat.action";

exports.initializeChatBetween = (sender, receiver) => {
  // Create document unique ID
  const chat_id = sender > receiver ? sender + receiver : receiver + sender;
  const document = firestore.collection("chats").doc(chat_id);

  document.set({ sender, receiver });

  // return chat session id
  return chat_id;
};

exports.sendMessage = (chat_id, message, dispatch) => {
  const reduxMessage = { ...message, pending: true };
  const cloudMessage = { ...message, sent: true };

  // Send to REDUX to faster feel
  dispatch(ChatActions.add(chat_id, reduxMessage));

  // Send to firebase
  const document = firestore.collection("chats").doc(chat_id);
  document.collection("messages").add(cloudMessage);

  // Send push notification
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
            // return dispatch(JobsStoreActions.remove(document.id));
          }
          default:
            break;
        }
      });
    });

  return unsubscribe;
};

exports.getChats = (user_id, dispatch) => {};

exports.clean = (chat_id, unsubscribe, dispatch) => {
  unsubscribe();

  dispatch(ChatActions.clean(chat_id));
};
