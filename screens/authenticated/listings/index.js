import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TextField } from "@ubaids/react-native-material-textfield";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, SafeAreaView, ScrollView, View } from "react-native";
import Modal from 'react-native-modal';
import StarRating from "react-native-star-rating";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import GigChaserJobWord from "../../../assets/gig-logo";
import Confirm from "../../../components/confirm";
import { GlobalContext } from "../../../components/context";
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import JobsControllers from "../../../controllers/JobsControllers";
import config from "../../../env";
import { sendNotification } from "../../../functions";
import { CurrencyFormatter } from "../payment/components";


const height = Dimensions.get("window").height;

export default function JobListing({ navigation }) {
  const { authState } = useContext(GlobalContext);
  // Store
  const listings = useSelector((state) => state.listings);
  const dispatch = useDispatch();


  // Fetch user jobs, there should only be 1 active job at any given time
  useEffect(() => {
    let unsubscribe;
    unsubscribe = JobsControllers.currentUserCompletedJobs(authState.userID, dispatch);

    return () => {
      if (unsubscribe !== undefined) { JobsControllers.clean("ListingsActions", unsubscribe, dispatch); }
    };
  }, []);

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
            {listings.length > 0 && (
              <>
                <SectionTitle>
                  <View style={{ margin: 10 }}>
                    <Text small bold color="#474747">
                      COMPLETED
                    </Text>
                  </View>
                </SectionTitle>

                {listings.map((item) => (
                  <ListItemCompleteDetail item={item} key={item._id} />
                ))}
              </>
            )}

            {listings.length <= 0 && (
              <Item style={{ padding: 20, paddingVertical: 40, alignSelf: "stretch", justifyContent: "center" }}>
                <MaterialCommunityIcons
                  name="alert-octagon"
                  style={{ textAlign: "center", fontSize: 32, marginBottom: 8, color: "darkgrey" }}
                />
                <Text small light style={{ textAlign: "center", textTransform: "uppercase" }}>
                  No job completed yet
                </Text>
              </Item>
            )}
          </JobSection>
        </ScrollView>
      </Container>
    </>
  );
}

const ListItemCompleteDetail = ({ item }) => {
  const { authState } = useContext(GlobalContext);
  const [state, setState] = useState({ loading: true, showCounterOffer: false });
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${config.API_URL}/users/${item.executed_by}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.userToken}`,
            "Content-type": "application/json",
          },
        });

        const deployee = await response.json();
        deployee.id = item.executed_by;
        setState({
          ...state,
          loading: false,
          deployee,
          name: `${deployee.first_name} ${deployee.last_name}`,
          occupation: deployee.occupation,
          starRate: Number(deployee.star_rate),
        });
      } catch (e) {
        console.log(e, "Load job fail");
        setState({ ...state, loading: false });
      }
    })();
  }, [item]);

  const onSelect = useCallback(() => {
    navigation.navigate("Job Details", { data: item })
  }, [state, item]);

  return state.loading ? (
    <Item key={item.id} style={{ padding: 20, paddingVertical: 48, alignSelf: "stretch", justifyContent: "center" }}>
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

            {item.tasks?.map((task) => (
              <Row key={task.id}>
                <Text small light>- {task.text}</Text>
              </Row>
            ))}

            <Row style={{ marginVertical: 4, justifyContent: 'space-between' }}>
              <Text light small>
                Cost
              </Text>
              <Text small>
                {CurrencyFormatter.format(item.salary ?? 0)}/{item.wage ?? 'deployment'}
              </Text>
            </Row>

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
          </Column>
        </JobItemRow>
      </JobItemLink>
    </Item>
  );
};

export const CounterOfferView = ({ job_data, authState, deployee, onComplete }) => {
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
              Alert.alert('Operation Failed', e.message || "An error occurred while tring to reject this offer")
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
              Alert.alert('Operation Failed', e.message || "An error occurred while tring to update this offer")
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

  if (!job_data) {
    console.log('dsdsds')
    return <></>
  }

  return (
    <Modal
      isVisible
      coverScreen
      onBackdropPress={loading ? null : onComplete}
      onBackButtonPress={onComplete}
      onSwipeComplete={loading ? null : onComplete}
      swipeDirection="down"
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
                  {CurrencyFormatter.format(job_data.salary ?? 0)}/{job_data.wage ?? 'deployment'}
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
