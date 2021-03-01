// IMPORT
// Expo
import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome } from "@expo/vector-icons";
import { TextField } from "@ubaids/react-native-material-textfield";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Platform, View } from "react-native";
import Modal from "react-native-modal";
import StarRating from "react-native-star-rating";
import styled from "styled-components/native";
import Card from "../../../../components/card_animated";
import Confirm from "../../../../components/confirm";
import { GlobalContext, UIOverlayContext } from "../../../../components/context";
import Text from "../../../../components/text";
// Controllers
import AnimationsController from "../../../../controllers/AnimationsControllers";
import JobsController from "../../../../controllers/JobsControllers";
import { default as config } from "../../../../env";
import { sendNotification } from "../../../../functions";
import { getPriorityColor, priorityMap } from "../../listings/listingItem";
import PhotoItem from "../../listings/listItemImage";

const deviceHeight = Dimensions.get("window").height;

// BODY
export default function JobFound({ job_data: job_data_prop, keyword, navigation }) {
  const { authState } = useContext(GlobalContext);
  const { changeRoute } = useContext(UIOverlayContext);

  // Constructor
  const [projectManager, setProjectManager] = useState({});
  const [occupation, setOccupation] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState([]);
  const [starRate, setStarRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enableNegotiation, setEnableNegotiation] = useState(false);
  const [job_data, set_job_data] = useState(job_data_prop);
  const cardRef = useRef(null);

  // Tracks when the job is accepted
  let data = useMemo(() => ({ accepted: false }), [navigation])

  useEffect(() => {
    (async () => {
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
      setName(`${project_manager.first_name} ${project_manager.last_name}`);
      setOccupation(project_manager.occupation);
      setStarRate(Number(project_manager.star_rate));
      setDescription(job_data.tasks);
      setLoading(false);
    })();
  }, []);

  // Monitor page and change the job status back to being available when user leaves the screen
  useEffect(() => {
    let reset = false;
    const unsubscribe = navigation.addListener("beforeRemove", async (e) => {
      e.preventDefault();
      if (!data.accepted && job_data.offer_received && job_data.offer_received.deployee === authState.userID) {
        return await new Promise((res) => {
          Confirm({
            title: "Cancel Job Offer?",
            message: "Job will become available in the job pool",
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0,
            options: ["Yes", "No"],
            onPress: async (i) => {
              if (i === 0) {
                setLoading(true);
                try {
                  await JobsController.cancelOffer(job_data._id);
                  delete job_data.offer_received;
                  set_job_data(job_data);
                  await sendNotification(authState.userToken, projectManager._id, {
                    title: `GigChasers - ${job_data.job_title}`,
                    body: `Offer declined`,
                    data: { type: "offerdecline", id: job_data._id, sender: authState.userID },
                  });
                  reset = true;
                  delete job_data.offer_received;
                  set_job_data(job_data);
                  return res(navigation.dispatch(e.data.action));
                } catch (e) {
                  console.log(e);
                } finally {
                  setLoading(false);
                }
              }
            },
            onCancel: res,
          });
        });
      } else if (!data.accepted) {
        await JobsController.changeJobStatus(job_data._id, "available");
        reset = true;
      }
      return navigation.dispatch(e.data.action);
    });

    return () => {
      if (!reset && !job_data.offer_received && !data.accepted) {
        JobsController.changeJobStatus(job_data._id, "available");
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [navigation]);

  const handleJobDecline = async () => {
    try {
      if (job_data.offer_received && job_data.offer_received.deployee === authState.userID) {
        await new Promise((res) => {
          Confirm({
            title: "Cancel Job Offer?",
            message: "Job will become available in the job pool",
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0,
            options: ["Yes", "No"],
            onPress: async (i) => {
              if (i === 0) {
                setLoading(true);
                try {
                  await JobsController.cancelOffer(job_data._id);
                  delete job_data.offer_received;
                  set_job_data(job_data);
                  await sendNotification(authState.userToken, projectManager._id, {
                    title: `GigChasers - ${job_data.job_title}`,
                    body: `Offer declined`,
                    data: { type: "offerdecline", id: job_data._id, sender: authState.userID },
                  });
                  changeRoute({ name: "searching", props: { keyword } });
                } catch (e) {
                  console.log(e);
                } finally {
                  setLoading(false);
                }
                res();
              }
            },
            onCancel: res,
          });
        });
      } else {
        await sendNotification(authState.userToken, projectManager._id, {
          title: `GigChasers - ${job_data.job_title}`,
          body: `Job declined`,
          data: { type: "jobdecline", id: job_data._id, sender: authState.userID },
        });
        await JobsController.changeJobStatus(job_data._id, "available");
        // Add job to "already"
        changeRoute({ name: "searching", props: { keyword } });
      }
    } catch (E) {
      console.log(e);
    }
  };

  const handleJobApprove = () => {
    AnimationsController.CardUISlideOut(
      cardRef,
      async () => {
        try {
          data.accepted = true
          await JobsController.acceptJob(job_data._id, authState);
          await sendNotification(authState.userToken, projectManager._id, {
            title: `GigChasers - ${job_data.job_title}`,
            body: `Job accepted`,
            data: { type: "jobaccept", id: job_data._id, sender: authState.userID },
          });

          //TODO: Save job ID in local storage to retrieve it later on.
          changeRoute({ name: "acceptedJob", props: { projectManagerInfo: projectManager, job_data } });
        } catch (e) {
          console.log(e, "job approve");
          Alert.alert("Please Try Again", "Failed to accept job");
        }
      },
      true
    );
  };

  const handleCounterApprove = () => {
    AnimationsController.CardUISlideOut(
      cardRef,
      async () => {
        try {
          await JobsController.counterApprove(job_data._id, job_data.offer_received.counterOffer, authState);
          data.accepted = true
          await sendNotification(authState.userToken, projectManager._id, {
            title: `GigChasers - ${job_data.job_title}`,
            body: `Offer accepted`,
            data: { type: "offeraccept", id: job_data._id, sender: authState.userID },
          });

          //TODO: Save job ID in local storage to retrieve it later on.
          changeRoute({ name: "acceptedJob", props: { projectManagerInfo: projectManager, job_data } });
        } catch (e) {
          console.log(e, "counter offer approve");
          Alert.alert("Please Try Again", "Failed to accept counter offer");
        }
      },
      true
    );
  };

  const handleStartNegotiation = useCallback(async () => {
    setEnableNegotiation(true);
  }, []);

  if (!loading) {
    return enableNegotiation ? (
      <NegotiationView
        deployee={authState.userID}
        onCancel={() => setEnableNegotiation(false)}
        onSubmit={(job) => {
          setEnableNegotiation(false);
          sendNotification(authState.userToken, projectManager._id, {
            title: `GigChasers - ${job_data.job_title}`,
            body: `Offer received`,
            data: { type: "offerreceive", id: job_data._id, sender: authState.userID },
          });
          set_job_data(job);
        }}
        job_data={job_data}
      />
    ) : (
        <Card ref={cardRef}>
          <View>
            <ProfilePicture
              source={{
                uri: `${config.API_URL}${job_data.posted_by_profile_picture}`,
              }}
            ></ProfilePicture>

            <Row first>
              <Column>
                <Text title bold marginBottom="5px">
                  {name}
                </Text>
                <Text small light marginBottom="5px">
                  {occupation}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text bold marginBottom="5px">
                    <FontAwesome name="map-marker" size={24} color="black" />
                  </Text>
                  <Text style={{ marginLeft: 10 }} bold>
                    13 min
                </Text>
                </View>
              </Column>
              <Column>
                {/* Iterate from array of data pulled from server and render as stars */}
                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                  <StarRating disabled={true} maxStars={5} rating={starRate} starSize={25} />
                </View>
                <Text style={{ textAlign: "center" }} bold>
                  {starRate}
                </Text>
              </Column>
            </Row>

            <Row>
              <JobDescriptionRow>
                <JobDescription>
                  <Text small light marginBottom="5px">Job Description</Text>
                  <Text small marginBottom="5px">
                    ${job_data.salary}/{job_data.wage}
                  </Text>
                </JobDescription>

                {description.map((item) => {
                  return <Text key={item.id}>{item.text}</Text>;
                })}

                <JobDescription style={{ marginTop: 5, alignItems: 'center' }}>
                  <Text small light>Priority</Text>
                  {!!job_data.priority &&
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <Text small textTransform='uppercase' style={{ fontSize: 12 }}>{priorityMap[job_data.priority]}</Text>
                      <FontAwesome name="exclamation-triangle" color={getPriorityColor(job_data.priority)} style={{ marginStart: 8 }} />
                    </View>
                  }
                </JobDescription>

              </JobDescriptionRow>
            </Row>

            {job_data.photo_files && job_data.photo_files.length > 0 && (
              <Row>
                <PhotosRow>
                  <JobDescription>
                    <Text small light marginBottom="5px">
                      Photos
                  </Text>
                  </JobDescription>

                  <FlatList
                    data={job_data.photo_files}
                    keyExtractor={(v) => v}
                    centerContent
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={({ item }) => <PhotoItem key={item} item={{ uri: `${config.API_URL}/job/${job_data._id}/${item}` }} />}
                  />
                </PhotosRow>
              </Row>
            )}

            <CardOptionItem row>
              <Text small>Reviews</Text>
            </CardOptionItem>

            {job_data.offer_received && job_data.offer_received.deployee === authState.userID ? (
              job_data.offer_received.counterOffer ? (
                <>
                  <Row style={{ paddingHorizontal: 20, paddingTop: 12, borderBottomWidth: 0, justifyContent: 'space-between' }}>
                    <Text small light marginBottom="5px">Counter Offer</Text>
                    <Text small marginBottom="5px">
                      ${job_data.offer_received.counterOffer}/{job_data.offer_received.counterWage}
                    </Text>
                  </Row>
                  <Button
                    accept
                    style={{ marginHorizontal: 24, marginVertical: 12, justifyContent: "center" }}
                    onPress={handleCounterApprove}
                  >
                    <Text style={{ color: "white", textAlign: "center" }} medium>Accept Counter</Text>
                  </Button>
                </>
              ) : (
                  <Button negotiationSent style={{ marginHorizontal: 24, marginVertical: 12, justifyContent: "center" }} disabled>
                    <Text style={{ color: "white", textAlign: "center" }} medium>
                      Offer Sent
                </Text>
                  </Button>
                )
            ) : (
                <Button
                  negotiate
                  style={{ marginHorizontal: 24, marginVertical: 12, justifyContent: "center" }}
                  onPress={handleStartNegotiation}
                >
                  <Text style={{ color: "#00bfff", textAlign: "center" }} medium>
                    Negotiate Offer
              </Text>
                </Button>
              )}

            <Row last>
              <Column>
                <Button decline onPress={() => handleJobDecline()}>
                  <Text style={{ color: "red" }} medium>
                    Decline
                </Text>
                </Button>
              </Column>

              {job_data.offer_received && job_data.offer_received.deployee === authState.userID ? null : (
                <Column>
                  <Button accept onPress={() => handleJobApprove()}>
                    <Text style={{ color: "white" }} medium>
                      Accept
                  </Text>
                  </Button>
                </Column>
              )}
            </Row>
          </View>
        </Card>
      );
  } else {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}

const NegotiationView = ({ job_data, deployee, onCancel, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState("");
  const [unit, setUnit] = useState(job_data.wage || 'deployment')

  const { showActionSheetWithOptions } = useActionSheet()

  const onSubmitOffer = useCallback(async () => {
    if (salary) {
      setLoading(true);

      const offer = parseFloat(salary).toFixed(2);
      if (Number.isNaN(offer) || isNaN(offer)) {
        return;
      }
      await new Promise(async (res) => {
        Confirm({
          title: "Confirm Offer",
          message: `Suggest offer of $${offer}/${unit} to deployer to complete this job?`,
          options: ["Yes", "No"],
          cancelButtonIndex: 1,
          onPress: async (number) => {
            if (number === 0) {
              // Save offer
              try {
                const offer_received = await JobsController.sendOffer(job_data._id, deployee, offer, unit);
                job_data.offer_received = offer_received;
                onSubmit(job_data);
              } catch (e) {
                console.log(e, "negotiation send failed");
                Alert.alert("Failed to confirm offer");
              }
            }
            res();
          },
          onCancel: res,
        });
      });

      setLoading(false);
    }
  }, [loading, deployee, job_data, salary, unit]);

  return (
    <Modal coverScreen avoidKeyboard swipeDirection='down' onSwipeComplete={onCancel} isVisible>
      <View style={{ backgroundColor: "#fff", borderRadius: 40, paddingVertical: 16 }}>
        <Row>
          <JobDescriptionRow>
            <JobDescription>
              <Text small light marginBottom="5px">
                Current Offer
              </Text>
              <Text small marginBottom="5px">
                ${job_data.salary}/{job_data.wage}
              </Text>
            </JobDescription>

            <Text small style={{ textTransform: "uppercase", marginVertical: 16, textAlign: "center" }} bold>
              What offer would you complete this job for?
            </Text>

            <View style={{ marginVertical: 10, alignItems: 'stretch', justifyContent: 'center', }}>
              <WageInput style={{ alignItems: 'stretch' }}>
                <SalaryField style={{ alignItems: 'stretch' }}>
                  <TextField
                    disabled={loading}
                    label="PAY"
                    prefix="$"
                    suffix={`/${unit}`}
                    labelFontSize={14}
                    placeholder="0.00"
                    labelTextStyle={{ color: "grey", fontWeight: "700" }}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setSalary(text);
                    }}
                    value={salary}
                    onSubmitEditing={onSubmitOffer}
                  />
                </SalaryField>
              </WageInput>
            </View>
          </JobDescriptionRow>
        </Row>

        <Row last>
          <Column style={{ alignItems: "center" }}>
            <Button disabled={loading} decline onPress={onCancel}>
              <Text style={{ color: "red" }} medium>
                Cancel
              </Text>
            </Button>
          </Column>
          <Column>
            <Button disabled={loading} style={{ flexDirection: "row" }} accept onPress={onSubmitOffer}>
              {loading ? <ActivityIndicator animating style={{ marginEnd: 4 }} color="white" /> : null}
              <Text style={{ color: "white" }} medium>
                Save
              </Text>
            </Button>
          </Column>
        </Row>
      </View>
    </Modal>
  );
};

// STYLES
// const Card = styled.SafeAreaView`
//   position: absolute;
//   left: 0;
//   bottom: 0;
//   border-top-left-radius: 40px;
//   border-top-right-radius: 40px;
//   box-shadow: -10px 0px 20px #999;
//   background: white;
//   width: 100%;
// `;

const WageInput = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ProfilePicture = styled.Image`
  margin: -35px auto;
  height: 70px;
  width: 70px;
  border-radius: 50px;
`;

const SalaryField = styled.View`
  flex: 1;
  flex-direction: column;
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
`;

const JobDescriptionRow = styled.View`
  flex: 1;
  flex-direction: column;
`;

const PhotosRow = styled.View`
  flex: 1;
  flex-direction: column;
  margin-bottom: 4;
`;

const CardOptionItem = styled.TouchableOpacity`
  padding: 10px 30px;
  width: 100%;
  border-bottom-color: #eaeaea;
  border-bottom-width: 1px;
`;

const Button = styled.TouchableOpacity`
  ${({ decline, accept, negotiate, negotiationSent, row }) => {
    switch (true) {
      case accept:
        return `
        background: #228b22; 
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

      case negotiate:
        return `
        border-color: #00bfff;
        border-width: 1px;
        text-align: center;
        padding: 10px 40px; 
        border-radius: 8px;
        `;

      case negotiationSent:
        return `
        background-color: slategray;
        text-align: center;
        padding: 10px 40px; 
        border-radius: 8px;
        `;
    }
  }};
`;

const JobDescription = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const RateTouchable = styled.TouchableOpacity`
  padding: 4px 12px;
  background-color: #fafafa;
  margin: 0 2px
`;

