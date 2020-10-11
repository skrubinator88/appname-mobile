export const ListingsReducer = (prevState = {}, action) => {
  switch (action.type) {
    case "ADD_MESSAGE": {
      return { ...prevState, [action.chat_id]: [...prevState[action.chat_id], action.message] };
    }
    case "UPDATE_MESSAGE": {
      return { ...prevState, [action.chat_id]: [...prevState[action.chat_id]] };
    }
    // case "CLEAR_MESSAGES": {
    // }
    default:
      return { ...prevState };
  }
};
