// Config
import config from "../env";

// Redux Actions
import CameraActions from "../rdx-actions/camera.action";

exports.handleCameraCoordinates = (coordinates, dispatch) => {
  const { U: latitude, k: longitude } = coordinates;
  const newCoordinates = { latitude, longitude };
  dispatch(CameraActions.animateTo(newCoordinates));
};

exports.clearTemporalCirclesAndTags = (dispatch) => {
  dispatch(CameraActions.animateToActualCoordinates());
};
