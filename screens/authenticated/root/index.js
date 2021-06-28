import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Keyboard, Image, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { GlobalContext } from "../../../components/context";
import { JOB_CONTEXT } from "../../../contexts/JobContext";
import { USER_LOCATION_CONTEXT } from "../../../contexts/userLocation";
import JobsControllers from "../../../controllers/JobsControllers";
import { getPaymentInfo } from "../../../controllers/PaymentController";
import { CameraInterface } from "../../../interfaces/mapview-interfaces";
import HandleUIComponents from "./UIOverlay/handleUIComponents";

// Miscellaneous
const { height } = Dimensions.get("screen");

export function RootScreen({ navigation }) {
  // Constructor
  const { location } = useContext(USER_LOCATION_CONTEXT)
  const { jobs } = useContext(JOB_CONTEXT)
  const { authState } = useContext(GlobalContext);

  // State
  const [atJobLocation, setAtJobLocation] = useState(false);
  const [showCircle, setShowCircle] = useState(false);
  const [circleCoordinates, setCircleCoordinates] = useState(null);
  const [cameraSettings, setCameraSettings] = useState()

  // Refs
  const _map = useRef(null);
  const _circle = useRef(null);

  // Store
  // const mapsEvent
  const camera = useSelector((state) => state.camera);
  const dispatch = useDispatch();

  // Move Camera
  useEffect(() => {
    if (!_map.current) {
      // If there is no map object, do not proceed!
      return
    }
    if (camera != null && camera.reset == false) {
      setCircleCoordinates({ latitude: camera.coordinates[0], longitude: camera.coordinates[1] });
      setShowCircle(true);
      _map.current.animateCamera(camera.settings, { duration: 2000 });
    } else if (camera != null && camera.reset == true) {
      setShowCircle(false);
      const verticalAlignment = 80;
      const zoom = 16;
      _map.current.animateCamera(
        {
          center: { latitude: location.coords.latitude - verticalAlignment / Math.pow(2, zoom - 1), longitude: location.coords.longitude },
          zoom,
        },
        { duration: 1000 }
      );
    }
  }, [camera]);

  // Check if user contractor got closer to job
  useEffect(() => {
    if (location != null) {
      const zoom = 15; // Change the zoom between 2 and 20
      const verticalAlignment = 80; // Change this number to set the position of the GPS Icon (Vertically only) between -200 and 200 Default: -100
      setCameraSettings(new CameraInterface({
        latitude: location.coords.latitude - verticalAlignment / Math.pow(2, zoom - 1),
        longitude: location.coords.longitude,
        altitude: 0,
        pitch: 0,
        heading: 0,
        zoom,
      }));
    }
  }, [location])

  useEffect(() => {
    getPaymentInfo(authState, dispatch).catch(e => console.log(e))
    return () => {
      setShowCircle(false);
    };
  }, [])

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
          // followsUserLocation={true}
          style={{ height }}
          maxZoomLevel={18} // recommended 18 / min: 1, max: 19
          minZoomLevel={9} // recommended 9 / min: 1, max: 19
        // customMapStyle={mapStyle}
        >
          {jobs.map(({ coordinates, _id }) => <CustomMarker key={_id} coordinates={coordinates} id={_id} />)}
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

const CustomMarker = ({ coordinates, id }) => {
  const [trackView, setTrackView] = useState(true)

  return (
    <Marker
      key={id}
      coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
      tracksViewChanges={trackView}
    >
      <Image
        source={JobsControllers.getJobTagType("user")}
        onLoad={() => setTrackView(false)}
        fadeDuration={0}
        style={{ height: 50, width: 50, }} />
    </Marker>
  )
}

// STYLES

const Container = styled.View`
  flex: 1;
`;
