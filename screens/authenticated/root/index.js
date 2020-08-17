import React, { useEffect, useState } from "react";
import { View, Keyboard, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import styled from "styled-components/native";
import config from "../../../env";

import HandleUIComponents from "./UIOverlay/handleUIComponents";

// Controllers
import JobsControllers from "../../../controllers/JobsControllers";

// Interfaces
import { CameraInterface } from "../../../interfaces/mapview-interfaces";

const { height } = Dimensions.get("screen");

const askPermissions = async () => {
  let position;
  try {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") setErrorMsg("Permission to access location was denied");
    position = await Location.getLastKnownPositionAsync();
  } catch (e) {
    position = await Location.getCurrentPositionAsync();
  }
  return position;
};

export function RootScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [jobPostings, setJobPostings] = useState([]);
  const [channel, setChannel] = useState(null);

  let cameraSettings;

  const thisComponentState = {
    location,
    setLocation,
    setErrorMsg,
    setJobPostings,
    channel,
    setChannel,
  };

  const handleCameraMove = () => {};

  useEffect(() => {
    askPermissions().then((position) => setLocation(position));
  }, []);

  useEffect(() => {
    JobsControllers.getJobsAndSubscribeJobsChannel(thisComponentState);
    return function cleanUp() {
      if (channel) channel.unbind();
    };
  }, [location]);

  if (location != null) {
    const zoom = 12; // Change the zoom between 2 and 20
    const base = 80; // Change this number to set the position of the GPS Icon (Vertically only) between -200 and 200 Default: -100
    cameraSettings = new CameraInterface({
      latitude: location.coords.latitude - base / Math.pow(2, zoom - 1),
      longitude: location.coords.longitude,
      altitude: 0,
      pitch: 0,
      heading: 0,
      zoom,
    });
  }

  if (location != null) {
    return (
      <Container>
        <MapView
          onTouchStart={() => Keyboard.dismiss()}
          provider="google"
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsCompass={false}
          showsTraffic={false}
          initialCamera={cameraSettings}
          camera={cameraSettings}
          showsUserLocation={true}
          style={{ height }}
          maxZoomLevel={18} // 18
          minZoomLevel={9} // 9
          // customMapStyle={mapStyle}
        >
          {jobPostings.map(({ location, _id }) => (
            <Marker
              key={_id}
              coordinate={{ latitude: location.coordinates[1], longitude: location.coordinates[0] }}
              icon={JobsControllers.getJobTagType("user")}
            ></Marker>
          ))}
        </MapView>

        <HandleUIComponents navigation={navigation} jobPostings={jobPostings} onMoveCamera={handleCameraMove} />
      </Container>
    );
  } else {
    return <View></View>;
  }
}

// STYLES
const Container = styled.View`
  flex: 1;
`;
