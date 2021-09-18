import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, Keyboard, View } from "react-native";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import GigChaserJobWord from "../../../assets/gig-logo";
import { GlobalContext } from "../../../components/context";
import Text from "../../../components/text";
import { JOB_CONTEXT } from "../../../contexts/JobContext";
import { LISTING_CONTEXT } from "../../../contexts/ListingContext";
import { USER_LOCATION_CONTEXT } from "../../../contexts/userLocation";
import JobsController from "../../../controllers/JobsControllers";
import { getPaymentInfo } from "../../../controllers/PaymentController";
import { CameraInterface } from "../../../interfaces/mapview-interfaces";
import HandleUIComponents from "./UIOverlay/handleUIComponents";

const markerImage = require("../../../assets/map-marker.png")
// Miscellaneous
const { height } = Dimensions.get("screen");

export function RootScreen({ navigation }) {
  // Constructor
  const { location } = useContext(USER_LOCATION_CONTEXT)
  const { jobs, current } = useContext(JOB_CONTEXT)
  const { listing } = useContext(LISTING_CONTEXT)
  const { authState } = useContext(GlobalContext);
  const { changeRoute } = {};


  // State
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
    if (listing && listing.status === 'in progress' && authState?.userData?.role !== 'contractor' && listing.active_location) {
      setCircleCoordinates({ latitude: listing.active_location.latitude, longitude: listing.active_location.longitude });
      setShowCircle(true);
      _map.current?.animateCamera({
        center: { latitude: listing.active_location.latitude - 80 / Math.pow(2, 15), longitude: listing.active_location.longitude },
        zoom: 16,
      }, { duration: 2000 });
    }
  }, [listing?.status, listing?.active_location, authState?.userData?.role])

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
                icon={markerImage}
              />
            </>
          )}
          {jobs.map((job) => <CustomMarker key={job._id} authState={authState} coordinates={job.coordinates} job={job} />)}
          {/* {(current && authState?.userData?.role === 'contractor') && (
            <CustomMarker coordinates={current.coordinates} job={current} />
          )} */}
          {(listing && listing.status === 'in progress' && authState?.userData?.role !== 'contractor' && listing.active_location) && (
            <CustomMarker authState={authState} coordinates={{ longitude: listing.active_location.longitude, latitude: listing.active_location.latitude }} job={listing} />
          )}
        </MapView>

        <HandleUIComponents navigation={navigation} />
      </Container>
    );
  } else {
    return <View></View>;
  }
}

const CustomMarker = ({ coordinates, authState, job }) => {

  return (
    <Marker
      key={job._id}
      coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
    >
      <Image
        source={markerImage}
        fadeDuration={0}
        style={{ height: 50, width: 50 }} />
      <Callout onPress={async () => { await JobsController.changeJobStatus(job._id, "in review", authState.userID); }} tooltip={true}>
        <View style={{
          width: 160,
          padding: 8,
          justifyContent: 'space-between',
          alignItems: 'stretch',
          borderRadius: 8,
          backgroundColor: 'white',
          marginBottom: 8,
          shadowColor: "black",
          shadowOpacity: 0.4,
          shadowRadius: 4,
          shadowOffset: {
            width: 0,
            height: 2,
          }
        }}>
          <GigChaserJobWord color="#0e5915" width="100%" height="20px" style={{ marginLeft: 8, alignSelf: 'center' }} />
          <Text small align='center' style={{ marginVertical: 4 }}>{job.job_title}</Text>
          <Text small light align='center' style={{ marginVertical: 4 }}>{job.job_type}</Text>
        </View>
      </Callout>
    </Marker>
  )
}

// STYLES
const Container = styled.View`
  flex: 1;
`;
