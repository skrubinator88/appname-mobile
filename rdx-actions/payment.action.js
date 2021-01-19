// Store
exports.add = (data) => {
  return { type: "ADD_PAYMENT_METHOD", data };
};

exports.update = (data) => {
  return { type: "SET_BALANCE", data };
};

exports.update = (data) => {
  return { type: "SET_DEFAULT_METHOD", data };
};

exports.remove = (data) => {
  return { type: "SET_TRANSACTION", data };
};

exports.clear = () => {
  return { type: "CLEAR_PAYMENTS" }; // Empty store
};
