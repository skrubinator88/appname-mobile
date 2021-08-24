import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { watchPositionAsync } from "expo-location";
import moment from "moment";
import { unix } from "moment";
import { duration } from "moment";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { colors } from "react-native-elements";
import styled from "styled-components/native";
import GigChaserJobWord from "../../../../assets/gig-logo";
import Confirm from "../../../../components/confirm";
import { GlobalContext, UIOverlayContext } from "../../../../components/context";
import Text from "../../../../components/text";
import { JOB_CONTEXT } from "../../../../contexts/JobContext";
import { USER_LOCATION_CONTEXT } from "../../../../contexts/userLocation";
import JobsController from "../../../../controllers/JobsControllers";
import env, { default as config } from "../../../../env";
import { getPriorityMinutes, sendNotification } from "../../../../functions";
import { distanceBetweenTwoCoordinates } from "../../../../functions/";
import ReportJob from "./reportJob";

// BODY
export default function Screen45({ navigation }) {
  const { authState } = useContext(GlobalContext);
  const { current: job_data, updateLiveLocation: _updateLiveLocation } = useContext(JOB_CONTEXT)
  const { location: currentLocation } = useContext(USER_LOCATION_CONTEXT)
  const { changeRoute } = useContext(UIOverlayContext);
  const [isCanceling, setIsCanceling] = useState(false);
  const [projectManagerInfo, setProjectManager] = useState({});
  const [onSite, setOnSite] = useState(false);
  const [location, setLocation] = useState(null);
  const [showReport, setShowReport] = useState(false)
  const [loading, setLoading] = useState(true);
  const debounceTimer = useRef();

  const updateLiveLocation = (...props) => {
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => _updateLiveLocation(...props), 5000)
  }

  const isInProgress = job_data?.status === 'in progress';
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const animation = Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 3,
        duration: 400,
        useNativeDriver: false
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false
      }),
      Animated.timing(pulseAnim, {
        toValue: 4,
        duration: 600,
        useNativeDriver: false
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false
      })
    ]),
  );

  useEffect(() => {
    if (isInProgress) {
      animation.start()
    } else {
      animation.stop()
      animation.reset()
    }
  }, [isInProgress])

  useEffect(() => {
    (async () => {
      if (job_data) {
        const response = await fetch(`${config.API_URL}/users/${job_data.posted_by}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.userToken}`,
            "Content-type": "application/json",
          },
        });
        const project_manager = await response.json();
        project_manager._id = job_data.posted_by;

        setProjectManager(project_manager);
        setLoading(false);
      }
    })();
  }, [job_data?.id]);

  // get location real time
  useEffect(() => {
    if (currentLocation?.coords) {
      updateLiveLocation(currentLocation.coords.longitude, currentLocation.coords.latitude)
    }

    const subscription = watchPositionAsync({ distanceInterval: 1, timeInterval: 10000 }, (position) => {
      setLocation(position);
      updateLiveLocation(position.coords.longitude, position.coords.latitude)
    });

    return () => {
      if (subscription) {
        subscription.then(({ remove }) => remove());
      }
    };
  }, [currentLocation, isInProgress]);

  useEffect(() => {
    if (location) {
      const userLocation = location.coords;
      const jobLocation = job_data.coordinates;

      // get distance between points in miles
      const distance = distanceBetweenTwoCoordinates(userLocation.latitude, userLocation.longitude, jobLocation["U"], jobLocation["k"]);

      // console.log("distance", `${distance} in miles`);

      //  0.251866 is the sum of the radius of the 2 points in miles
      if (distance < 0.2499363724) {
        setOnSite(true); // Inside
      } else {
        setOnSite(false); // Outside
      }
    }
  }, [location]);

  const cancelJob = useCallback(() => {
    const acceptedTime = unix((job_data.date_accepted.toMillis()) / 1000)
    const now = new Date()
    const timeDifference = moment(now).diff(acceptedTime, 'minutes')
    Confirm({
      title: "Are you sure you want to cancel the job ?",
      message: job_data.priority && timeDifference > getPriorityMinutes(job_data.priority) ? `You have ${timeDifference} more minutes to cancel without attracting a penalty` : `Cancelling a job outside the cancellation window may attract a penalty`,
      options: ["Cancel Job", "Never Mind"],
      cancelButtonIndex: 1,
      destructiveButtonIndex: 0,
      onPress: async (i) => {
        if (i === 0) {
          try {
            setIsCanceling(true)
            await JobsController.cancelAcceptedJob(job_data._id, authState)
            await sendNotification(authState.userToken, job_data.posted_by, { title: `GigChasers - ${job_data.job_title}`, body: `Job canceled`, data: { type: 'jobcancel', id: job_data._id, sender: authState.userID } })
            setIsCanceling(false)
            changeRoute({ name: "dashboard" })
          } catch (e) {
            console.log(e)
            setIsCanceling(false)
            Alert.alert('Failed To Cancel Job', e.message)
          }
        }
      },
    });
  }, [authState]);

  return (
    <Card>
      {!loading && job_data ?
        <>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate("ProfilePage", { userData: projectManagerInfo })} style={{
              shadowColor: "black",
              shadowOpacity: 0.4,
              shadowRadius: 7,
              shadowOffset: {
                width: 5,
                height: 5,
              }
            }} >
              <Animated.Image
                source={{
                  uri: `${env.API_URL}${job_data.posted_by_profile_picture}`,
                }}
                style={{
                  backgroundColor: '#dadada',
                  marginVertical: -60,
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginBottom: -20,
                  height: 96,
                  width: 96,
                  borderRadius: 48,
                  borderColor: isInProgress ? `#2f2` : "white",
                  borderWidth: pulseAnim,
                }}
              />
            </TouchableOpacity>
            <Row first>
              <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text title align='center' bold marginBottom="5px">
                  {projectManagerInfo.first_name} {projectManagerInfo.last_name}
                </Text>
                <Text small light marginBottom="5px">
                  {projectManagerInfo.occupation}
                </Text>
              </Column>

              <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={{
                  borderRadius: 8, padding: 8, marginBottom: 8,
                  borderWidth: StyleSheet.hairlineWidth,
                  justifyContent: 'center', alignItems: 'center',
                  borderColor: '#888'
                }} disabled={isCanceling} activeOpacity={0.8} onPress={cancelJob} >
                  {isCanceling ?
                    <ActivityIndicator size='small' color='#888' />
                    :
                    <Text color="#999">Cancel Job</Text>
                  }
                </TouchableOpacity>

                <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                  <FontAwesome name="map-marker" size={24} color="red" />

                  <Column style={{ paddingLeft: 2, justifyContent: "center" }}>
                    <Text bold>15 min.</Text>
                  </Column>
                </View>
              </Column>
            </Row>

            <Row>
              <Column style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  {/* <Column location>
                <Text small light marginBottom="5px">
                  Location
                </Text>
                <Text small>{job_data.location.address}</Text>
              </Column> */}

                  <Column style={{ justifyContent: "center" }}>
                    <Button disabled={isCanceling} accept onPress={() => navigation.navigate("Chat", { receiver: job_data.posted_by })}>
                      <Text style={{ color: "white" }} medium>
                        Message
                      </Text>
                    </Button>
                  </Column>
                </View>
              </Column>
            </Row>
            {!isInProgress &&
              <CardOptionItem disabled={isCanceling} row onPress={() => navigation.navigate("QR Code", { job_data })}>
                <Text small bold color={onSite ? colors.primary : "grey"}>
                  QR Code {onSite && " - Proceed"}
                </Text>
                <Ionicons name="ios-arrow-forward" size={24} />
              </CardOptionItem>
            }

            <CardOptionItem disabled={isCanceling} row onPress={() => navigation.navigate("Job Details", { data: job_data })}>
              <Text small>View Job Description</Text>
              <Ionicons name="ios-arrow-forward" size={24} />
            </CardOptionItem>

            {/* <CardOptionItem row>
          <Text small>View Profile</Text>
          <Ionicons name="ios-arrow-forward" size={24} />
        </CardOptionItem> */}

            <CardOptionItem onPress={() => setShowReport(true)} disabled={isCanceling} row>
              <Text small>Report Job</Text>
              <Ionicons name="ios-arrow-forward" size={24} />
            </CardOptionItem>

            <CardOptionComplete activeOpacity={0.6} onPress={() => {
              navigation.navigate('Complete Job', { job_data })
            }} disabled={isCanceling}>
              <>
                <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Complete</Text>
                <GigChaserJobWord color="white" width="60px" height="18" style={{ marginHorizontal: 0 }} />
              </>
            </CardOptionComplete>
          </View>
          <ReportJob onReportSuccess={() => changeRoute({ name: 'dashboard' })} job_data={job_data} isVisible={showReport} onCancel={() => setShowReport(false)} />
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
