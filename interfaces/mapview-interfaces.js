export function CameraInterface({
  latitude,
  longitude,
  pitch,
  heading,
  altitude,
  zoom,
}) {
  return {
    center: {
      latitude, // Number
      longitude, // Number
    },
    pitch, // Number
    heading, // Number

    // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
    altitude,

    // Only when using Google Maps.
    zoom,
  };
}

export function RegionInterface({
  latitude,
  longitude,
  latitudeDelta,
  longitudeDelta,
}) {
  return {
    latitude, // Number
    longitude, // Number
    latitudeDelta, // Number
    longitudeDelta, // Number
  };
}
