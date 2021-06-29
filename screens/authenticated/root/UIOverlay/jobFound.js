// IMPORT
// Expo
import { FontAwesome } from "@expo/vector-icons";
import { TextField } from "@ubaids/react-native-material-textfield";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, SafeAreaView, View } from "react-native";
import Modal from "react-native-modal";
import StarRating from "react-native-star-rating";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import Card from "../../../../components/card_animated";
import Confirm from "../../../../components/confirm";
import { GlobalContext } from "../../../../components/context";
import Text from "../../../../components/text";
import { JOB_CONTEXT } from "../../../../contexts/JobContext";
// Controllers
import AnimationsController from "../../../../controllers/AnimationsControllers";
import JobsController from "../../../../controllers/JobsControllers";
import { getPaymentInfo } from "../../../../controllers/PaymentController";
import { default as config } from "../../../../env";
import { sendNotification } from "../../../../functions";
import { getPriorityColor, priorityMap } from "../../listings/listingItem";
import PhotoItem from "../../listings/listItemImage";

export default function JobFound({ navigation }) {
  const { authState } = useContext(GlobalContext);
  const { current: job_data } = useContext(JOB_CONTEXT)

  const [projectManager, setProjectManager] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState([]);
  const [starRate, setStarRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enableNegotiation, setEnableNegotiation] = useState(false);
  const cardRef = useRef(null);
  const decisionTimer = useRef(undefined);
  // Tracks when the job is accepted
  let data = useMemo(() => ({ accepted: false }), [navigation]);
  const dispatch = useDispatch();
  const { hasActiveAccount } = useSelector((state) => state.payment)

  useEffect(() => {
    getPaymentInfo(authState, dispatch).catch(e => {
      console.log(e);
    });
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
        project_manager.id = job_data.posted_by;
        setProjectManager(project_manager);
        setName(`${project_manager.first_name} ${project_manager.last_name}`);
        setStarRate(Number(project_manager.star_rate));
        setDescription(job_data.tasks);
        setLoading(false);
      }
    })();
  }, [job_data?.id]);

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

                  await sendNotification(authState.userToken, projectManager._id, {
                    title: `GigChasers - ${job_data.job_title}`,
                    body: `Offer declined`,
                    data: { type: "offerdecline", id: job_data._id, sender: authState.userID },
                  });
                  reset = true;
                  delete job_data.offer_received;
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

  // Used to exit page if in review state after 15 minutes
  useEffect(() => {
    clearTimeout(decisionTimer.current)
    // This resets the timer each time an action happens, preventing an exit while loading
    if (!loading) {
      decisionTimer.current = setTimeout(() => {
        if (job_data.offer_received && job_data.offer_received.deployee === authState.userID) {
          return
        }
        Alert.alert("Session Timeout", "Review session has timed out and this Gig has returned to the pool",
          [{
            onPress: async () => {
              await JobsController.changeJobStatus(job_data._id, "available");
            },
            style: 'default'
          }])
      }, 15 * 60 * 1000)
    }
    return () => {
      clearTimeout(decisionTimer.current)
    }
  }, [decisionTimer, loading])

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
                  await sendNotification(authState.userToken, projectManager._id, {
                    title: `GigChasers - ${job_data.job_title}`,
                    body: `Offer declined`,
                    data: { type: "offerdecline", id: job_data._id, sender: authState.userID },
                  });
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleJobApprove = () => {
    AnimationsController.CardUISlideOut(
      cardRef,
      async () => {
        try {
          if (!hasActiveAccount) {
            Alert.alert("Setup Account", "You need to setup your accont to continue", [
              {
                onPress: () => {
                  cardRef?.current?.slideIn();
                  navigation.navigate('Payments')
                },
                style: 'default',
                text: 'Manage Payments',
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: cardRef?.current?.slideIn
              }
            ])
            return
          }
          setLoading(true);
          data.accepted = true;
          await JobsController.acceptJob(job_data._id, authState);
          await sendNotification(authState.userToken, projectManager._id, {
            title: `GigChasers - ${job_data.job_title}`,
            body: `Job accepted`,
            data: { type: "jobaccept", id: job_data._id, sender: authState.userID },
          });
        } catch (e) {
          console.log(e, "job approve");
          Alert.alert("Please Try Again", e.message || "Failed to accept job", [{ style: "cancel", onPress: cardRef?.current?.slideIn }]);
        } finally {
          setLoading(false);
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
          if (!hasActiveAccount) {
            Alert.alert("Setup Account", "You need to setup your accont to continue", [
              {
                onPress: () => {
                  cardRef?.current?.slideIn();
                  navigation.navigate('Payments')
                },
                style: 'default',
                text: 'Manage Payments',
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: cardRef?.current?.slideIn
              }
            ])
            return
          }
          setLoading(true);
          await JobsController.counterApprove(job_data._id, job_data.offer_received.counterOffer, authState);
          data.accepted = true;
          await sendNotification(authState.userToken, projectManager._id, {
            title: `GigChasers - ${job_data.job_title}`,
            body: `Offer accepted`,
            data: { type: "offeraccept", id: job_data._id, sender: authState.userID },
          });
        } catch (e) {
          console.log(e, "counter offer approve");
          Alert.alert("Please Try Again", e.message || "Failed to accept counter offer", [{ style: "cancel", onPress: cardRef?.current?.slideIn }]);
        } finally {
          setLoading(false);
        }
      },
      true
    );
  };

  const handleStartNegotiation = useCallback(async () => {
    setEnableNegotiation(true);
  }, []);

  return (
    <>
      {(!loading && enableNegotiation) && (
        <NegotiationView
          navigation={navigation}
          hasActiveAccount={hasActiveAccount}
          deployee={authState.userID}
          onCancel={() => setEnableNegotiation(false)}
          onSubmit={() => {
            setEnableNegotiation(false);
            sendNotification(authState.userToken, projectManager._id, {
              title: `GigChasers - ${job_data.job_title}`,
              body: `Offer received`,
              data: { type: "offerreceive", id: job_data._id, sender: authState.userID },
            });
          }}
          job_data={job_data}
        />
      )}
      <Card ref={cardRef}>
        {!loading && job_data ?
          <View>
            <View style={{
              shadowColor: "black",
              shadowOpacity: 0.4,
              shadowRadius: 7,
              shadowOffset: {
                width: 5,
                height: 5,
              }
            }}>
              <ProfilePicture
                source={{
                  uri: `${config.API_URL}${job_data.posted_by_profile_picture}`,
                }}
                style={{ backgroundColor: '#dadada' }}
              />
            </View>
            <Row first style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Column>
                <Text title bold marginBottom="5px">
                  {name}
                </Text>
                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: "center" }}>
                  <Text bold marginBottom="5px">
                    <FontAwesome name="map-marker" size={16} color="red" />
                  </Text>
                  <Text style={{ marginLeft: 4 }} bold>
                    13 min
                  </Text>
                </View>
              </Column>
            </Row>

            <Row>
              <JobDescriptionRow>
                <JobDescription>
                  <Text small light marginBottom="5px">
                    Job Description
                  </Text>
                  <Text small marginBottom="5px">
                    ${job_data.salary}/{job_data.wage || 'deployment'}
                  </Text>
                </JobDescription>

                {description.map((item) => {
                  return <Text key={item.id}>{item.text}</Text>;
                })}


                {!!job_data.priority && (
                  <JobDescription style={{ marginTop: 5, alignItems: "center" }}>
                    <Text small light>
                      Priority
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                      <Text small textTransform="uppercase" style={{ fontSize: 12 }}>
                        {priorityMap[job_data.priority]}
                      </Text>
                      <FontAwesome name="exclamation-triangle" color={getPriorityColor(job_data.priority)} style={{ marginStart: 8 }} />
                    </View>
                  </JobDescription>
                )}
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

            <CardOptionItem style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }} row>
              <Text small>Reviews</Text>

              {/* Iterate from array of data pulled from server and render as stars */}
              <View style={{ flexDirection: "row" }}>
                <StarRating disabled={true} fullStarColor={'black'} maxStars={5} rating={starRate} starSize={25} />
              </View>
            </CardOptionItem>

            {job_data.offer_received && job_data.offer_received.deployee === authState.userID ? (
              job_data.offer_received.counterOffer ? (
                <>
                  <Row style={{ paddingHorizontal: 20, paddingTop: 12, borderBottomWidth: 0, justifyContent: "space-between" }}>
                    <Text small light marginBottom="5px">
                      Counter Offer
                    </Text>
                    <Text small marginBottom="5px">
                      ${job_data.offer_received.counterOffer}/{job_data.offer_received.counterWage || 'deployment'}
                    </Text>
                  </Row>
                  <Button
                    accept
                    style={{ marginHorizontal: 24, marginVertical: 12, justifyContent: "center" }}
                    onPress={handleCounterApprove}
                  >
                    <Text style={{ color: "white", textAlign: "center" }} medium>
                      Accept Counter Offer
                    </Text>
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
          :
          <ActivityIndicator style={{ margin: 8, marginTop: 12 }} size='large' />
        }
      </Card>
    </>
  )
}

const NegotiationView = ({ job_data, hasActiveAccount, navigation, deployee, onCancel, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState("");
  const [unit, setUnit] = useState(job_data.wage || "deployment");

  const onSubmitOffer = useCallback(async () => {
    if (salary) {
      setLoading(true);

      const offer = parseFloat(salary).toFixed(2);
      if (Number.isNaN(offer) || isNaN(offer)) {
        return;
      }
      await new Promise((res) => {
        Confirm({
          title: "Confirm Offer",
          message: `Suggest offer of $${offer}/${unit} to deployer to complete this job?`,
          options: ["Yes", "No"],
          cancelButtonIndex: 1,
          onPress: async (number) => {
            if (number === 0) {
              // Save offer
              try {
                if (!hasActiveAccount) {
                  Alert.alert("Setup Account", "You need to setup your accont to continue", [
                    {
                      onPress: () => {
                        setLoading(false)
                        navigation.navigate('Payments')
                      },
                      style: 'default',
                      text: 'Manage Payments',
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel',
                      onPress: onCancel
                    }
                  ])
                  return
                }
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
    <Modal coverScreen avoidKeyboard swipeDirection="down" onSwipeComplete={onCancel} onBackButtonPress={onCancel} isVisible>
      <SafeAreaView style={{ backgroundColor: "#fff", borderRadius: 40, paddingVertical: 16 }}>
        <Row>
          <JobDescriptionRow>
            <JobDescription>
              <Text small light marginBottom="5px">
                Current Offer
              </Text>
              <Text small marginBottom="5px">
                ${job_data.salary}/{job_data.wage || 'deployment'}
              </Text>
            </JobDescription>

            <Text small style={{ textTransform: "uppercase", marginVertical: 16, textAlign: "center" }} bold>
              What offer would you complete this job for?
            </Text>

            <View style={{ marginVertical: 10, alignItems: "stretch", justifyContent: "center" }}>
              <WageInput style={{ alignItems: "stretch" }}>
                <SalaryField style={{ alignItems: "stretch" }}>
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
          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'stretch', justifyContent: 'space-around' }}>
            <Button disabled={loading} decline onPress={onCancel}>
              <Text style={{ color: "red" }} medium>
                Cancel
              </Text>
            </Button>
            <Button disabled={loading} style={{ flexDirection: "row" }} accept onPress={onSubmitOffer}>
              {loading ? <ActivityIndicator animating style={{ marginEnd: 4 }} color="white" /> : null}
              <Text style={{ color: "white" }} medium>
                Save
              </Text>
            </Button>
          </View>
        </Row>
      </SafeAreaView>
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
  margin: -60px auto;
  margin-bottom: -20px;
  height: 96px;
  width: 96px;
  border-radius: 48px;
  border-color: white;
  border-width: 2px;
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
        padding: 10px 20px; 
        border-radius: 8px;
        `;

      case decline:
        return `
        border: 1px solid red; 
        background: white; 
        padding: 10px 20px; 
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
