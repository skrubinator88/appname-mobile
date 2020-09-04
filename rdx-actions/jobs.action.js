// Store
exports.add = (id, job) => {
  return { type: "ADD", id, job };
};

exports.remove = (id) => {
  return { type: "DELETE", id };
};

exports.update = (id, job) => {
  return { type: "UPDATE", id, job };
};

exports.clear = () => {
  return { type: "CLEAR" }; // Empty store
};
