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


const deviceHeight = Dimensions.get("window").height;



// BODY
export default function ListingItemSelected({ navigation }) {
  const { authState } = useContext(GlobalContext);
  const { listing: job_data, setListing } = useContext(LISTING_CONTEXT)
  const { changeRoute } = useContext(UIOverlayContext);
  const [isCanceling, setIsCanceling] = useState(false);
  const [deployeeInfo, setDeployeeInfo] = useState({});
  const [showReport, setShowReport] = useState(false)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!job_data?.id) {
      changeRoute({ name: "dashboard" })
    } else {
      (async () => {
        if (job_data) {
          const response = await fetch(`${config.API_URL}/users/${job_data.executed_by}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authState.userToken}`,
              "Content-type": "application/json",
            },
          });
          const deployee = await response.json();
          deployee._id = job_data.executed_by;
          setDeployeeInfo(deployee);
          setLoading(false);
        }
      })();
    }
  }, [job_data?.id]);

  const cancelJob = useCallback(() => {
    Confirm({
      title: "Cancel",
      message: 'Do you want to cancel this gig or go back to the application?',
      options: ["Cancel Job", "Go Back", "Cancel"],
      cancelButtonIndex: 2,
      destructiveButtonIndex: 0,
      onPress: async (i) => {
        if (i === 0) {
          Confirm({
            title: "Cancel Job?",
            message: `Cancelling a job outside the cancellation window will attract a penalty`,
            options: ["Yes", "No"],
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
        } else if (i === 1) {
          navigation.navigate("Job Listings")
          setListing(null)
        }
      },
    });
  }, [authState]);

  return (
    <Card>
      {!loading && job_data ?
        <>
          <View>
            <View style={{
              shadowColor: "black",
              shadowOpacity: 0.4,
              shadowRadius: 7,
              shadowOffset: {
                width: 5,
                height: 5,
              }
            }} >
              <ProfilePicture
                source={{
                  uri: `${env.API_URL}/images/${job_data.executed_by}.jpg`,
                }}
                style={{ backgroundColor: '#dadada' }}
              ></ProfilePicture>
            </View>
            <Row style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }} first>
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
                    <Button disabled={isCanceling} accept onPress={() => navigation.navigate("Chat", { receiver: job_data.executed_by })}>
                      <Text style={{ color: "white" }} medium>
                        Message
                      </Text>
                    </Button>
                  </Column>
                </View>
              </Column>
            </Row>
            <CardOptionItem disabled={isCanceling} row onPress={() => navigation.navigate("Scanner", { job_data })}>
              <Text small bold color={colors.primary}>
                Scan QR Code
              </Text>
              <Ionicons name="ios-arrow-forward" size={24} />
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

            <TouchableOpacity style={{
              paddingVertical: 24, marginTop: 8,
              justifyContent: 'center', alignItems: 'center',
            }} disabled={isCanceling} activeOpacity={0.8} onPress={cancelJob} >
              {isCanceling ?
                <ActivityIndicator size='small' color='#222' />
                :
                <Text color="#222">Cancel</Text>
              }
            </TouchableOpacity>
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
