// Store
exports.animateTo = (coordinates) => {
  return { type: "UPDATE_CAMERA_COORDINATES", coordinates };
};

// Store
exports.animateToActualCoordinates = (coordinates) => {
  return { type: "RESET_CAMERA_COORDINATES" };
};
