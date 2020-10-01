// Store
exports.add = (id, listing) => {
  return { type: "ADD_LISTING", id, listing };
};

exports.update = (id, listing) => {
  return { type: "UPDATE_LISTING", id, listing };
};

exports.remove = (id) => {
  return { type: "DELETE_LISTING", id };
};

exports.clear = () => {
  return { type: "CLEAR_LISTING" }; // Empty store
};
