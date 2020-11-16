// Config
import config from "../env";

// Redux Actions
import CameraActions from "../rdx-actions/camera.action";

exports.handleCameraCoordinates = (coordinates, dispatch) => {
  const { latitude, longitude } = coordinates;
  dispatch(CameraActions.animateTo({ latitude, longitude }));
};

exports.clearTemporalCirclesAndTags = (dispatch) => {
  dispatch(CameraActions.animateToActualCoordinates());
};
