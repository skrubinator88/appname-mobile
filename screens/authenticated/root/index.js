// Dependencies
import React, { useEffect, useState, useContext, useReducer } from "react";
import { View, Keyboard, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import styled from "styled-components/native";

// Controllers
import JobsControllers from "../../../controllers/JobsControllers";
import PermissionsControllers from "../../../controllers/PermissionsControllers";
import MapController from "../../../controllers/MapController";

// Imported Store
import { JobContext, GlobalContext } from "../../../components/context";

// Imported Reducers
import JobReducer from "../../../reducers/JobReducer";

// Imported Actions
import JobActions from "../../../actions/JobActions";

// Interfaces
import { CameraInterface } from "../../../interfaces/mapview-interfaces";

// Components
import HandleUIComponents from "./UIOverlay/handleUIComponents";

// Configs
const { height } = Dimensions.get("screen");

export function RootScreen({ navigation }) {
  const { errorContext } = useContext(GlobalContext);
  const { setError } = errorContext;

  // Constructor
  const [location, setLocation] = useState(null);
  const [jobPostings, setJobPostings] = useState([]);
  const [channel, setChannel] = useState(null);
  let cameraSettings;

  // Job Store
  const [job_ids, dispatch] = useReducer(JobReducer, []);
  const jobContext = JobActions.memo({ job_ids, dispatch });

  // State object for use in imported (external) modules. Modules will have control over this (actual module) component state
  const thisComponentState = { location, setLocation, setJobPostings, channel, setChannel, setError, jobContext };

  // Get location
  useEffect(() => {
    PermissionsControllers.getLocation().then((position) => setLocation(position));
  }, []);

  // (Web Socket) get jobs and subscribe to jobs pipeline
  useEffect(() => {
    if (location) JobsControllers.getJobsAndSubscribeJobsChannel(thisComponentState);
    return () => channel && channel.unbind();
  }, [location]);

  if (location != null) {
    const zoom = 12; // Change the zoom between 2 and 20
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
          maxZoomLevel={18} // recommended 18 / min: 1, max: 19
          minZoomLevel={9} // recommended 9 / min: 1, max: 19
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

        <JobContext.Provider value={jobContext}>
          <HandleUIComponents navigation={navigation} jobPostings={jobPostings} onMoveCamera={MapController.handleCameraMoveEvent()} />
        </JobContext.Provider>
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
