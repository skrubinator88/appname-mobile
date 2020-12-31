import React, { useState, useEffect, useContext, useCallback } from "react";

import { View, ActivityIndicator } from "react-native";

import { Platform } from "react-native";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";

import { unix } from "moment";

// Functions
import { isCurrentJob } from '../../../functions'

// Components
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";

// Context
import { GlobalContext } from "../../../components/context";

// Controllers
import JobsControllers from "../../../controllers/JobsControllers";

// Redux
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

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
      // console.log("runned");
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
        nextTitle="Save"
        color="white"
        title="Job Listings"
        titleWeight="300"
        headerBackground="#3869f3"
        nextProvider="Entypo"
        nextIcon="dots-three-horizontal"
        nextSize={25}
        nextAction={() => { }}
      >
        {/* Payments Section */}
        <Item>
          <JobItemLink onPress={() => navigation.navigate("Listing Item")}>
            <JobItemRow>
              <Row>
                <Text small weight="700" color="#1b5cce">
                  NEW JOB POSTING
                </Text>
              </Row>
            </JobItemRow>
          </JobItemLink>
        </Item>

        <JobSection>
          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                UNASSIGNED
              </Text>
            </View>
          </SectionTitle>

          {listings.map(
            (item) => (item.status == "available" || item.status == "in review") && <ListItemDetail isCurrentJob={isCurrentJob(item)} navigation={navigation} item={item} />
          )}

          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                IN PROGRESS
              </Text>
            </View>
          </SectionTitle>

          {listings.map(
            (item) =>
              (item.status == "in progress" || item.status == "accepted") && (
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
              )
          )}
        </JobSection>
      </Container>
    </>
  );
}

const ListItemDetail = ({ item, navigation, isCurrentJob: current }) => {
  const [timeToShow, setTimeToShow] = useState(current ? unix(item.start_at / 1000).fromNow() : '')
  useFocusEffect(useCallback(() => {
    if (isCurrentJob) {
      setTimeToShow(unix(item.start_at / 1000).fromNow())
    }
  }, [navigation, item]))

  return (
    <Item key={item.id}>
      <JobItemLink>
        <JobItemRow>
          <Column>
            <Row>
              <Text small weight="700" color="#1b5cce">
                {item.job_type}
              </Text>
              {current ?
                <Text textTransform='uppercase' small>Active</Text>
                :
                <Text textTransform='uppercase' color='#a44' small>Scheduled</Text>
              }
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
            {!current ?
              (
                <Row style={{ marginTop: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
                  <FontAwesome style={{ marginEnd: 4, color: '#444' }} name='clock-o' />
                  <Text color='#888' small>Available {timeToShow}</Text>
                </Row>
              )
              : null}
          </Column>
        </JobItemRow>
      </JobItemLink>
    </Item>
  )
}

// Payments Section
const Item = styled.View`
  flex: 1;
  background: white;
  margin: 10px 0 0 0;
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

const JobItemLink = (props) => (
  <Setup {...props} activeOpacity={0.6}>
    {props.children}
  </Setup>
);
const Setup = styled.TouchableOpacity`
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
  justify-content: space-between;
`;
