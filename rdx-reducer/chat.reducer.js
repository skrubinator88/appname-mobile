import { GiftedChat } from "react-native-gifted-chat";

export const ChatReducer = (prevState = {}, action) => {
  switch (action.type) {
    case "ADD_CHAT_MESSAGE": {
      const prevMessages = (prevState[action.chat_id] || []).filter(message => message._id !== action.message._id)
      prevState[action.chat_id] = GiftedChat.prepend(prevMessages, [action.message])
      return { ...prevState };
    }
    case "UPDATE_CHAT_MESSAGE": {
      return { ...prevState, [action.chat_id]: [...prevState[action.chat_id]] };
    }
    case "DELETE_CHAT_MESSAGE": {
      return { ...prevState, [action.chat_id]: (prevState[action.chat_id] || []).filter(message => message._id !== action.message_id) };
    }
    case "CHAT_CLEAN": {
      return { ...prevState, [action.chat_id]: [] };
    }
    default:
      return { ...prevState };
  }
};
