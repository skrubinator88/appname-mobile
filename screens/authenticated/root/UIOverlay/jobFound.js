// IMPORT
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { View, Platform, FlatList, Dimensions, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import styled from "styled-components/native";
import config from "../../../../env";
import StarRating from "react-native-star-rating";
import env from "../../../../env";
import { TextField } from "react-native-material-textfield";

// Expo
import { FontAwesome } from "@expo/vector-icons";

import Card from "../../../../components/card_animated";
import Text from "../../../../components/text";

const deviceHeight = Dimensions.get("window").height;

import { UIOverlayContext, GlobalContext } from "../../../../components/context";
import Confirm from "../../../../components/confirm";

// Controllers
import AnimationsController from "../../../../controllers/AnimationsControllers";
import JobsController from "../../../../controllers/JobsControllers";
import PhotoItem from "../../listings/listItemImage";
import { StyleSheet } from "react-native";

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
  const [accepted, setAccepted] = useState(false)
  const [enableNegotiation, setEnableNegotiation] = useState(false)
  const [job_data, set_job_data] = useState(job_data_prop)
  const cardRef = useRef(null);

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
      setProjectManager(project_manager);
      setName(`${project_manager.first_name} ${project_manager.last_name}`);
      setOccupation(project_manager.occupation);
      setStarRate(Number(project_manager.star_rate));
      setDescription(job_data.tasks);
      setLoading(false);
    })();
  }, []);

  // Monitor page and change the job status back to being avaiilable when user leaves the screen
  useEffect(() => {
    let reset = false
    const unsubscribe = navigation.addListener('beforeRemove', async (e) => {
      e.preventDefault()
      if (job_data.offer_received && job_data.offer_received.deployee === authState.userID) {
        return await new Promise((res) => {
          Confirm({
            title: 'Cancel Job Offer?',
            message: 'Job will become available in the job pool',
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0,
            options: ['yes', 'cancel'],
            onPress: async (i) => {
              if (i === 0) {
                await JobsController.cancelOffer(job_data._id)
                reset = true
                delete job_data.offer_received
                set_job_data(job_data)
                res()
                return navigation.dispatch(e.data.action)
              }
            },
            onCancel: res
          })
        })
      } else if (!accepted) {
        await JobsController.changeJobStatus(job_data._id, "available");
        reset = true
      }
      return navigation.dispatch(e.data.action)
    })

    return () => {
      if (!reset && (!job_data.offer_received || job_data.offer_received.deployee !== authState.userID)) {
        JobsController.changeJobStatus(job_data._id, "available")
      }
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [navigation])

  const handleJobDecline = async () => {
    if (job_data.offer_received && job_data.offer_received.deployee === authState.userID) {
      return await new Promise((res) => {
        Confirm({
          title: 'Cancel Job Offer?',
          message: 'Job will become available in the job pool',
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0,
          options: ['yes', 'cancel'],
          onPress: async (i) => {
            if (i === 0) {
              await JobsController.cancelOffer(job_data._id)
              delete job_data.offer_received
              set_job_data(job_data)
              res()
            }
          },
          onCancel: res
        })
      })
    } else {
      await JobsController.changeJobStatus(job_data._id, "available");
    }
    changeRoute({ name: "searching", props: { keyword } });
  };

  const handleJobApprove = () => {
    AnimationsController.CardUISlideOut(
      cardRef,
      () => {
        JobsController.changeJobStatus(job_data._id, "accepted", authState.userID);
        // Save job ID in local storage to retrieve it later on.

        setAccepted(true)
        changeRoute({ name: "acceptedJob", props: { projectManagerInfo: projectManager, job_data } });
      },
      true
    );
  };

  const handleStartNegotiation = useCallback(async () => {
    setEnableNegotiation(true)
  }, [])

  if (!loading) {
    return (
      enableNegotiation ?
        <NegotiationView deployee={authState.userID} onCancel={() => setEnableNegotiation(false)} onSubmit={(job) => {
          setEnableNegotiation(false)
          set_job_data(job)
        }} job_data={job_data} />
        :
        (
          <Card ref={cardRef}>
            <View>
              <ProfilePicture
                source={{
                  uri: `${env.API_URL}${job_data.posted_by_profile_picture}`,
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
                    <Text small light marginBottom="5px">
                      Job Description
                </Text>
                    <Text small marginBottom="5px">
                      ${job_data.salary}/hr
                </Text>
                  </JobDescription>

                  {description.map((item) => {
                    return <Text key={item.id}>{item.text}</Text>;
                  })}
                </JobDescriptionRow>
              </Row>

              {job_data.photo_files && job_data.photo_files.length > 0 &&
                <Row>
                  <PhotosRow>
                    <JobDescription>
                      <Text small light marginBottom="5px">Photos</Text>
                    </JobDescription>

                    <FlatList data={job_data.photo_files}
                      keyExtractor={v => v}
                      centerContent
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      renderItem={({ item }) => (
                        <PhotoItem item={{ uri: `${config.API_URL}/job/${job_data._id}/${item}` }} />
                      )} />
                  </PhotosRow>
                </Row>
              }

              <CardOptionItem row>
                <Text small>Reviews</Text>
              </CardOptionItem>

              {job_data.offer_received && job_data.offer_received.deployee === authState.userID ?
                <Button negotiationSent style={{ marginHorizontal: 24, marginVertical: 12, justifyContent: 'center' }} disabled>
                  <Text style={{ color: "white", textAlign: 'center' }} medium>Offer Sent</Text>
                </Button>
                :
                <Button negotiate style={{ marginHorizontal: 24, marginVertical: 12, justifyContent: 'center' }} onPress={handleStartNegotiation}>
                  <Text style={{ color: "#00bfff", textAlign: 'center' }} medium>Negotiate Offer</Text>
                </Button>
              }

              <Row last>
                <Column>
                  <Button decline onPress={() => handleJobDecline()}>
                    <Text style={{ color: "red" }} medium>
                      Decline
                </Text>
                  </Button>
                </Column>

                {job_data.offer_received && job_data.offer_received.deployee === authState.userID ?
                  null :
                  <Column>
                    <Button accept onPress={() => handleJobApprove()}>
                      <Text style={{ color: "white" }} medium>Accept</Text>
                    </Button>
                  </Column>
                }
              </Row>
            </View>
          </Card>
        )
    );
  } else {
    return <View><ActivityIndicator /></View>;
  }
}

const NegotiationView = ({ job_data, deployee, onCancel, onSubmit }) => {
  const [loading, setLoading] = useState(false)
  const [salary, setSalary] = useState('')

  const onSubmitOffer = useCallback(async () => {
    if (salary) {
      setLoading(true)

      const offer = parseFloat(salary).toFixed(2)
      if (Number.isNaN(offer) || isNaN(offer)) {
        return
      }
      await new Promise(async (res) => {
        Confirm({
          title: 'Confirm Offer',
          message: `Suggest offer of $${offer}/hour to deployer?`,
          options: ['yes', 'cancel'],
          cancelButtonIndex: 1,
          onPress: async (number) => {
            if (number === 0) {
              // Save offer
              try {
                const offer_received = await JobsController.sendOffer(job_data._id, deployee, offer)
                job_data.offer_received = offer_received
                onSubmit(job_data)
              } catch (e) {
                console.log(e, 'negotiation send failed')
                Alert.alert('Failed to confirm offer')
              }
            }
            res()
          },
          onCancel: res
        })
      })

      setLoading(false)
    }
  }, [loading, deployee, job_data, salary])

  return (
    <Card>
      <View>
        <Row>

          <JobDescriptionRow>
            <JobDescription>
              <Text small light marginBottom="5px">Current Offer</Text>
              <Text small marginBottom="5px">
                ${job_data.salary}/hr
            </Text>
            </JobDescription>

            <Text small style={{ textTransform: 'uppercase', marginVertical: 16, textAlign: 'center' }} bold>
              What offer would you prefer this job?
            </Text>


            <View style={{ marginVertical: 10 }}>
              <WageInput>
                <SalaryField style={{ justifyContent: 'center' }}>
                  <TextField
                    disabled={loading}
                    suffix="/hr"
                    label="PAY"
                    prefix="$"
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
          <Column style={{ alignItems: 'center' }}>
            <Button disabled={loading} decline onPress={onCancel}>
              <Text style={{ color: "red" }} medium>
                Cancel
            </Text>
            </Button>
          </Column>
          <Column>
            <Button disabled={loading} style={{ flexDirection: 'row' }} accept onPress={onSubmitOffer}>
              {loading ? <ActivityIndicator animating style={{ marginEnd: 4 }} color='white' /> : null}
              <Text style={{ color: "white" }} medium>Save</Text>
            </Button>
          </Column>
        </Row>
      </View>
    </Card>
  )
}

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
  padding-right: 50px;
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
  margin-bottom: 4
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
