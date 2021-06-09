import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import * as Progress from "react-native-progress";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import Card from "../../../../components/card_animated";
import { GlobalContext, UIOverlayContext } from "../../../../components/context";
import Text from "../../../../components/text";
import { JOB_CONTEXT } from "../../../../contexts/JobContext";
import AnimationsController from "../../../../controllers/AnimationsControllers";
import JobsController from "../../../../controllers/JobsControllers";
import MapController from "../../../../controllers/MapController";





export default function Searching({ keyword }) {
  const { authActions, authState, errorActions } = useContext(GlobalContext);
  const { userToken, userID, userData } = authState;
  const { viewed, setViewed, findFirstJobWithKeyword } = useContext(JOB_CONTEXT);
  const { changeRoute } = useContext(UIOverlayContext); // Overlay routing

  // State
  const jobs = useSelector((store) => store.jobs);
  const dispatch = useDispatch();
  const CardUI = useRef();
  const [jobSelected, setJobSelected] = useState(false);
  const jobFoundProcessRef = useRef();

  useLayoutEffect(() => {
    const job_found = findFirstJobWithKeyword(keyword, jobs, authState.userID);

    if (job_found && jobSelected === false && CardUI.current != null) {
      setJobSelected(true);

      const jobFoundProcess = AnimationsController.CardUISlideOut(
        CardUI,
        () => {
          /**
           * Update job status to "In Review" (This will pop the job out from
           * local store since is going to update in the backend)
           **/
          JobsController.changeJobStatus(job_found._id, "in review", authState.userID);

          // Move Camera
          // console.log(job_found.location.coords);
          MapController.handleCameraCoordinates(job_found.coordinates, dispatch);

          changeRoute({ name: "job_found", props: { job_data: job_found, keyword } });
        },
        false,
      );
      jobFoundProcessRef.current = jobFoundProcess;
    }
  }, [jobs, CardUI]);

  function cancel() {
    // Kill searching process
    clearTimeout(jobFoundProcessRef.current);

    setTimeout(
      () =>
        AnimationsController.CardUISlideOut(
          CardUI,
          () => {
            MapController.clearTemporalCirclesAndTags(dispatch);
            changeRoute({ name: "dashboard" });
          },
          true,
        ),
      100,
    );
    // MapController.clearTemporalCirclesAndTags(dispatch);
    // changeRoute({ name: "dashboard" });
  }

  return (
    <Card ref={CardUI}>
      <Row>
        <Text medium>{userData.role === "contractor" ? "Searching for nearby jobs" : "Searching for workers"}</Text>
      </Row>
      <Row>
        <Text small>{keyword}</Text>
      </Row>
      <Row>
        <Progress.Bar indeterminate indeterminateAnimationDuration={4000} width={250} borderWidth={0} useNativeDriver={true} />
      </Row>
      <Row>
        <TouchableWithoutFeedback onPress={() => cancel()}>
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
