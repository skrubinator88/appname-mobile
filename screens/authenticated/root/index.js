// Dependencies
import React, { useEffect, useState, useContext, useReducer, useRef } from "react";
import { View, Keyboard, Dimensions, Platform } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import styled from "styled-components/native";
import { Provider } from "react-redux";

// Interfaces
import { CameraInterface } from "../../../interfaces/mapview-interfaces";

// Controllers
import JobsControllers from "../../../controllers/JobsControllers";
import PermissionsControllers from "../../../controllers/PermissionsControllers";
import MapController from "../../../controllers/MapController";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Context Store
import { GlobalContext } from "../../../components/context";

// Components
import HandleUIComponents from "./UIOverlay/handleUIComponents";
import { clear } from "../../../rdx-actions/jobs.action";

// - - Fixes - -

// Miscellaneous
const { height } = Dimensions.get("screen");

export function RootScreen({ navigation, clearTemporalCircle }) {
  // Constructor
  const { errorActions } = useContext(GlobalContext);
  const { setError } = errorActions;

  // State
  const [location, setLocation] = useState(null);
  const [atJobLocation, setAtJobLocation] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [circleCoordinates, setCircleCoordinates] = useState(null);

  // Refs
  const _map = useRef(null);
  const _circle = useRef(null);
  let cameraSettings;

  // Store
  // const mapsEvent
  const camera = useSelector((state) => state.camera);
  const jobs = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  // State object for use in imported (external) modules. Modules will have control over this (actual module) component state
  const thisComponentState = { location, setLocation, setError };

  // Move Camera
  useEffect(() => {
    if (_map.current && camera != null && camera.reset == false) {
      setCircleCoordinates({ latitude: camera.coordinates[0], longitude: camera.coordinates[1] });
      setShowCircle(true);
      _map.current.animateCamera(camera.settings, { duration: 2000 });
    } else if (camera != null && camera.reset == true) {
      setShowCircle(false);
      const verticalAlignment = 80;
      const zoom = 12;
      _map.current.animateCamera(
        {
          center: { latitude: location.coords.latitude - verticalAlignment / Math.pow(2, zoom - 1), longitude: location.coords.longitude },
          zoom,
        },
        { duration: 1000 }
      );
    }
  }, [camera]);

  // Get location once
  useEffect(() => {
    PermissionsControllers.getLocation().then((position) => setLocation(position));

    return () => {
      setShowCircle(false);
    };
  }, []);

  // Get jobs and subscribe to jobs pipeline
  useEffect(() => {
    let unsubscribe;
    // Subscribe and return a function for unsubscribe
    if (location) unsubscribe = JobsControllers.getJobsAndSubscribeJobsChannel(thisComponentState, dispatch);

    return () => {
      if (unsubscribe !== undefined) JobsControllers.clean("JobsStoreActions", unsubscribe, dispatch);
    };
  }, [location]);

  // Check if user contractor got closer to job

  if (location != null) {
    const zoom = 15; // Change the zoom between 2 and 20
    const verticalAlignment = 80; // Change this number to set the position of the GPS Icon (Vertically only) between -200 and 200 Default: -100
    cameraSettings = new CameraInterface({
      latitude: location.coords.latitude - verticalAlignment / Math.pow(2, zoom - 1),
      longitude: location.coords.longitude,
      altitude: 0,
      pitch: 0,
      heading: 0,
      zoom,
    });
  }

  if (location != null && jobs != undefined) {
    return (
      <Container>
        <MapView
          onTouchStart={() => Keyboard.dismiss()}
          ref={_map}
          provider="google"
          showsMyLocationButton={false}
          showsPointsOfInterest={false}
          showsCompass={false}
          showsTraffic={false}
          initialCamera={cameraSettings}
          camera={cameraSettings}
          showsUserLocation={true}
          style={{ height }}
          maxZoomLevel={18} // recommended 18 / min: 1, max: 19
          minZoomLevel={9} // recommended 9 / min: 1, max: 19
          // customMapStyle={mapStyle}
        >
          {jobs.map(({ coordinates, _id }) => (
            <Marker
              key={_id}
              coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
              icon={JobsControllers.getJobTagType("user")}
            />
          ))}
          {showCircle && (
            <>
              <Circle
                center={circleCoordinates}
                radius={250}
                ref={_circle}
                strokeWidth={2}
                strokeColor="rgba(0,163,119,0.3)"
                fillColor="rgba(102,204,176,0.3)"
                onLayout={() =>
                  // Circle fix bug (IOS only) for style props not taking effects
                  // https://github.com/react-native-community/react-native-maps/issues/3057
                  _circle.current.setNativeProps({
                    fillColor: "rgba(102,204,176,0.3)",
                    strokeColor: "rgba(102,204,176,0.3)",
                  })
                }
              />
              <Marker
                onLayout={() => setShowCircle(true)}
                key={"job_found"}
                coordinate={circleCoordinates}
                icon={JobsControllers.getJobTagType("user")}
              />
            </>
          )}
        </MapView>

        <HandleUIComponents navigation={navigation} />
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
