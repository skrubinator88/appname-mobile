import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { unix } from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, KeyboardAvoidingView, Modal, SafeAreaView, ScrollView, View } from "react-native";
import { TextField } from "@ubaids/react-native-material-textfield";
import StarRating from "react-native-star-rating";
// Redux
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import Confirm from "../../../components/confirm";
// Context
import { GlobalContext } from "../../../components/context";
// Components
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import GigChaserJobWord from "../../../assets/gig-logo";
// Controllers
import JobsControllers from "../../../controllers/JobsControllers";
import config from "../../../env";
// Functions
import { isCurrentJob, sendNotification } from "../../../functions";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function JobListing({ navigation }) {
  // Constructor
  const { authState } = useContext(GlobalContext);

  // Store
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();

  // State
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMounted) {
      setLoading(false);
    }
    setIsMounted(true);
  }, [listings]);

  // Fetch user jobs
  useEffect(() => {
    let unsubscribe;
    unsubscribe = JobsControllers.currentUserActiveJobs(authState.userID, dispatch);

    return () => {
      if (unsubscribe !== undefined) JobsControllers.clean("ListingsActions", unsubscribe, dispatch);
    };
  }, []);

  const unassignedList = listings.filter(
    (item) => item.status == "available" || (item.status == "in review" && !item?.offer_received && !item?.offer_received?.deployee)
  );
  const offersList = listings.filter((item) => item.status == "in review" && item?.offer_received && item?.offer_received?.deployee);
  const inProgressList = listings.filter((item) => item.status == "in progress" || item.status == "accepted");

  // useEffect(() => {
  //   console.log(listings);
  // }, [listings]);

  // if (loading)
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator color="#4a89f2" animating={true} size="large" />
  //     </View>
  //   );

  return (
    <>
      <Container
        navigation={navigation}
        titleColor="white"
        title={() => (
          <>
            <GigChaserJobWord color="white" width="40px" height="40px" style={{ marginHorizontal: 10 }} />
            <Text style={{ color: "white", fontWeight: "300", fontSize: 23 }}>Listing</Text>
          </>
        )}
        headerBackground="#3869f3"
      >
        {/* Payments Section */}
        <Item>
          <JobItemLink onPress={() => navigation.navigate("Listing Item", { edit: false })}>
            <JobItemRow>
              <Row>
                <Text small weight="700" color="#1b5cce">
                  NEW
                </Text>
                <GigChaserJobWord color="#1b5cce" width="40px" height="40px" style={{ marginHorizontal: 10 }} />
                <Text small weight="700" color="#1b5cce">
                  POSTING
                </Text>
              </Row>
            </JobItemRow>
          </JobItemLink>
        </Item>

        <JobSection style={{ marginBottom: 12 }}>
          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                UNASSIGNED
              </Text>
            </View>
          </SectionTitle>

          {unassignedList.length > 0 ? (
            unassignedList.map((item) => (
              <ListItemDetail key={item.id} isCurrentJob={isCurrentJob(item)} navigation={navigation} item={item} />
            ))
          ) : (
            <Item style={{ padding: 20, alignSelf: "stretch", justifyContent: "center" }}>
              <MaterialCommunityIcons
                name="alert-octagon"
                style={{ textAlign: "center", fontSize: 32, marginBottom: 8, color: "darkgrey" }}
              />
              <Text small light style={{ textAlign: "center", textTransform: "uppercase" }}>
                No job available
              </Text>
            </Item>
          )}

          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                OFFERS FOR REVIEW
              </Text>
            </View>
          </SectionTitle>

          {offersList.length > 0 ? (
            offersList.map((item) => <ListOfferItemDetail item={item} key={item.id || item._id} />)
          ) : (
            <Item style={{ padding: 20, alignSelf: "stretch", justifyContent: "center" }}>
              <MaterialCommunityIcons
                name="alert-octagon"
                style={{ textAlign: "center", fontSize: 32, marginBottom: 8, color: "darkgrey" }}
              />
              <Text small light style={{ textAlign: "center", textTransform: "uppercase" }}>
                No offer available for review
              </Text>
            </Item>
          )}

          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                IN PROGRESS
              </Text>
            </View>
          </SectionTitle>

          {inProgressList.length > 0 ? (
            inProgressList.map((item) => (
              <Item key={item.id}>
                <JobItemLink>
                  <JobItemRow>
                    <Column>
                      <Row>
                        <Text small weight="700" color="#1b5cce">
                          {item.job_type}
                        </Text>
                        <Text small>Active</Text>
                      </Row>
                      <Row>
                        <Text small>
                          ${item.salary}/{item.wage}
                        </Text>
                      </Row>
                      {item.tasks.map((task) => (
                        <Row key={task.id}>
                          <Text>{task.text}</Text>
                        </Row>
                      ))}
                    </Column>
                  </JobItemRow>
                </JobItemLink>
              </Item>
            ))
          ) : (
            <Item style={{ padding: 20, alignSelf: "stretch", justifyContent: "center" }}>
              <MaterialCommunityIcons
                name="alert-octagon"
                style={{ textAlign: "center", fontSize: 32, marginBottom: 8, color: "darkgrey" }}
              />
              <Text small light style={{ textAlign: "center", textTransform: "uppercase" }}>
                No job is currently in progress
              </Text>
            </Item>
          )}
        </JobSection>
      </Container>
    </>
  );
}

const ListItemDetail = ({ item, navigation, isCurrentJob: current }) => {
  const [timeToShow, setTimeToShow] = useState(current ? unix(item.start_at / 1000).fromNow() : "");
  useFocusEffect(
    useCallback(() => {
      if (isCurrentJob) {
        setTimeToShow(unix(item.start_at / 1000).fromNow());
      }
    }, [navigation, item])
  );

  return (
    <Item key={item}>
      <JobItemLink activeOpacity={0.6} onPress={() => navigation.navigate("Listing Item", { edit: true, data: item })}>
        <JobItemRow>
          <Column>
            <Row>
              <Text small weight="700">
                {item.job_title}
              </Text>
              {current ? (
                <Text textTransform="uppercase" small>
                  Active
                </Text>
              ) : (
                <Text textTransform="uppercase" color="#a44" small>
                  Scheduled
                </Text>
              )}
            </Row>
            <Row>
              <Text small weight="700" color="#1b5cce">
                {item.job_type}
              </Text>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Text small>
                ${item.salary}/{item.wage}
              </Text>
            </Row>
            {item.tasks.map((task) => (
              <Row key={task.id}>
                <Text>- {task.text}</Text>
              </Row>
            ))}
            {!current ? (
              <Row style={{ marginTop: 10, justifyContent: "flex-start", alignItems: "center" }}>
                <FontAwesome style={{ marginEnd: 4, color: "#444" }} name="clock-o" />
                <Text color="#888" small>
                  Available {timeToShow}
                </Text>
              </Row>
            ) : null}
          </Column>
        </JobItemRow>
      </JobItemLink>
    </Item>
  );
};

const ListOfferItemDetail = ({ item }) => {
  const { authState } = useContext(GlobalContext);
  const [state, setState] = useState({ loading: true, showCounterOffer: false });

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${config.API_URL}/users/${item.offer_received.deployee}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.userToken}`,
            "Content-type": "application/json",
          },
        });

        const deployee = await response.json();
        deployee.id = item.offer_received.deployee;
        setState({
          ...state,
          loading: false,
          deployee,
          name: `${deployee.first_name} ${deployee.last_name}`,
          occupation: deployee.occupation,
          starRate: Number(deployee.star_rate),
        });
      } catch (e) {
        console.log(e, "Load offer fail");
        setState({ ...state, loading: false });
      }
    })();
  }, [item]);

  const onSelect = useCallback(() => {
    if (!state.deployee) {
      return;
    }
    setState({ ...state, showCounterOffer: true });
  }, [state, item]);

  return state.loading ? (
    <Item key={item.id} style={{ padding: 20, paddingVertical: 40, alignSelf: "stretch", justifyContent: "center" }}>
      <ActivityIndicator color="darkgrey" />
    </Item>
  ) : (
    <Item key={item.id}>
      <JobItemLink onPress={onSelect}>
        <JobItemRow>
          <Column>
            <Row style={{ marginBottom: 8 }}>
              <Text small weight="700" color="#1b5cce">
                {item.job_type}
              </Text>
            </Row>

            {item.tasks.map((task) => (
              <Row key={task.id}>
                <Text>- {task.text}</Text>
              </Row>
            ))}

            <Row style={{ marginTop: 8, marginBottom: 12 }}>
              <Text light small>
                Initial Offer
              </Text>
              <Text small>
                ${item.salary}/{item.wage}
              </Text>
            </Row>

            {state.deployee && state.deployee.id && state.deployee.id === item.executed_by ? (
              <>
                <Row last style={{ marginTop: 4, justifyContent: "flex-start", paddingRight: 0 }}>
                  <Image
                    source={{
                      uri: `${config.API_URL}/images/${state.deployee.id}.jpg`,
                    }}
                    style={{ height: 70, width: 70, borderRadius: 45 }}
                  />
                  <Column>
                    <Text small bold>
                      {state.name}
                    </Text>
                    <Row style={{ marginVertical: 4, paddingLeft: 0 }}>
                      <Text light small>
                        Suggested Offer
                      </Text>
                      <Text small>
                        ${item.offer_received.offer}/{item.offer_received.wage}
                      </Text>
                    </Row>
                    {item.offer_received.counterOffer ? (
                      <Row style={{ marginVertical: 4, paddingLeft: 0 }}>
                        <Text color="teal" small>
                          Counter Offer
                        </Text>
                        <Text color="teal" small>
                          ${item.offer_received.counterOffer}/{item.offer_received.counterWage}
                        </Text>
                      </Row>
                    ) : null}
                  </Column>
                </Row>
              </>
            ) : null}
          </Column>
        </JobItemRow>
      </JobItemLink>
      {state.showCounterOffer ? (
        <CounterOfferView
          authState={authState}
          job_data={item}
          deployee={state.deployee}
          onComplete={() => setState({ ...state, showCounterOffer: false })}
        />
      ) : null}
    </Item>
  );
};

const CounterOfferView = ({ job_data, authState, deployee, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [salary, setSalary] = useState(job_data.offer_received?.offer);
  const [wage, setUnit] = useState(job_data.offer_received.wage || "hr");

  const { showActionSheetWithOptions } = useActionSheet();

  const onRejectOffer = useCallback(async () => {
    if (salary) {
      await new Promise(async (res) => {
        Confirm({
          options: ["Reject", "Cancel"],
          cancelButtonIndex: 1,
          title: `Reject Offer From ${deployee.first_name}`,
          message: `If you reject, the job will be available in the job pool`,
          onPress: async (index) => {
            try {
              setLoading(true);

              if (index === 0) {
                await JobsControllers.cancelOffer(job_data.id);
                sendNotification(authState.userToken, deployee.id, {
                  title: `GigChasers - ${job_data.job_title}`,
                  body: `Offer rejected`,
                  data: { type: "offerdecline", id: job_data.id, sender: authState.userID },
                });
              }
              setLoading(false);
              onComplete();
            } catch (e) {
              console.log(e, "offer rejection");
              setLoading(false);
            } finally {
              res();
            }
          },
          onCancel: res,
        });
      });
    }
  }, [loading, deployee, job_data, salary]);

  const onSubmitOffer = useCallback(async () => {
    if (salary) {
      const offer = parseFloat(salary).toFixed(2);
      if (Number.isNaN(offer) || isNaN(offer)) {
        console.log(offer, ": is not a number?");
        return;
      }
      await new Promise(async (res) => {
        const isCounterOffer = offer !== parseFloat(job_data.offer_received.offer).toFixed(2) || job_data.offer_received.wage !== wage;
        Confirm({
          options: [isCounterOffer ? "Send" : "Approve", "Cancel"],
          cancelButtonIndex: 1,
          title: !isCounterOffer ? `Approve Offer From ${deployee.first_name}` : `Send Counter Offer To ${deployee.first_name}`,
          message: !isCounterOffer
            ? `If you approve, the job will be accepted by this deployee`
            : `Offer will be sent to ${deployee.first_name} for confirmation`,
          onPress: async (index) => {
            try {
              setLoading(true);

              if (index === 0) {
                if (isCounterOffer) {
                  await JobsControllers.counterOffer(job_data.id, offer, wage);
                  sendNotification(authState.userToken, deployee.id, {
                    title: `GigChasers - ${job_data.job_title}`,
                    body: `Counter offer received`,
                    data: { type: "offerreceive", id: job_data.id, sender: authState.userID },
                  });
                } else {
                  await JobsControllers.approveOffer(job_data.id, deployee.id, authState);
                  sendNotification(authState.userToken, deployee.id, {
                    title: `GigChasers - ${job_data.job_title}`,
                    body: `Offer approved`,
                    data: { type: "offeraccept", id: job_data.id, sender: authState.userID },
                  });
                }
              }
              setLoading(false);
              onComplete();
            } catch (e) {
              setLoading(false);
              console.log(e, "offer acceptance");
            } finally {
              res();
            }
          },
          onCancel: res,
        });
      });
    }
  }, [loading, deployee, job_data, salary, wage]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible
      onRequestClose={onComplete}
      onDismiss={onComplete}
      style={{ height: "100%", backgroundColor: "#0004", justifyContent: "center" }}
    >
      <ScrollView bounces={false} contentContainerStyle={{ justifyContent: "center", flexGrow: 1, backgroundColor: "#0004" }}>
        <SafeAreaView>
          <KeyboardAvoidingView behavior="padding" style={{ justifyContent: "flex-end", margin: 8 }}>
            <Item style={{ justifyContent: "space-between", borderRadius: 8, paddingVertical: 8, flex: 1 }}>
              <Button onPress={onComplete} style={{ position: "absolute", top: 4, left: 4 }}>
                <MaterialCommunityIcons size={24} color="red" name="close-circle" />
              </Button>
              <CounterRow style={{ justifyContent: "center", flex: 1 }} first>
                <Column>
                  <View last style={{ marginBottom: 20, justifyContent: "flex-start", flexDirection: "row", paddingRight: 0 }}>
                    <Image
                      source={{
                        uri: `${config.API_URL}/images/${deployee.id}.jpg`,
                      }}
                      style={{ height: 70, width: 70, borderRadius: 45 }}
                    />
                    <Column>
                      <Text medium>
                        {deployee.first_name} {deployee.last_name}
                      </Text>
                      <StarRating
                        disabled={true}
                        containerStyle={{ justifyContent: "flex-start", marginVertical: 4 }}
                        starStyle={{ marginHorizontal: 2 }}
                        maxStars={5}
                        rating={deployee.star_rate}
                        starSize={16}
                      />
                      <Text small light>
                        {deployee.occupation}
                      </Text>
                    </Column>
                  </View>

                  <Text small style={{ textTransform: "uppercase", marginVertical: 30, textAlign: "center" }} bold>
                    Approve suggested offer or Send a counter offer to deployee
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: 24, justifyContent: "space-between" }}>
                    <Text small light marginBottom="5px">
                      Current Offer
                    </Text>
                    <Text small marginBottom="5px">
                      ${job_data.salary}/{job_data.wage}
                    </Text>
                  </View>

                  <View style={{ marginVertical: 16 }}>
                    <WageInput>
                      <SalaryField style={{ justifyContent: "center" }}>
                        <TextField
                          disabled={loading}
                          label="SUGGESTED OFFER"
                          prefix="$"
                          suffix={`/${wage}`}
                          labelFontSize={14}
                          placeholder="0.00"
                          labelTextStyle={{ color: "grey", fontWeight: "700" }}
                          keyboardType="numeric"
                          onChangeText={(text) => {
                            setSalary(text);
                          }}
                          value={salary}
                          onSubmitEditing={onSubmitOffer}
                          renderRightAccessory={() => (
                            <RateTouchable
                              onPress={() => {
                                showActionSheetWithOptions(
                                  {
                                    options: ["Per Day", "Per Deployment", "Per Hour", "Cancel"],
                                    cancelButtonIndex: 3,
                                    title: "Select  Rate",
                                    showSeparators: true,
                                  },
                                  async (num) => {
                                    switch (num) {
                                      case 0:
                                        setUnit("day");
                                        break;
                                      case 1:
                                        setUnit("deployment");
                                        break;
                                      case 2:
                                        setUnit("hr");
                                        break;
                                    }
                                  }
                                );
                              }}
                            >
                              <Text color="#4a89f2">/{wage}</Text>
                            </RateTouchable>
                          )}
                        />
                      </SalaryField>
                    </WageInput>
                  </View>
                </Column>
              </CounterRow>

              <CounterRow last>
                {loading ? (
                  <ActivityIndicator animating style={{ marginEnd: 4, marginVertical: 8 }} color="darkgrey" />
                ) : (
                  <>
                    <Column style={{ alignItems: "center" }}>
                      <Button disabled={loading} decline onPress={onRejectOffer}>
                        <Text style={{ color: "red" }} medium>
                          Reject
                        </Text>
                      </Button>
                    </Column>
                    <Column>
                      <Button disabled={loading} style={{ flexDirection: "row" }} accept onPress={onSubmitOffer}>
                        <Text style={{ color: "white" }} medium>
                          Approve
                        </Text>
                      </Button>
                    </Column>
                  </>
                )}
              </CounterRow>
            </Item>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

// Payments Section

const RateTouchable = styled.TouchableOpacity`
  padding: 4px 12px;
  background-color: #fafafa;
  margin: 0 2px;
`;

const Item = styled.View`
  flex: 1;
  background: white;
  margin: 10px 0 0 0;
`;

const SalaryField = styled.View`
  flex: 1;
  flex-direction: column;
`;

const SectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const JobSection = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const JobItemRow = styled.View`
  background: white;
  padding: 10px;
  flex-direction: row;
  width: 100%;
  border: 1px solid #f5f5f5;
`;

const JobItemLink = styled.TouchableOpacity`
  flex-direction: row;
`;

const Column = styled.View`
  flex: 1;
  flex-direction: column;
`;

const Row = styled.View`
  flex: 1;
  padding: 0px 5%;
  flex-direction: row;
  align-items: center;
`;

const WageInput = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
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

const CounterRow = styled.View`
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
