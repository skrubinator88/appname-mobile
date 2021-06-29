import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { watchPositionAsync } from "expo-location";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "react-native-elements";
import StarRating from "react-native-star-rating";
import styled from "styled-components/native";
import GigChaserJobWord from "../../../assets/gig-logo";
import Confirm from "../../../components/confirm";
import { GlobalContext, UIOverlayContext } from "../../../components/context";
import Text from "../../../components/text";
import JobsController from "../../../controllers/JobsControllers";
import env, { default as config } from "../../../env";
import { sendNotification } from "../../../functions";
import { distanceBetweenTwoCoordinates } from "../../../functions/";
import { LISTING_CONTEXT } from "../../../contexts/ListingContext";
import ReportJob from "../root/UIOverlay/reportJob";
import { CounterOfferView } from "./index";
import * as Progress from "react-native-progress";


const deviceHeight = Dimensions.get("window").height;



// BODY
export default function ListingItemSelected({ navigation }) {
  const { authState } = useContext(GlobalContext);
  const { listing: job_data, setListing } = useContext(LISTING_CONTEXT)
  const { changeRoute } = useContext(UIOverlayContext);
  const [isCanceling, setIsCanceling] = useState(false);
  const [deployeeInfo, setDeployeeInfo] = useState({});
  const [showReport, setShowReport] = useState(false)
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ showCounterOffer: false });

  useEffect(() => {
    setState({ ...state, hasPendingOffer: job_data?.status === 'in review' && job_data?.offer_received?.offer && job_data?.offer_received?.deployee && !job_data?.offer_received?.approved })
  }, [job_data?.offer_received])

  const { hasPendingOffer } = state

  useEffect(() => {
    if (!job_data?.id) {
      changeRoute({ name: "dashboard" })
    } else {
      (async () => {
        setLoading(true);
        try {
          if (job_data && job_data.executed_by) {
            const response = await fetch(`${config.API_URL}/users/${job_data.executed_by}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${authState.userToken}`,
                "Content-type": "application/json",
              },
            });
            const deployee = await response.json();
            deployee._id = job_data.executed_by;
            deployee.id = job_data.executed_by;
            setDeployeeInfo(deployee);
            setLoading(false);
          }
        } catch (e) {
          console.log(e)
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [job_data?.id, job_data?.executed_by]);

  const cancelJob = useCallback(() => {
    if (job_data.status === 'available') {
      Confirm({
        title: "Are you sure you want to delete the job?",
        message: `Deleted jobs cannot be restored`,
        options: ["Delete Job", "Never Mind"],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        onPress: async (i) => {
          if (i === 0) {
            try {
              setIsCanceling(true)
              if (job_data.posted_by !== authState.userID) {
                throw new Error("You are not authorized to delete this job")
              }
              await JobsController.deleteJob(job_data._id)
              setIsCanceling(false)
              setListing(null)
              changeRoute({ name: "dashboard" })
            } catch (e) {
              console.log(e)
              setIsCanceling(false)
              Alert.alert('Failed To Cancel Job', e.message)
            }
          }
        },
      });
    } else {
      Confirm({
        title: "Are you sure you want to cancel the job?",
        message: `Cancelling a job outside the cancellation window will attract a penalty`,
        options: ["Cancel Job", "Never Mind"],
        cancelButtonIndex: 1,
        destructiveButtonIndex: 0,
        onPress: async (i) => {
          if (i === 0) {
            try {
              setIsCanceling(true)
              await JobsController.cancelAcceptedJob(job_data._id, authState)
              await sendNotification(authState.userToken, job_data.executed_by, { title: `GigChasers - ${job_data.job_title}`, body: `Job canceled`, data: { type: 'jobcancel', id: job_data._id, sender: authState.userID } })
              setIsCanceling(false)
              setListing(null)
              changeRoute({ name: "dashboard" })
            } catch (e) {
              console.log(e)
              setIsCanceling(false)
              Alert.alert('Failed To Cancel Job', e.message)
            }
          }
        },
      });
    }
  })

  const onRejectOffer = useCallback(async () => {
    await new Promise(async (res) => {
      Confirm({
        options: ["Reject", "Cancel"],
        cancelButtonIndex: 1,
        title: `Reject Offer From ${deployeeInfo.first_name}`,
        message: `If you reject, the job will be available in the job pool`,
        onPress: async (index) => {
          try {
            setLoading(true);

            if (index === 0) {
              await JobsController.cancelOffer(job_data.id);
              sendNotification(authState.userToken, deployeeInfo.id, {
                title: `GigChasers - ${job_data.job_title}`,
                body: `Offer rejected`,
                data: { type: "offerdecline", id: job_data.id, sender: authState.userID },
              });
            }
          } catch (e) {
            console.log(e, "offer rejection");
          } finally {
            setLoading(false);
            res();
          }
        },
        onCancel: res,
      });
    });
  }, [loading, deployeeInfo, job_data]);



  return (
    <Card>
      {!loading && job_data ?
        <>
          <View>
            {job_data.executed_by ? (
              <>
                <View style={{
                  shadowColor: "black",
                  shadowOpacity: 0.4,
                  shadowRadius: 7,
                  shadowOffset: {
                    width: 5,
                    height: 5,
                  }
                }} >

                  <ProfilePicture source={{ uri: `${env.API_URL}/images/${job_data.executed_by}.jpg` }} style={{ backgroundColor: '#dadada' }} />
                </View>
                <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch', borderBottomWidth: 0 }} first>
                  <Column style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text title align='center' bold marginBottom="5px">
                      {deployeeInfo.first_name} {deployeeInfo.last_name}
                    </Text>
                    <Text small light marginBottom="5px">
                      {deployeeInfo.occupation}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                      <FontAwesome name="map-marker" size={24} color="red" />

                      <Column style={{ paddingLeft: 2, justifyContent: "center" }}>
                        <Text bold>15 min.</Text>
                      </Column>
                    </View>
                  </Column>
                </Row>


                {(job_data.status !== 'available' && job_data.status !== 'in review') &&
                  <>
                    <Row style={{ justifyContent: 'center' }}>
                      <Column>
                        <Button disabled={isCanceling} accept onPress={() => navigation.navigate("Chat", { receiver: job_data.executed_by })}>
                          <Text style={{ color: "white" }} medium>
                            Message
                          </Text>
                        </Button>
                      </Column>
                    </Row>
                    <CardOptionItem disabled={isCanceling} row onPress={() => navigation.navigate("Scanner", { job_data })}>
                      <Text small bold color={colors.primary}>
                        Scan QR Code
                      </Text>
                      <Ionicons name="ios-arrow-forward" size={24} />
                    </CardOptionItem>

                  </>
                }
                <CardOptionItem style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }} row>
                  <Text small>Reviews</Text>

                  {/* Iterate from array of data pulled from server and render as stars */}
                  <View style={{ flexDirection: "row" }}>
                    <StarRating disabled={true} fullStarColor={'black'} maxStars={5} rating={deployeeInfo.star_rate} starSize={25} />
                  </View>
                </CardOptionItem>
                <CardOptionItem disabled={isCanceling} row>
                  <Text small>View Job Description</Text>
                  <Ionicons name="ios-arrow-forward" size={24} />
                </CardOptionItem>

                {/* <CardOptionItem row>
          <Text small>View Profile</Text>
          <Ionicons name="ios-arrow-forward" size={24} />
        </CardOptionItem> */}

                <CardOptionItem onPress={() => setShowReport(true)} disabled={isCanceling} row>
                  <Text small>Report {deployeeInfo.first_name} {deployeeInfo.last_name}</Text>
                  <Ionicons name="ios-arrow-forward" size={24} />
                </CardOptionItem>
              </>
            ) : (
              <View style={{ paddingVertical: 8 }}>
                <Row style={{ borderBottomWidth: 0, justifyContent: 'center' }}>
                  <Text textTransform='uppercase' light>Searching for available deployees</Text>
                </Row>
                <Row style={{ paddingTop: 28, paddingBottom: 28, alignItems: 'center', justifyContent: 'center', }}>
                  <Progress.Bar indeterminate indeterminateAnimationDuration={4000} width={250} borderWidth={0} unfilledColor={'#eee'} useNativeDriver={true} />
                </Row>
              </View>
            )}
            {hasPendingOffer &&
              <>
                <Column>
                  <Row last style={{ marginVertical: 4, justifyContent: 'space-between' }}>
                    <Text light small>
                      Initial Offer
                    </Text>
                    <Text small>
                      ${job_data.salary}/{job_data.wage ?? 'deployment'}
                    </Text>
                  </Row>

                  {(deployeeInfo && deployeeInfo._id && deployeeInfo._id === job_data.executed_by) && (
                    <>
                      <Row last style={{ marginVertical: 4, justifyContent: 'space-between' }}>
                        <Text light small>
                          Suggested Offer
                        </Text>
                        <Text small>
                          ${job_data.offer_received.offer}
                        </Text>
                      </Row>
                      {job_data.offer_received.counterOffer &&
                        <Row last style={{ marginVertical: 4, justifyContent: 'space-between' }}>
                          <Text color="teal" small>
                            Counter Offer
                          </Text>
                          <Text color="teal" small>
                            ${job_data.offer_received.counterOffer}
                          </Text>
                        </Row>
                      }
                    </>
                  )}
                </Column>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', paddingHorizontal: 8 }}>
                  <Button onPress={onRejectOffer} disabled={isCanceling} style={{
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: 'red', borderRadius: 8, flex: 1,
                    paddingVertical: 16, marginTop: 8, marginHorizontal: 8,
                    justifyContent: 'center', alignItems: 'center',
                  }}>
                    <Text color='red' bold textTransform='uppercase'>Reject</Text>
                  </Button>
                  <Button disabled={isCanceling} onPress={() => setState({ ...state, showCounterOffer: true })} style={{
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: '#00a0e5', borderRadius: 8, flex: 1,
                    paddingVertical: 16, marginTop: 8, marginHorizontal: 8,
                    justifyContent: 'center', alignItems: 'center',
                  }}>
                    <Text color='#00a0e5' bold textTransform='uppercase'>Offer</Text>
                  </Button>
                </View>
              </>
            }
            {!hasPendingOffer &&
              <TouchableOpacity style={{
                paddingVertical: 16, marginTop: 8,
                justifyContent: 'center', alignItems: 'center',
              }} disabled={isCanceling} activeOpacity={0.4} onPress={cancelJob} >
                {isCanceling ?
                  <ActivityIndicator size='small' color='#222' />
                  :
                  <Text textTransform='uppercase' bold medium color={job_data.status === 'available' ? 'red' : "#222"}>{job_data.status === 'available' ? 'Delete' : 'Cancel'}</Text>
                }
              </TouchableOpacity>
            }
          </View>

          <ReportJob onReportSuccess={() => changeRoute({ name: 'dashboard' })} job_data={job_data} isVisible={showReport} onCancel={() => setShowReport(false)} />
          {state.showCounterOffer ? (
            <CounterOfferView
              authState={authState}
              job_data={job_data}
              deployee={deployeeInfo}
              onComplete={() => setState({ ...state, showCounterOffer: false })}
            />
          ) : null}
        </>
        :
        <ActivityIndicator style={{ margin: 8, marginTop: 12 }} size='large' />
      }
    </Card>
  );
}

// STYLES

const Card = styled.SafeAreaView`
            position: absolute;
            left: 0;
            bottom: 0;
            border-top-left-radius: 40px;
            border-top-right-radius: 40px;
            box-shadow: -10px 0px 20px #999;
            background: white;
            width: 100%;
            padding-top: 2px;
            `;

const ProfilePicture = styled.Image`
            margin: -60px auto;
            margin-bottom: -20px;
            height: 96px;
            width: 96px;
            border-radius: 48px;
            border-color: white;
            border-width: 2px;
            `;

const Row = styled.View`
            flex-direction: row;
            justify-content: ${({ first, last }) => {
    switch (true) {
      case first:
        return "space-between";
      case last:
        return "space-around";
      default:
        return "flex-start";
    }
  }};
            ${({ first }) => {
    switch (true) {
      case first:
        return `
        margin: 4% 0 0 0;
        `;
    }
  }}
            padding: 3% 30px;
            border-bottom-color: #eaeaea;
            border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
            `;

const Column = styled.View`
  flex-direction: column;
  ${({ location }) => {
    switch (true) {
      case location:
        return `
          width: 50%;
          `;
    }
  }};
`;

const CardOptionItem = styled.TouchableOpacity`
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 10px 30px;
            width: 100%;
            border-bottom-color: #eaeaea;
            border-bottom-width: 1px;
            `;

const CardOptionComplete = styled.TouchableOpacity`
            flex-direction: row;
            justify-content: center;
            align-items: center;
            align-self: center;
            margin: 8% 4%;
            color: white;
            border-radius: 28px;
            background: #17a525;
            padding: 16px 40px;
            `;

const Button = styled.TouchableOpacity`
            ${({ decline, accept, row }) => {
    switch (true) {
      case accept:
        return `
        background: #00a0e5; 
        padding: 10px 40px; 
        border-radius: 8px;
        `;

      case decline:
        return `
        border: 1px solid red; 
        background: white; 
        padding: 10px 40px; 
        border-radius: 8px;
        `;
    }
  }};
            `;

const JobItemRow = styled.View`
            background: white;
            padding: 10px;
            flex-direction: row;
            width: 100%;
            border: 1px solid #f5f5f5;
            `;
