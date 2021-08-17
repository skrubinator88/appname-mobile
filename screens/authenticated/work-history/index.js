import { Feather } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { default as React, useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native";
import { StatusBar } from "react-native";
import { ActivityIndicator, Dimensions, Image } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import styled from "styled-components/native";
import { GlobalContext } from "../../../components/context";
import Header from "../../../components/headerAndContainerGrow";
import Text from "../../../components/text";
import { JOB_CONTEXT } from "../../../contexts/JobContext";
import config from "../../../env";
import { CurrencyFormatter } from "../payment/components";



const statusBarHeight = getStatusBarHeight();
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function WorkHistory({ navigation }) {
  const { authState } = useContext(GlobalContext)
  const { getCompletedJobs } = useContext(JOB_CONTEXT);
  const { colors } = useTheme();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getCompletedJobs()
      .then(jobs => setJobs(jobs))
    return () => {
      setJobs([]);
    };
  }, [authState.userID]);

  return (
    <KeyboardAvoidingView enabled behavior="padding" style={{ flex: 1 }}>
      <StatusBar barStyle='dark-content' />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always">
        <Header
          disableContainer={true}
          navigation={navigation}
          headerBackground={colors.primary}
          backColor="white"
          style={{ backgroundColor: "red" }} />
        {jobs.map((item) => (
          // Visualize job
          <WorkHistoryItem item={item} />
        ))}
        {jobs.length <= 0 && (
          <NoMessageBanner>
            <Feather name="file-text" size={width * 0.4} color="#ccc" style={{ margin: 20 }} />
            <Text bold color="#ccc">
              You have not completed any work.
            </Text>
            <Text bold color="#ccc">
              Start now! Many opportunities are waiting for you.
            </Text>
          </NoMessageBanner>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function WorkHistoryItem({ item }) {
  const { authState } = useContext(GlobalContext);
  const [state, setState] = useState({ loading: true, showCounterOffer: false });

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

        const deployer = await response.json();
        deployer.id = item.executed_by;
        setState({
          ...state,
          loading: false,
          deployer,
          name: `${deployer.first_name} ${deployer.last_name}`,
          occupation: deployer.occupation,
          starRate: Number(deployer.star_rate),
        });
      } catch (e) {
        console.log(e, "Load job fail");
        setState({ ...state, loading: false });
      }
    })();
  }, [item]);

  return state.loading ? (
    <Item key={item.id} style={{ padding: 20, paddingVertical: 48, alignSelf: "stretch", justifyContent: "center" }}>
      <ActivityIndicator color="darkgrey" />
    </Item>
  ) : (
    <Item key={item.id}>
      <JobItemLink activeOpacity={0.6} onPress={() => { }}>
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
                  uri: `${config.API_URL}/images/${state.deployer.id}.jpg`,
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
    </Item >
  );
}


const NoMessageBanner = styled.View`
  height: ${height - statusBarHeight * 4}px;
  justify-content: center;
  align-items: center;
`;

const Item = styled.View`
  flex: 1;
  background: white;
  margin: 10px 0 0 0;
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
