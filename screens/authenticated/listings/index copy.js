import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { TextField } from "@ubaids/react-native-material-textfield";
import { unix } from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, View } from "react-native";
import StarRating from "react-native-star-rating";
import { useDispatch, useSelector } from "react-redux";
import Modal from 'react-native-modal';
import styled from "styled-components/native";
import GigChaserJobWord from "../../../assets/gig-logo";
import Confirm from "../../../components/confirm";
import { GlobalContext, UIOverlayContext } from "../../../components/context";
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import JobsControllers from "../../../controllers/JobsControllers";
import ListingsActions from "../../../rdx-actions/listings.action";

import config from "../../../env";
import { isCurrentJob, sendNotification } from "../../../functions";
import { LISTING_CONTEXT } from "../../../contexts/ListingContext";

const height = Dimensions.get("window").height;

export default function JobListing({ navigation }) {
  const { authState } = useContext(GlobalContext);
  const { setListing } = useContext(LISTING_CONTEXT);
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

  return (
    <>
      <Container
        navigation={navigation}
        flexible={false}
        titleColor="white"
        title={() => (
          <>
            <GigChaserJobWord color="white" width="60px" height="25px" style={{ marginHorizontal: 10 }} />
            <Text style={{ color: "white", fontWeight: "300", fontSize: 23 }}>Listing</Text>
          </>
        )}
        headerBackground="#3869f3"
      >
        <ScrollView
          scrollEnabled
          bounces={true}
          style={{ height, paddingTop: 8 }}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Payments Section */}
          <Item>
            <JobItemLink onPress={() => navigation.navigate("Listing Item", { edit: false })}>
              <JobItemRow>
                <Row>
                  <Text small weight="700" color="#1b5cce">
                    NEW
                  </Text>
                  <GigChaserJobWord color="#1b5cce" width="60px" height="25px" style={{ marginHorizontal: 10 }} />
                  <Text small weight="700" color="#1b5cce">
                    POSTING
                  </Text>
                </Row>
              </JobItemRow>
            </JobItemLink>
          </Item>

          <JobSection style={{ marginBottom: 12 }}>
            {inProgressList.length > 0 && (
              <>
                <SectionTitle>
                  <View style={{ margin: 10 }}>
                    <Text small bold color="#474747">
                      IN PROGRESS
                    </Text>
                  </View>
                </SectionTitle>

                {inProgressList.map((item) => (
                  <Item key={item.id}>
                    <JobItemLink activeOpacity={0.6} onPress={() => {
                      setListing(item)
                      navigation.navigate('Root', { screen: 'dashboard', data: 'selected', item })
                    }}>
                      <JobItemRow>
                        <Column>
                          <Row style={{ justifyContent: "space-between" }}>
                            <Text small weight="700" color="#1b5cce">
                              {item.job_type}
                            </Text>
                          </Row>
                          <Row style={{ marginTop: 4, marginBottom: 8 }}>
                            <Text small>
                              ${item.salary}/{item.wage ?? 'deployment'}
                            </Text>
                          </Row>
                          {item.tasks.map((task) => (
                            <Row key={task.id}>
                              <Text small light>- {task.text}</Text>
                            </Row>
                          ))}
                        </Column>
                      </JobItemRow>
                    </JobItemLink>
                  </Item>
                ))}
              </>
            )}

            <SectionTitle>
              <View style={{ margin: 10 }}>
                <Text small bold color="#474747">
                  UNASSIGNED
                </Text>
              </View>
            </SectionTitle>

            {unassignedList.length > 0 ? (
              unassignedList.map((item) => (
                <ListItemDetail key={item.id} dispatch={dispatch} isCurrentJob={isCurrentJob(item)} navigation={navigation} item={item} />
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

            {offersList.length > 0 && (
              <>
                <SectionTitle>
                  <View style={{ margin: 10 }}>
                    <Text small bold color="#474747">
                      OFFERS FOR REVIEW
                    </Text>
                  </View>
                </SectionTitle>


                {offersList.map((item) => <ListOfferItemDetail item={item} key={item.id || item._id} />)}
              </>
            )}
          </JobSection>
        </ScrollView>
      </Container>
    </>
  );
}

const ListItemDetail = ({ item, navigation, isCurrentJob: current, dispatch }) => {
  const [timeToShow, setTimeToShow] = useState(current ? unix(item.start_at / 1000).fromNow() : "");
  const [loading, setLoading] = useState(false)

  useFocusEffect(
    useCallback(() => {
      if (current) {
        setTimeToShow(unix(item.start_at / 1000).fromNow());
      }
    }, [navigation, item])
  );

  return (
    <Item key={item}>
      <JobItemLink activeOpacity={0.6} onPress={() => {
        Confirm({
          title: item.job_type,
          message: item.job_title,
          options: ['Edit', 'Delete', 'Cancel'],
          cancelButtonIndex: 2,
          destructiveButtonIndex: 1,
          onPress: async (index) => {
            if (index === 0) {
              navigation.navigate("Listing Item", { edit: true, data: item })
            } else if (index === 1) {
              setLoading(true)
              try {
                await JobsControllers.deleteJob(item.id)
                Alert.alert('Successfully Deleted Gig', undefined, [{
                  onPress: () => {
                    dispatch(ListingsActions.remove(item.id))
                  },
                  style: 'default'
                }])
              } catch (e) {
                Alert.alert('Failed To Delete', 'An error occurred while trying to delete gig')
              } finally {
                setLoading(false)
              }
            }
          }
        })
      }}>
        <JobItemRow>
          {loading ?
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingVertical: 20 }}>
              <ActivityIndicator size='small' style={{ alignSelf: 'center' }} />
            </View>
            :
            <Column>
              <Row style={{ justifyContent: "space-between" }}>
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
                  ${item.salary}/{item.wage ?? 'deployment'}
                </Text>
              </Row>
              {item.tasks.map((task) => (
                <Row key={task.id}>
                  <Text small light>- {task.text}</Text>
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
          }
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
    Confirm({
      title: item.job_type,
      message: item.job_title,
      options: ['View Offer', 'Cancel'],
      cancelButtonIndex: 1,
      onPress: async (index) => {
        if (!state.deployee) {
          return;
        }
        if (index === 0) {
          setState({ ...state, showCounterOffer: true });
        }
      },
    })
  }, [state, item]);

  return state.loading ? (
    <Item key={item.id} style={{ padding: 20, paddingVertical: 40, alignSelf: "stretch", justifyContent: "center" }}>
      <ActivityIndicator color="darkgrey" />
    </Item>
  ) : (
    <Item key={item.id}>
      <JobItemLink activeOpacity={0.6} onPress={onSelect}>
        <JobItemRow>
          <Column>
            <Row style={{ marginBottom: 8 }}>
              <Text small weight="700" color="#1b5cce">
                {item.job_type}
              </Text>
            </Row>

            {item.tasks.map((task) => (
              <Row key={task.id}>
                <Text small light>- {task.text}</Text>
              </Row>
            ))}

            <Row style={{ marginVertical: 4, justifyContent: 'space-between' }}>
              <Text light small>
                Initial Offer
              </Text>
              <Text small>
                ${item.salary}/{item.wage ?? 'deployment'}
              </Text>
            </Row>

            {state.deployee && state.deployee.id && state.deployee.id === item.executed_by ? (
              <>
                <Row style={{ marginVertical: 4, justifyContent: 'space-between' }}>
                  <Text light small>
                    Suggested Offer
                  </Text>
                  <Text small>
                    ${item.offer_received.offer}
                  </Text>
                </Row>
                {item.offer_received.counterOffer &&
                  <Row style={{ marginVertical: 4, justifyContent: 'space-between' }}>
                    <Text color="teal" small>
                      Counter Offer
                    </Text>
                    <Text color="teal" small>
                      ${item.offer_received.counterOffer}
                    </Text>
                  </Row>
                }

                <Row last style={{ marginTop: 8, justifyContent: "flex-start" }}>
                  <Image
                    source={{
                      uri: `${config.API_URL}/images/${state.deployee.id}.jpg`,
                    }}
                    style={{ height: 48, width: 48, borderRadius: 24, backgroundColor: '#cacaca' }}
                  />
                  <Column>
                    <Text small bold style={{ marginLeft: 8 }}>
                      {state.name}
                    </Text>
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
  const [wage] = useState(job_data.offer_received.wage || "deployment");

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
      coverScreen
      onBackdropPress={loading ? null : onComplete}
      onBackButtonPress={onComplete}
      onSwipeComplete={loading ? null : onComplete}
      swipeDirection='down'
      avoidKeyboard>
      <SafeAreaView style={{ justifyContent: "center" }}>
        <View style={{ justifyContent: "space-between", backgroundColor: 'white', borderRadius: 8, paddingVertical: 8, margin: 8, flex: 'unset' }}>
          <CounterRow style={{ justifyContent: "center" }} first>
            <Column>
              <View last style={{ marginBottom: 20, justifyContent: "flex-start", flexDirection: "row", paddingRight: 0 }}>
                <Image
                  source={{
                    uri: `${config.API_URL}/images/${deployee.id}.jpg`,
                  }}
                  style={{ height: 70, width: 70, borderRadius: 45 }}
                />
                <Column style={{ marginLeft: 12 }}>
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
                  ${job_data.salary}/{job_data.wage ?? 'deployment'}
                </Text>
              </View>

              {!loading && (
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
                      />
                    </SalaryField>
                  </WageInput>
                </View>
              )}
            </Column>
          </CounterRow>

          <CounterRow last>
            {loading ? (
              <ActivityIndicator animating style={{ marginEnd: 4, marginVertical: 8 }} color="darkgrey" />
            ) : (
              <View style={{ flexDirection: 'row', flex: 1, alignItems: 'stretch', justifyContent: 'space-around' }}>
                <Button disabled={loading} decline onPress={onRejectOffer}>
                  <Text style={{ color: "red" }} medium>Reject</Text>
                </Button>
                <Button disabled={loading} style={{ flexDirection: "row" }} accept onPress={onSubmitOffer}>
                  <Text style={{ color: "white" }} medium>Approve</Text>
                </Button>
              </View>
            )}
          </CounterRow>

          <Button onPress={onComplete} style={{ position: "absolute", top: 4, left: 4 }}>
            <MaterialCommunityIcons size={24} color="red" name="close-circle" />
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

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
`;