// Dependencies
import React, { useState, useEffect, useContext, useRef } from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import * as Progress from "react-native-progress";

// Components
import Text from "../../../../components/text";
// import Card from "../../../../components/card";
import Card from "../../../../components/card_animated";

// Context Store
import { UIOverlayContext, GlobalContext } from "../../../../components/context";

// Controllers
import JobsController from "../../../../controllers/JobsControllers";
import MapController from "../../../../controllers/MapController";
import AnimationsController from "../../../../controllers/AnimationsControllers";

// Redux
import { useSelector, useDispatch } from "react-redux";

export default function Searching({ keyword }) {
  // Constructor
  const { authActions, authState, errorActions } = useContext(GlobalContext);
  const { userToken, userID, userData } = authState;
  const { changeRoute } = useContext(UIOverlayContext); // Overlay routing

  // State
  const jobs = useSelector((store) => store.jobs);
  const dispatch = useDispatch();
  const CardUI = useRef(null);
  const [jobSelected, setJobSelected] = useState(false);

  useEffect(() => {
    const job_found = JobsController.findFirstJobWithKeyword(keyword, jobs, authState.userID);

    if (job_found && jobSelected === false) {
      setJobSelected(true);

      AnimationsController.CardUISlideOut(CardUI, () => {
        /**
         * Update job status to "In Review" (This will pop the job out from
         * local store since is going to update in the backend)
         **/
        JobsController.changeJobStatus(job_found._id, "in review", authState.userID);

        // Move Camera
        // console.log(job_found.location.coords);
        MapController.handleCameraCoordinates(job_found.coordinates, dispatch);

        changeRoute({ name: "job_found", props: { job_data: job_found, keyword } });
      });
    }
    // }
  }, [jobs]);

  return (
    <Card ref={CardUI}>
      <Row>
        <Text medium>{userData.role == "contractor" ? "Searching for nearby jobs" : "Searching for workers"}</Text>
      </Row>
      <Row>
        <Text small>{keyword}</Text>
      </Row>
      <Row>
        <Progress.Bar indeterminate indeterminateAnimationDuration={4000} width={250} borderWidth={0} useNativeDriver={true} />
      </Row>
      <Row>
        <TouchableWithoutFeedback
          onPress={() => {
            // Move Camera
            MapController.clearTemporalCirclesAndTags(dispatch);
            changeRoute({ name: "dashboard" });
          }}
        >
          <Text small cancel>
            Cancel
          </Text>
        </TouchableWithoutFeedback>
      </Row>
    </Card>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  padding: 10px 0;
`;
