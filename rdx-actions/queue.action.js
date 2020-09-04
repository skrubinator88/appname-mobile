// Store
exports.add = (id, job) => {
  return { type: "ADD_JOB_QUEUE", id };
};

exports.remove = (id) => {
  return { type: "DELETE_JOB_QUEUE", id };
};

exports.clear = () => {
  return { type: "CLEAR_QUEUE" }; // Empty store
};
