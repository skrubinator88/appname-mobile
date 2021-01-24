// Store
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

exports.updateTransaction = (data) => {
  return { type: "SET_TRANSACTION", data };
};

exports.clear = () => {
  return { type: "CLEAR_PAYMENTS" }; // Empty store
};
