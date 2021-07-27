import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, TouchableWithoutFeedback } from "react-native";
import * as Progress from "react-native-progress";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import GigChaserJobWord from "../../../../assets/gig-logo";
import Card from "../../../../components/card_animated";
import { GlobalContext, UIOverlayContext } from "../../../../components/context";
import Text from "../../../../components/text";
import { JOB_CONTEXT } from "../../../../contexts/JobContext";
import AnimationsController from "../../../../controllers/AnimationsControllers";
import JobsController from "../../../../controllers/JobsControllers";
import MapController from "../../../../controllers/MapController";
import { AccountView } from "../../payment/components";

export default function Searching({ keyword }) {
  const { authState } = useContext(GlobalContext);
  const { changeRoute } = useContext(UIOverlayContext)
  const { findFirstJobWithKeyword, viewed, setViewed } = useContext(JOB_CONTEXT);
  const { jobs } = useContext(JOB_CONTEXT);

  const [jobSelected, setJobSelected] = useState(false);
  const [showPaymentsModal, setShowPaymentsModal] = useState(false)
  const jobFoundProcessRef = useRef();
  const CardUI = useRef();

  const dispatch = useDispatch();
  const { hasActiveAccount } = useSelector((state) => state.payment)

  const { userData } = authState;


  useEffect(() => {
    const job_found = findFirstJobWithKeyword(keyword, authState.userID);

    if (job_found?.inAppPayment && !hasActiveAccount) {
      setViewed(viewed.filter(id => id !== job_found._id))
      Alert.alert("Payment Account Required", "You must setup your account to view this job",
        [{
          onPress: () => {
            setShowPaymentsModal(true)
          },
          style: 'default',
          text: 'Manage Payments',
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: cancel
        }
        ])
    }

    if (job_found && jobSelected === false && CardUI.current != null && ((job_found?.inAppPayment && hasActiveAccount) || !job_found?.inAppPayment) && !showPaymentsModal) {
      (async () => {
        try {
          setJobSelected(true)

          /**
         * Update job status to "in Review" 
         **/
          await JobsController.changeJobStatus(job_found._id, "in review", authState.userID);
          const jobFoundProcess = AnimationsController.CardUISlideOut(
            CardUI,
            () => {
              // Move Camera
              MapController.handleCameraCoordinates(job_found.coordinates, dispatch);
            },
            false,
          );
          jobFoundProcessRef.current = jobFoundProcess;
        } catch (e) {
          console.log(e)
          Alert.alert('Failed to process request', 'Please try again')
          setJobSelected(false);
        }
      })()
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
          },
          true,
        ),
      100,
    );
    // MapController.clearTemporalCirclesAndTags(dispatch);
    changeRoute({ name: 'dashboard' })
  }

  return (
    <Card ref={CardUI}>
      <Row style={{ marginVertical: 4 }}>
        {userData.role === "contractor" ? (
          <>
            <Text medium>Searching for nearby</Text>
            <GigChaserJobWord color="black" width="60px" height="100%" style={{ marginHorizontal: 4 }} />
          </>
        ) : <Text medium>"Searching for workers"</Text>}
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
      {showPaymentsModal && (
        <AccountView refreshing={false} visible={showPaymentsModal} forPaymentsModal onSuccess={() => {
          // setJobSelected(true)
          setShowPaymentsModal(false)
        }} />)
      }
    </Card>
  );
}

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  padding: 10px 0;
`;
