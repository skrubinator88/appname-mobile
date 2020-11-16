export const CameraReducer = (prevState = null, action) => {
  switch (action.type) {
    case "UPDATE_CAMERA_COORDINATES": {
      const { latitude, longitude } = action.coordinates;
      const zoom = 16; // Change the zoom between 2 and 20
      const verticalAlignment = 100; // Change this number to set the position of the GPS Icon (Vertically only) between -200 and 200 Default: -100

      return {
        settings: {
          center: { latitude: latitude - verticalAlignment / Math.pow(2, zoom - 1), longitude: longitude },
          zoom,
        },
        coordinates: [latitude, longitude],
        reset: false,
      };
    }
    case "RESET_CAMERA_COORDINATES": {
      return {
        settings: null,
        coordinates: null,
        reset: true,
      };
    }
    default:
      return null;
  }
};
