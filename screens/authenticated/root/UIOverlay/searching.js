// Dependencies
import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import * as Progress from "react-native-progress";

// Components
import Text from "../../../../components/text";
import Card from "../../../../components/card";

// Context Store
import { UIOverlayContext, GlobalContext } from "../../../../components/context";

// Controllers
import JobsController from "../../../../controllers/JobsControllers";
import MapController from "../../../../controllers/MapController";

// Redux
import { useSelector, useDispatch } from "react-redux";

export default function Searching({ keyword }) {
  const { changeRoute } = useContext(UIOverlayContext); // Overlay routing
  const jobs = useSelector((store) => store.jobs);
  const dispatch = useDispatch();

  useEffect(() => {
    const job_found = JobsController.findJobWithKeyword(keyword, jobs)[0];

    if (job_found) {
      /**
       * Update job status to "In Review" (This will pop the job out from
       * local store since is going to update in backend)
       **/
      JobsController.changeJobStatus(job_found._id, "IN REVIEW");

      // Move Camera
      MapController.handleCameraCoordinates(job_found.coordinates, dispatch);

      // Evaluate job
      changeRoute({ name: "job_found", props: { job_data: job_found } });
    }
  }, [jobs]);

  return (
    <Card>
      <SafeAreaView>
        <Row>
          <Text medium>Searching for nearby jobs</Text>
        </Row>
        <Row>
          <Progress.Bar indeterminate indeterminateAnimationDuration={4000} width={250} borderWidth={0} useNativeDriver={true} />
        </Row>
        <Row>
          <TouchableWithoutFeedback
            onPress={() => {
              // clearInterval(loop);
              changeRoute({ name: "dashboard" });
            }}
          >
            <Text small cancel>
              Cancel
            </Text>
          </TouchableWithoutFeedback>
        </Row>
      </SafeAreaView>
    </Card>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  padding: 10px 0;
`;
