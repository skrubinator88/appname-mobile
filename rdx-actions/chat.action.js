// Store
exports.add = (chat_id, message) => {
  return { type: "ADD_CHAT_MESSAGE", chat_id, message };
};

// exports.update = (id, message) => {
//   return { type: "UPDATE", chat_id, message };
// };

// exports.delete = (id, message) => {
//   return { type: "UPDATE", chat_id, message };
// };

exports.clean = (chat_id) => {
  return { type: "CHAT_CLEAN", chat_id };
};
