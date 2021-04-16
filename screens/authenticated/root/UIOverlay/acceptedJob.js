// IMPORT
import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Platform, Dimensions, Alert } from "react-native";
import styled from "styled-components/native";

// Expo
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { watchPositionAsync } from "expo-location";
import env from "../../../../env";

// Components
// import Card from "../../../../components/card";
import Text from "../../../../components/text";

// Styling
const deviceHeight = Dimensions.get("window").height;
import { UIOverlayContext, GlobalContext } from "../../../../components/context";
import { colors } from "react-native-elements";

// Miscellaneous
import { distanceBetweenTwoCoordinates } from "../../../../functions/";

// Controllers
import PermissionsControllers from "../../../../controllers/PermissionsControllers";
import { PaymentMethodSelector } from "../../payment/components";
import { TouchableOpacity } from "react-native";
import JobsController from "../../../../controllers/JobsControllers";
import { sendNotification } from "../../../../functions";
import Confirm from "../../../../components/confirm";
import { ActivityIndicator } from "react-native";
import GigChaserJobWord from "../../../../assets/gig-logo";

// BODY
export default function Screen45({ navigation, projectManagerInfo, job_data }) {
  const { authState } = useContext(GlobalContext);
  const { changeRoute } = useContext(UIOverlayContext);
  const [isCanceling, setIsCanceling] = useState(false);

  const [onSite, setOnSite] = useState(false);
  const [location, setLocation] = useState(null);

  // get location real time
  useEffect(() => {
    const subscription = watchPositionAsync({ distanceInterval: 2, timeInterval: 1000 }, (position) => {
      setLocation(position);
    });

    return () => {
      if (subscription) {
        // console.log("removed");
        subscription.then(({ remove }) => remove());
      }
    };
  }, []);

  useEffect(() => {
    if (location) {
      const userLocation = location.coords;
      const jobLocation = job_data.coordinates;

      // console.log("user", userLocation);
      // console.log("job", jobLocation);

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
      <View>
        <ProfilePicture
          source={{
            uri: `${env.API_URL}${job_data.posted_by_profile_picture}`,
          }}
        ></ProfilePicture>

        <Row first>
          <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text title bold marginBottom="5px">
              {projectManagerInfo.first_name} {projectManagerInfo.last_name}
            </Text>
            <Text small light marginBottom="5px">
              Domestic Worker
            </Text>
          </Column>

          <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity disabled={isCanceling} activeOpacity={0.8} onPress={cancelJob}>
              {isCanceling ?
                <ActivityIndicator size='small' color='888' />
                :
                <Text style={{ paddingBottom: 10 }} color="#999">Cancel Job</Text>
              }
            </TouchableOpacity>

            <Column>
              <View style={{ flexDirection: "row" }}>
                <Column
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                  }}
                >
                  <FontAwesome name="star" size={24} color="black" />
                </Column>

                <Column style={{ paddingLeft: 5, justifyContent: "center" }}>
                  <Text bold>{projectManagerInfo.star_rate}</Text>
                </Column>
              </View>

              <View style={{ flexDirection: "row" }}>
                <Column
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 24,
                    height: 24,
                  }}
                >
                  <FontAwesome name="map-marker" size={24} color="black" />
                </Column>

                <Column style={{ paddingLeft: 5, justifyContent: "center" }}>
                  <Text bold>15 min.</Text>
                </Column>
              </View>
            </Column>
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
        <CardOptionItem disabled={isCanceling} row onPress={() => navigation.navigate("QR Code", { job_data })}>
          <Text small bold color={onSite ? colors.primary : "grey"}>
            QR Code {onSite && " - Proceed"}
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

        <CardOptionItem onPress={() => navigation.navigate('Report Job', { job_data })} disabled={isCanceling} row>
          <Text small>Report Job</Text>
          <Ionicons name="ios-arrow-forward" size={24} />
        </CardOptionItem>

        <CardOptionComplete activeOpacity={0.6} onPress={() => {
          navigation.navigate('Complete Job', { job_data })
        }} disabled={isCanceling} row>
          <>
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>Complete</Text>
            <GigChaserJobWord color="white" width="60px" height="18" style={{ marginHorizontal: 0 }} />
          </>
        </CardOptionComplete>
      </View>
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
`;

const ProfilePicture = styled.Image`
  margin: -35px auto;
  height: 70px;
  width: 70px;
  border-radius: 50px;
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
