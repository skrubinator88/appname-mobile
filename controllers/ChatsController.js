// Dependencies
import axios from "axios";
import * as firebase from "firebase";

// Config
import config from "../env";
import { firestore, GeoFirestore } from "../config/firebase";

// Functions

// Redux Actions

exports.initializeChatBetween = (sender, receiver) => {
  // Create document unique ID
  const chat_id = sender > receiver ? sender + receiver : receiver + sender;
  const reference = firestore.collection("chats").doc(chat_id);

  reference.set({ sender, receiver });

  // return chat session id
  return chat_id;
};

exports.sendMessage = (chat_id, message) => {
  const reference = firestore.collection("chats").doc(chat_id);
  reference.collection("messages").add(message);
};

exports.getChats = (user_id, dispatch) => {};
