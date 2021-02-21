// Store
exports.setMethod = (data) => {
  return { type: "SET_PAYMENT_METHOD", data };
};

exports.addMethod = (data) => {
  return { type: "ADD_PAYMENT_METHOD", data };
};

exports.removeMethod = (data) => {
  return { type: "REMOVE_PAYMENT_METHOD", data };
};

exports.updateBalance = (data) => {
  return { type: "SET_BALANCE", data };
};

exports.updateDefault = (data) => {
  return { type: "SET_DEFAULT_METHOD", data };
};

exports.setTransaction = (data) => {
  return { type: "SET_TRANSACTION", data };
};

exports.updateTransaction = (data) => {
  return { type: "UPDATE_TRANSACTION", data };
};

exports.clear = () => {
  return { type: "CLEAR_PAYMENTS" }; // Empty store
};
