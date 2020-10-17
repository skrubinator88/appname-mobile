export const ChatReducer = (prevState = {}, action) => {
  switch (action.type) {
    case "ADD_CHAT_MESSAGE": {
      if (prevState[action.chat_id] == undefined) return { ...prevState, [action.chat_id]: { [action.message._id]: action.message } };

      return { ...prevState, [action.chat_id]: Object.assign({ ...prevState[action.chat_id] }, { [action.message._id]: action.message }) };
    }
    case "UPDATE_CHAT_MESSAGE": {
      return { ...prevState, [action.chat_id]: [...prevState[action.chat_id]] };
    }
    case "CHAT_CLEAN": {
      return { ...prevState, [action.chat_id]: [] };
    }
    default:
      return { ...prevState };
  }
};
