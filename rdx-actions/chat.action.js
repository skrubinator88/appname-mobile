// Store
exports.add = (chat_id, message) => {
  return { type: "ADD_CHAT_MESSAGE", chat_id, message };
};

// exports.update = (id, message) => {
//   return { type: "UPDATE", chat_id, message };
// };

exports.delete = (chat_id, message_id) => {
  return { type: "DELETE_CHAT_MESSAGE", chat_id, message: message_id };
};

exports.clean = (chat_id) => {
  return { type: "CHAT_CLEAN", chat_id };
};
